import { API_BASE } from "./config.js";
import { auth } from "./auth.js";

import {
  onAuthStateChanged,
  getIdToken,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

let currentUid = null;
let idToken = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUid = user.uid;
    try {
      idToken = await getIdToken(user); // 백엔드가 Bearer 토큰을 원하면 사용
    } catch (_) {}
  } else {
    currentUid = null;
    idToken = null;
  }
});

// 요소 참조
const modal = document.getElementById("questionModal");
const modalQuestion = document.querySelector(".modal-question");
const confirmBtn = document.querySelector(".modal-confirm");
const bubbles = document.querySelectorAll(".bubble");
let activeBubble = null; // 현재 클릭된 말풍선
const submitBtn = document.getElementById("submitAnswersBtn");

if (modal && confirmBtn && bubbles.length) {
  // 말풍선 클릭 → 모달 열기 + 질문 텍스트 주입 + 선택 초기화
  bubbles.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeBubble = btn;
      // ✅ 질문 원문으로 모달에 표시
      modalQuestion.textContent =
        btn.dataset.question || btn.textContent.trim();
      document.getElementById("scoreSlider").value = 3;
      modal.style.display = "flex";
    });
  });

  // 바깥 영역 클릭 → 모달 닫기
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // 확인 버튼 → 일단 닫기만 (다음 단계에서 점수 처리)
  confirmBtn.addEventListener("click", () => {
    const selectedValue = document.getElementById("scoreSlider").value;

    if (activeBubble) {
      // 데이터 저장
      activeBubble.dataset.score = selectedValue;

      // 스타일 갱신
      activeBubble.style.backgroundColor = "#2a6ef4";
      activeBubble.style.color = "#fff";

      // 텍스트 갱신 (질문 + 점수)
      const qText =
        activeBubble.dataset.question || activeBubble.textContent.trim();
      activeBubble.textContent = `${qText} (${selectedValue})`;
    }
    // 모든 말풍선 응답 완료 여부 확인
    const allAnswered = Array.from(bubbles).every(
      (b) => b.dataset.score && b.dataset.score !== ""
    );
    // 모두 완료되면 안내 문구 숨기고 이모티콘 표시 변경
    if (allAnswered) {
      const hint = document.querySelector(".emoji-hint");
      if (hint) hint.style.display = "none";

      // 1) 이모티콘 결정 (임시 규칙: 항상 😄)
      //    원하면 평균 점수로 분기하도록 나중에 바꿀 수 있어요.
      const newEmoji = "😄";

      // 2) 이모티콘 표시
      const emojiEl = document.querySelector(".emoji-placeholder");
      if (emojiEl) emojiEl.textContent = newEmoji;

      // ✅ 로그 저장
      const now = new Date();
      const timestamp = now.toLocaleString("ko-KR", {
        dateStyle: "short",
        timeStyle: "medium",
      });

      // 기존 로그 불러오기
      const logs = JSON.parse(localStorage.getItem("mymojiLogs") || "[]");

      // 새로운 기록 추가
      logs.unshift({ timestamp, emoji: newEmoji });

      // 다시 저장
      localStorage.setItem("mymojiLogs", JSON.stringify(logs));

      // ✅ 제출 버튼 활성화
      if (submitBtn) submitBtn.disabled = false;
    }

    modal.style.display = "none";
  });
}
// ===========================
// 내비게이션 active 전환 기능
// ===========================
const navButtons = document.querySelectorAll(".nav-item");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // 기존 active 제거
    navButtons.forEach((b) => b.classList.remove("active"));
    // 클릭된 버튼에 active 추가
    btn.classList.add("active");
  });
});

// ===========================
// 내비게이션 페이지 이동 기능
// ===========================
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const page = btn.dataset.page;

    if (page === "home") {
      window.location.href = "home.html";
    } else if (page === "record") {
      window.location.href = "record.html";
    } else if (page === "settings") {
      window.location.href = "settings.html";
    }
  });
});
// ===========================
// 현재 페이지에 맞게 active 적용
// ===========================
const currentPage = location.pathname.split("/").pop();

navButtons.forEach((btn) => {
  const page = btn.dataset.page;
  btn.classList.remove("active");

  if (
    (currentPage === "home.html" && page === "home") ||
    (currentPage === "record.html" && page === "record") ||
    (currentPage === "settings.html" && page === "settings")
  ) {
    btn.classList.add("active");
  }
});

// ========== 1) 오늘의 질문 불러와서 말풍선에 바인딩 ==========
let dailyQuestions = []; // 상태 저장

async function loadDailyQuestions() {
  try {
    const res = await fetch(`${API_BASE}/api/questions/daily`, {
      method: "GET",
      headers: { Accept: "application/json" },
      // credentials: "include", // 쿠키 세션 쓸 때만 활성화
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    // 서버 JSON 구조에 따라 조정 (data.questions 또는 data)
    const data = await res.json();
    // 예: [{ questionId: 12, content: "오늘의 기분은 어땠나요?" }, ...]
    const list = Array.isArray(data) ? data : data.questions || [];

    dailyQuestions = list.slice(0, 6); // 6개만 사용
    console.log("dailyQuestions:", dailyQuestions);

    // 말풍선 요소들에 질문 텍스트/ID 주입
    const bubbles = document.querySelectorAll(".bubble");
    dailyQuestions.forEach((q, idx) => {
      const b = bubbles[idx];
      if (!b) return;
      b.textContent = q.content; // 첫 렌더 텍스트
      b.dataset.qid = q.questionId; // 질문 ID
      b.dataset.question = q.content; // ✅ 질문 원문 저장
      b.dataset.score = ""; // 초기화
    });
  } catch (err) {
    console.error("질문 불러오기 실패:", err);
  }
}

// 페이지 로드 시 자동 실행
document.addEventListener("DOMContentLoaded", () => {
  loadDailyQuestions();
  loadLatestEmoji(); // ✅ 최신 이모티콘도 함께 불러오기
});

function collectAnswers() {
  const answers = [];
  document.querySelectorAll(".bubble").forEach((b) => {
    const qid = Number(b.dataset.qid);
    const score = Number(b.dataset.score);
    if (!Number.isNaN(qid) && !Number.isNaN(score) && b.dataset.score !== "") {
      answers.push({ questionId: qid, score }); // ✅ 서버 Dto와 동일한 키
    }
  });
  return answers;
}

if (submitBtn) {
  submitBtn.addEventListener("click", async () => {
    // 0) 로그인/uid 확인
    if (!currentUid) {
      alert("다시 로그인해줘!");
      window.location.href = "index.html";
      return;
    }

    // 1) 말풍선에서 답 수집 (questionId, score)
    const payload = [...document.querySelectorAll(".bubble")]
      .map((b) => {
        const qid = Number(b.dataset.qid);
        const score = Number(b.dataset.score);
        if (!qid || !score) return null;
        return { questionId: qid, score };
      })
      .filter(Boolean);

    if (payload.length === 0) {
      alert("답변이 비어있어. 각 질문에 점수를 선택해줘!");
      return;
    }

    // 2) 버튼 잠그고 로딩 표시
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "전송 중...";

    try {
      // 3) 전송 (백엔드가 배열을 받는다고 가정)
      const res = await fetch(`${API_BASE}/api/answers/${currentUid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 백엔드가 인증 토큰을 요구하면 주석 해제
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      // 4) 응답 확인
      const text = await res.text(); // 실패 메시지가 순수 텍스트일 수도 있으니 우선 text로
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) {
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      // 5) 성공 처리: 화면 잠그고 안내/이동
      //  - 원하면 여기서 이모티콘/로그 저장도 가능 (이미 네가 저장 로직 있음)
      document.querySelectorAll(".bubble").forEach((b) => {
        b.style.pointerEvents = "none";
        b.style.opacity = 0.7;
      });

      alert("제출 완료! 기록 탭에서 확인해봐.");
      window.location.href = "record.html";
    } catch (err) {
      alert(`제출 실패: ${err.message || err}`);
    } finally {
      // 6) 버튼 복구
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ✅ 최신 이모티콘 불러오기 함수
async function loadLatestEmoji() {
  if (!currentUid) {
    console.warn("로그인되지 않음 — 최신 이모티콘 불러오지 않음");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/${currentUid}/latestEmoji`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ latestEmoji data:", data);
  } catch (err) {
    console.error("❌ 최신 이모티콘 불러오기 실패:", err);
  }
}

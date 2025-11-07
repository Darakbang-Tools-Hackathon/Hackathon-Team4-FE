// 요소 참조
const modal = document.getElementById("questionModal");
const modalQuestion = document.querySelector(".modal-question");
const confirmBtn = document.querySelector(".modal-confirm");
const bubbles = document.querySelectorAll(".bubble");
let activeBubble = null; // 현재 클릭된 말풍선
if (modal && confirmBtn && bubbles.length) {
  // 말풍선 클릭 → 모달 열기 + 질문 텍스트 주입 + 선택 초기화
  bubbles.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeBubble = btn; // 클릭한 말풍선 기억
      modalQuestion.textContent = btn.textContent.trim();
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
      const trait =
        activeBubble.dataset.trait || activeBubble.textContent.trim();
      activeBubble.textContent = `${trait} (${selectedValue})`;
    }
    // 모든 말풍선 응답 완료 여부 확인
    const allAnswered = Array.from(bubbles).every(
      (b) => b.dataset.score !== undefined
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

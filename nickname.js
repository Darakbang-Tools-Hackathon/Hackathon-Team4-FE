// nickname.js
import { auth } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

export function initNickname() {
  const nicknameEl = document.getElementById("nickname");

  if (!nicknameEl) return; // 페이지에 요소가 없으면 종료

  // 캐시 닉네임 먼저 표시
  const cached = localStorage.getItem("nickname");
  if (cached) {
    nicknameEl.textContent = cached;
  }

  // 로그인 상태 감지
  onAuthStateChanged(auth, (user) => {
    if (user) {
      let name = user.displayName?.trim() || localStorage.getItem("nickname");
      if (!name && user.email) name = user.email.split("@")[0];
      nicknameEl.textContent = name || "사용자";
      if (name) localStorage.setItem("nickname", name);
    } else {
      nicknameEl.textContent = "게스트";
    }
  });
}

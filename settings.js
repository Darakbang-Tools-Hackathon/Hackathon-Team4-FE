// settings.js
import { auth } from "./auth.js";
import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {
  if (logoutBtn) {
    logoutBtn.disabled = !user;
  }
});

logoutBtn?.addEventListener("click", async () => {
  if (!confirm("정말 로그아웃할까요?")) return;
  try {
    await signOut(auth);
    localStorage.removeItem("nickname");
    alert("로그아웃 되었습니다.");
    window.location.href = "index.html";
  } catch (err) {
    alert(`로그아웃 실패: ${err?.message || err}`);
  }
});


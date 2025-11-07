// login.js
import { auth } from "./auth.js";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence, // 탭/브라우저 꺼도 유지
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const pwInput = document.getElementById("password");
const btn = document.getElementById("loginBtn");

// 1) 로그인 유지 설정(선택: 로컬에 세션 유지)
await setPersistence(auth, browserLocalPersistence);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = pwInput.value.trim();

  if (!email || !password) {
    alert("이메일과 비밀번호를 입력해줘!");
    return;
  }

  btn.disabled = true;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    // 닉네임(displayName) 있으면 캐싱해서 홈에서 인삿말에 쓰자
    const user = cred.user;
    if (user?.displayName) {
      localStorage.setItem("nickname", user.displayName);
    } else {
      localStorage.removeItem("nickname");
    }

    alert("로그인 성공!");
    window.location.href = "home.html";
  } catch (err) {
    // 에러 코드 간단 매핑
    let msg = "로그인 실패";
    if (err.code === "auth/invalid-email") msg = "이메일 형식이 올바르지 않아.";
    if (err.code === "auth/user-not-found") msg = "가입되지 않은 이메일이야.";
    if (err.code === "auth/wrong-password") msg = "비밀번호가 맞지 않아.";
    if (err.code === "auth/too-many-requests")
      msg = "시도가 너무 많아. 잠시 후 다시 시도해줘.";
    alert(`${msg}\n(${err.code})`);
  } finally {
    btn.disabled = false;
  }
});

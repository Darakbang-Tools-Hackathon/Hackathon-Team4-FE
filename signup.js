// import { auth } from "./auth.js";
// import {
//   createUserWithEmailAndPassword,
//   updateProfile,
// } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// const form = document.getElementById("signupForm");
// const emailInput = document.getElementById("email");
// const pwInput = document.getElementById("password");
// const nicknameInput = document.getElementById("nickname");
// const btn = document.getElementById("signupBtn");

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const email = emailInput.value.trim();
//   const password = pwInput.value.trim();
//   const nickname = nicknameInput.value.trim();

//   if (!email || !password || !nickname) {
//     alert("모든 필드를 입력해줘!");
//     return;
//   }

//   btn.disabled = true;

//   try {
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );

//     // 닉네임 저장
//     await updateProfile(userCredential.user, { displayName: nickname });

//     alert("회원가입 완료! 로그인 페이지로 이동할게.");
//     window.location.href = "index.html";
//   } catch (err) {
//     let msg = "회원가입 실패";
//     if (err.code === "auth/email-already-in-use")
//       msg = "이미 사용 중인 이메일이야.";
//     if (err.code === "auth/invalid-email") msg = "이메일 형식이 잘못됐어.";
//     if (err.code === "auth/weak-password") msg = "비밀번호는 6자 이상이야.";
//     alert(`${msg}\n(${err.code})`);
//   } finally {
//     btn.disabled = false;
//   }
// });

import { API_BASE } from "./config.js";

const form = document.getElementById("signupForm");
const emailInput = document.getElementById("email");
const pwInput = document.getElementById("password");
const nicknameInput = document.getElementById("nickname");
const btn = document.getElementById("signupBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = pwInput.value.trim();
  const nickname = nicknameInput.value.trim();

  if (!email || !password || !nickname) {
    alert("모든 필드를 입력해줘!");
    return;
  }

  btn.disabled = true;

  try {
    // ✅ Firebase 대신 우리 API 서버로 요청 보내기
    const res = await fetch(`${API_BASE}/api/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, nickname }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}`);
    }

    // 닉네임 저장 (나중에 홈 화면 인삿말 표시용)
    localStorage.setItem("nickname", nickname);

    alert("회원가입 완료! 로그인 페이지로 이동할게.");
    window.location.href = "index.html";
  } catch (err) {
    alert(`회원가입 실패: ${err.message}`);
  } finally {
    btn.disabled = false;
  }
});

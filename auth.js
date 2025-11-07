// Firebase SDK import
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// 🔹 네가 방금 복사한 firebaseConfig 붙여넣기 🔹
const firebaseConfig = {
  apiKey: "AIzaSyCYXFnGPtaC6x5PePR_3MWBRyuKgS-Zl-U",
  authDomain: "mymoji-73145.firebaseapp.com",
  projectId: "mymoji-73145",
  storageBucket: "mymoji-73145.firebasestorage.app",
  messagingSenderId: "901815945033",
  appId: "1:901815945033:web:7679511649aa0092b07c98",
  measurementId: "G-970MSQWHPP",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

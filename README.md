# Hackathon-Team4

# 🌈 MyMoji — 나를 나타내는 감정 이모티콘

> 하루의 감정과 성향을 기록하고, 나를 대표하는 이모티콘으로 표현하는 감정 기록 웹앱  
> **Frontend:** HTML · CSS · JavaScript  
> **Backend:** Spring Boot · Firebase (Auth)

---

## 🧩 프로젝트 개요

**MyMoji**는 사용자의 감정과 성격 데이터를 바탕으로  
매일 다른 이모티콘을 추천해주는 프로젝트입니다.

사용자는 매일 간단한 5개의 질문에 답변하며  
자신의 성향(정서안정성, 외향성, 친화성, 성실성, 개방성)을 업데이트할 수 있습니다.  
이후 서버에서 해당 데이터와 평균 점수를 기반으로 맞춤형 이모티콘을 제공합니다.

---

## 🚀 주요 기능

| 구분                 | 설명                                                     |
| -------------------- | -------------------------------------------------------- |
| 🧑‍💻 회원가입 / 로그인 | Firebase Auth를 기반으로 구현                            |
| 🏠 홈 화면           | 상단 인삿말 + 오늘의 질문 5개 + 이모티콘 결과 표시       |
| 💬 질문 응답         | 말풍선 클릭 → 모달에서 1~5점 슬라이더 선택               |
| 💾 데이터 저장       | 각 질문의 `{questionId, score}` 로컬 저장 및 백엔드 전송 |
| 📅 기록 탭           | 날짜/시간별로 생성된 이모티콘 로그 리스트                |
| ⚙️ 설정 탭           | 닉네임 및 사용자 정보 관리 (추가 예정)                   |

## 🧭 동작 흐름

1️⃣ **로그인 / 회원가입**  
→ Firebase 인증 or API `/api/users/signup`

2️⃣ **질문 불러오기**  
→ `GET /api/questions/daily`  
→ 5개의 질문 랜덤 수신 → 말풍선 UI에 표시

3️⃣ **답변 입력 (1~5점)**  
→ 각 말풍선에 점수 저장 (`data-qid`, `data-score`)

4️⃣ **응답 완료 시**  
→ `{questionId, score}` 5개를 한꺼번에 백엔드 `/api/answers/daily`로 전송  
→ 백엔드에서 이모티콘 결정 후 반환

5️⃣ **기록 탭 반영**  
→ localStorage + 백엔드 기록 동기화

---

## 🧱 기술 스택

| 구분     | 기술                                          |
| -------- | --------------------------------------------- |
| Frontend | HTML, CSS, JavaScript (Vanilla)               |
| UI / UX  | Custom Modal, Slider Input, Responsive Design |
| Backend  | Spring Boot (REST API), Firebase Admin SDK    |
| Auth     | Firebase Authentication (Email/Password)      |
| Tools    | VSCode, GitHub, Git, Postman                  |

## 🎨 주요 화면

| 화면                     | 설명                                         |
| ------------------------ | -------------------------------------------- |
| 🏠 **홈 화면**           | 질문 5개 말풍선 + 이모티콘 표시 + 네비게이션 |
| 💬 **모달 창**           | 각 질문에 1~5점 슬라이더 선택                |
| 📅 **기록 탭**           | 날짜/시간 + 이모티콘 리스트                  |
| 👤 **회원가입 / 로그인** | 간결한 입력 폼 + Firebase 인증               |

---

## 🧑‍🤝‍🧑 팀 소개 (Hackathon Team 4)

| 이름   | 역할                            |
| ------ | ------------------------------- |
| 정영진 | Frontend (UI/UX, JS 로직)       |
| 박세환 | Backend (Spring Boot, API 설계) |

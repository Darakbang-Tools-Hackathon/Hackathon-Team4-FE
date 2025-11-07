// localStorage에서 기록 읽기
const logs = JSON.parse(localStorage.getItem("mymojiLogs") || "[]");

// 기록이 들어갈 컨테이너
const listEl = document.getElementById("logList");

// 디버그: 콘솔에서 먼저 확인
console.log("mymojiLogs:", logs);

// 로그가 있을 때: 렌더링
if (logs.length > 0) {
  // "기록 없음" 문구 제거
  const emptyMsg = document.querySelector(".log-empty");
  if (emptyMsg) emptyMsg.remove();

  // 각 로그를 순서대로 추가
  logs.forEach((log) => {
    const item = document.createElement("div");
    item.className = "log-item";

    item.innerHTML = `
      <div class="log-time">${log.timestamp}</div>
      <div class="log-emoji">${log.emoji}</div>
    `;

    listEl.appendChild(item);
  });
}

// 기록 비우기
document.getElementById("clearLogsBtn")?.addEventListener("click", () => {
  localStorage.removeItem("mymojiLogs");
  listEl.innerHTML = '<p class="log-empty">아직 기록이 없어요</p>';
});

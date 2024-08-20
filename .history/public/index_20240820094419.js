const socket = io();
let name = localStorage.getItem("name");
let room = localStorage.getItem("room");
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

// Kiểm tra nếu không có tên hoặc phòng, quay lại trang join
if (!name || !room) {
  window.location.href = "/join.html";
}

// Tham gia phòng
socket.emit("joinRoom", room);
console.log(`Joined room: ${room}`);

// Xử lý sự kiện khi nhấn phím "Enter" để gửi tin nhắn
textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

// Xử lý sự kiện khi người dùng nhấn vào biểu tượng gửi tin nhắn
document
  .querySelector(".bi-chat-right-text-fill")
  .addEventListener("click", function () {
    sendMessage(textarea.value.trim());
  });

function sendMessage(message) {
  if (message.trim() === "") return;

  let msg = {
    user: name,
    room: room,
    message: message.trim(),
  };

  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  // Gửi tin nhắn đến server cho phòng hiện tại
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  mainDiv.classList.add(type, "message");

  {
    /* <h4>${msg.user}</h4> */
  }

  let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
  `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// Nhận tin nhắn từ server và hiển thị
socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

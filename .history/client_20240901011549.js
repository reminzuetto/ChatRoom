const socket = io();

const form = document.getElementById("messageForm");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value;

  // Gửi tin nhắn đến server
  socket.emit("message", {
    user: "yourUsername", // Thay đổi thành tên người dùng thực tế
    room: "yourRoomName",
    message: message,
  });
  messageInput.value = "";
});

socket.on("message", (msg) => {
  // Xử lý tin nhắn nhận được
  const messageArea = document.getElementById("messageArea");
  const messageElement = document.createElement("div");
  messageElement.textContent = `${msg.user}: ${msg.message}`;
  messageArea.appendChild(messageElement);
});

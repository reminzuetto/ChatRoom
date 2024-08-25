const socket = io("https://your-backend-url.onrender.com"); // Thay thế với URL backend của bạn

const form = document.getElementById("messageForm");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value;

  // Gửi tin nhắn đến server
  socket.emit("message", { room: "yourRoomName", text: message });
  messageInput.value = "";
});

socket.on("message", (msg) => {
  // Xử lý tin nhắn nhận được
  const messageArea = document.getElementById("messageArea");
  const messageElement = document.createElement("div");
  messageElement.textContent = msg.text;
  messageArea.appendChild(messageElement);
});

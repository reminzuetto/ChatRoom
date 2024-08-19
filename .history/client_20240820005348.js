const socket = io();

const form = document.getElementById("messageForm");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value;

  // Send message to server
  socket.emit("message", { room: "yourRoomName", text: message });

  messageInput.value = "";
});

socket.on("message", (msg) => {
  // Handle incoming message
  const messageArea = document.getElementById("messageArea");
  const messageElement = document.createElement("div");
  messageElement.textContent = msg.text;
  messageArea.appendChild(messageElement);
});

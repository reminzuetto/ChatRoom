const socket = io();

const joinForm = document.getElementById("joinForm");
const chatArea = document.getElementById("chatArea");
const messageArea = document.getElementById("messageArea");
const messageInput = document.getElementById("messageInput");
const logoutButton = document.getElementById("logoutButton");

// Handle form submission
joinForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const room = document.getElementById("room").value;

  socket.emit("joinRoom", room);

  // Hide join form and show chat area
  joinForm.style.display = "none";
  chatArea.style.display = "block";

  // Listen for messages
  socket.on("message", (msg) => {
    const messageElement = document.createElement("div");
    messageElement.textContent = msg.text;
    messageArea.appendChild(messageElement);
  });
});

// Handle message sending
document.getElementById("send-icon").addEventListener("click", () => {
  const message = messageInput.value;
  socket.emit("message", {
    room: document.getElementById("room").value,
    text: message,
  });
  messageInput.value = "";
});

// Handle logout
logoutButton.addEventListener("click", () => {
  const room = document.getElementById("room").value;
  socket.emit("logout", room);
  chatArea.style.display = "none";
  joinForm.style.display = "block";
});

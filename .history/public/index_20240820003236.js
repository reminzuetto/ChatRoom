let name;
let room;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

// Yêu cầu người dùng nhập tên
do {
  name = prompt("Please enter your name: ");
} while (!name);

// Xử lý sự kiện khi người dùng chọn phòng và tham gia phòng
document.getElementById("joinRoom").addEventListener("click", () => {
  room = document.getElementById("rooms").value;
  if (room) {
    socket.emit("joinRoom", room);
  }
});

// Xử lý sự kiện khi nhấn phím "Enter" để gửi tin nhắn
textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
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

// Xử lý sự kiện khi người dùng nhấn vào biểu tượng gửi tin nhắn
document.querySelector(".textarea i").addEventListener("click", function () {
  sendMessage(textarea.value.trim());
});

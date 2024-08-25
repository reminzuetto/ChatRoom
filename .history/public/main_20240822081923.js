const socket = io();
let name = localStorage.getItem("name");
let room = localStorage.getItem("room");
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");
let dropdownButton = document.querySelector(".dropdown-button");
let dropdownContent = document.querySelector(".dropdown-content");
let dropdownCaret = document.querySelector(".dropdown__caret");

// Kiểm tra nếu không có tên hoặc phòng, quay lại trang join
if (!name || !room) {
  window.location.href = "/index.html";
}

// Tham gia phòng
socket.emit("joinRoom", room);
console.log(`Joined room: ${room}`);

document.addEventListener("DOMContentLoaded", function () {
  // Lấy thông tin từ localStorage
  const name = localStorage.getItem("name");
  const room = localStorage.getItem("room");

  // Kiểm tra nếu đã có tên và phòng thì hiển thị chúng
  if (name && room) {
    // Cập nhật phần tử hiển thị tên người dùng và phòng
    const roomContent = document.getElementsByClassName("room__content");
    roomContent[0].textContent = `Room: ${room}`;
  }
});

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

  let markup = "";
  if (msg.user === name) {
    markup = `<p>${msg.message}</p>`;
  } else {
    markup = `
      <h4>${msg.user}</h4>
      <p>${msg.message}</p>
    `;
  }

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// Nhận tin nhắn từ server và hiển thị
socket.on("message", (msg) => {
  // Kiểm tra điều kiện: nếu người gửi khác tên hiện tại
  if (msg.user !== name) {
    appendMessage(msg, "incoming");
  } else {
    // Nếu tên người gửi trùng với tên hiện tại, gửi lại tin nhắn để hiển thị
    appendMessage(msg, "outgoing");
  }
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

// Xử lý sự kiện click để hiển thị/ẩn dropdown
dropdownButton.addEventListener("click", function (event) {
  event.stopPropagation(); // Ngăn chặn sự kiện click tiếp tục đến các phần tử bên ngoài
  dropdownContent.classList.toggle("show");
  dropdownCaret.classList.toggle("bi-caret-down-fill");
  dropdownCaret.classList.toggle("bi-caret-up-fill");
});

// Xử lý sự kiện click để logout
document
  .querySelector(".dropdown-item")
  .addEventListener("click", function (event) {
    event.stopPropagation(); // Ngăn chặn sự kiện click tiếp tục đến các phần tử bên ngoài

    // Hiển thị hộp thoại xác nhận
    if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      // Nếu người dùng chọn OK
      // alert("Log out...");
      // Xóa localStorage và chuyển hướng đến trang index.html
      localStorage.removeItem("name");
      localStorage.removeItem("room");
      window.location.href = "/index.html";
    } else {
      // Nếu người dùng chọn Cancel
      // Tắt thông báo
      console.log("Đăng xuất bị hủy");
    }
  });

// Đóng dropdown nếu nhấp ra ngoài
window.addEventListener("click", function (event) {
  if (
    !event.target.closest(".dropdown-button") &&
    !event.target.closest(".dropdown-content")
  ) {
    if (dropdownContent.classList.contains("show")) {
      dropdownContent.classList.remove("show");
      dropdownCaret.classList.remove("bi-caret-up-fill");
      dropdownCaret.classList.add("bi-caret-down-fill");
    }
  }
});

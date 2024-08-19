document.getElementById("joinForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const room = document.getElementById("room").value;

  // Lưu thông tin vào localStorage để sử dụng ở trang chat chính
  localStorage.setItem("name", name);
  localStorage.setItem("room", room);

  // Chuyển hướng đến trang chat chính
  window.location.href = "/index.html";
});

const dropdownSelect = document.querySelector(".dropdown__select");
const dropdownItems = document.querySelectorAll(".dropdown__item");
const dropdownSelected = document.querySelector(".dropdown__selected");
const dropdownList = document.querySelector(".dropdown__list");
const dropdown = document.querySelector(".dropdown");
const dropdownCaret = document.querySelector(".dropdown__caret");

// Xử lý sự kiện click vào nút dropdown để hiển thị hoặc ẩn danh sách
dropdownSelect.addEventListener("click", function (event) {
  dropdownList.classList.toggle("show");
  dropdownCaret.classList.toggle("fa-caret-up"); // Chuyển đổi biểu tượng caret
  dropdownCaret.classList.toggle("fa-caret-down"); // Chuyển đổi biểu tượng caret
});

// Xử lý sự kiện click vào mục trong dropdown
dropdownItems.forEach((item) => {
  item.addEventListener("click", function (event) {
    const text = event.target.querySelector(".dropdown__text").textContent;
    dropdownSelect.textContent = text; // Cập nhật văn bản của nút dropdown
    dropdownList.classList.remove("show"); // Ẩn danh sách
    dropdownCaret.classList.remove("fa-caret-up");
    dropdownCaret.classList.add("fa-caret-down");
  });
});

// Xử lý sự kiện click ra ngoài dropdown để ẩn danh sách
document.addEventListener("click", function (event) {
  if (!dropdown.contains(event.target)) {
    dropdownList.classList.remove("show"); // Ẩn danh sách
    dropdownCaret.classList.remove("fa-caret-up");
    dropdownCaret.classList.add("fa-caret-down");
  }
});

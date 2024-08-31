const crypto = require("crypto");

// Tạo khóa mã hóa (yêu cầu 256 bit)
const key = crypto.randomBytes(32).toString("hex"); //

console.log("Encryption Key:", key);

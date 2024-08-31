const crypto = require("crypto");

// Tạo khóa mã hóa (256-bit)
const key = crypto.randomBytes(32).toString("hex"); // 32 bytes = 256 bits

// Tạo IV (128-bit)
const iv = crypto.randomBytes(16).toString("hex"); // 16 bytes = 128 bits

console.log("Encryption Key:", key);
console.log("Initialization Vector (IV):", iv);

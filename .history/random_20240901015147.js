const crypto = require("crypto");

// Tạo mã khóa 32 bytes cho AES-256-CBC
const encryptionKey = crypto.randomBytes(32).toString("hex");

console.log(encryptionKey); // In mã khóa ra console

const crypto = require("crypto");

// Tạo mã khóa 32 bytes
const encryptionKey = crypto.randomBytes(32).toString("hex");

console.log(encryptionKey);

const crypto = require("crypto");

const algorithm = "aes-256-cbc"; // Sử dụng AES với khóa 256 bit (32 byte)
const key = crypto.randomBytes(32); // Tạo khóa ngẫu nhiên có độ dài 32 byte
const iv = crypto.randomBytes(16); // Tạo IV ngẫu nhiên có độ dài 16 byte

// Mã hóa tin nhắn
function encryptMessage(message) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Giải mã tin nhắn
function decryptMessage(encryptedMessage) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedMessage, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encryptMessage, decryptMessage };

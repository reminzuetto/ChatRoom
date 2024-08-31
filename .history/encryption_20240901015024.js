const crypto = require("crypto");

// Lấy ENCRYPTION_KEY từ file .env
const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // Chuyển đổi key từ hex sang buffer

// Mã hóa tin nhắn
function encryptMessage(message) {
  const iv = crypto.randomBytes(16); // Tạo IV ngẫu nhiên có độ dài 16 byte
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted; // Lưu IV cùng với tin nhắn mã hóa
}

// Giải mã tin nhắn
function decryptMessage(encryptedMessage) {
  const [ivHex, encrypted] = encryptedMessage.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encryptMessage, decryptMessage };

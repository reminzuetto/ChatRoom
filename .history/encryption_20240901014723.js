const crypto = require("crypto");

const encryptionKey = process.env.ENCRYPTION_KEY; // Khóa mã hóa từ biến môi trường

// Hàm mã hóa tin nhắn
function encryptMessage(message) {
  const iv = crypto.randomBytes(16); // Khởi tạo IV ngẫu nhiên cho mỗi tin nhắn
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    iv
  );
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// Hàm giải mã tin nhắn
function decryptMessage(encryptedMessage) {
  const parts = encryptedMessage.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = {
  encryptMessage,
  decryptMessage,
};

const crypto = require("crypto");
require("dotenv").config();

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
const ivLength = 16; // AES block size

function encrypt(text) {
  const iv = crypto.randomBytes(ivLength); // Tạo IV ngẫu nhiên cho mỗi tin nhắn
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  // Return IV và dữ liệu mã hóa kết hợp
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text) {
  console.log("Encrypted text received for decryption:", text);
  const textParts = text.split(":");
  if (textParts.length !== 2) {
    throw new Error("Invalid encrypted text format");
  }
  const iv = Buffer.from(textParts[0], "hex");
  const encryptedText = Buffer.from(textParts[1], "hex");
  console.log("IV for decryption:", iv.toString("hex"));
  console.log("Encrypted text for decryption:", encryptedText.toString("hex"));
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };

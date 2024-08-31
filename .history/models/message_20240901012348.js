const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // Lấy khóa từ biến môi trường
const ivLength = 16; // IV length for AES-256-CBC

const messageSchema = new mongoose.Schema({
  user: String,
  room: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

// Mã hóa tin nhắn
messageSchema.pre("save", function (next) {
  if (this.isModified("message") || this.isNew) {
    const iv = crypto.randomBytes(ivLength); // Tạo IV ngẫu nhiên cho mỗi tin nhắn
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(this.message, "utf8", "hex");
    encrypted += cipher.final("hex");
    this.message = iv.toString("hex") + ":" + encrypted;
  }
  next();
});

// Giải mã tin nhắn
messageSchema.methods.decryptMessage = function () {
  console.log("Encrypted message received for decryption:", this.message);
  const textParts = this.message.split(":");
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
};

module.exports = mongoose.model("Message", messageSchema);

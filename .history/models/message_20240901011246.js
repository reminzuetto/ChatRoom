const mongoose = require("mongoose");
const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // Khóa mã hóa cần được lưu trữ bảo mật
const iv = crypto.randomBytes(16); // IV (khóa khởi tạo) cũng cần được bảo mật

const messageSchema = new mongoose.Schema({
  user: String,
  room: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

// Mã hóa tin nhắn
messageSchema.pre("save", function (next) {
  if (this.isModified("message") || this.isNew) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(this.message);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    this.message = iv.toString("hex") + ":" + encrypted.toString("hex");
  }
  next();
});

// Giải mã tin nhắn
messageSchema.methods.decryptMessage = function () {
  const textParts = this.message.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = mongoose.model("Message", messageSchema);

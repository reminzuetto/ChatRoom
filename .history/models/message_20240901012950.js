const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

const secretKey = process.env.SECRET_KEY; // Lấy khóa bí mật từ biến môi trường

const messageSchema = new mongoose.Schema({
  user: String,
  room: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

// Mã hóa tin nhắn trước khi lưu vào MongoDB
messageSchema.pre("save", function (next) {
  if (this.isModified("message")) {
    this.message = CryptoJS.AES.encrypt(this.message, secretKey).toString();
  }
  next();
});

// Giải mã tin nhắn khi lấy từ MongoDB
messageSchema.methods.decryptMessage = function () {
  const bytes = CryptoJS.AES.decrypt(this.message, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = mongoose.model("Message", messageSchema);

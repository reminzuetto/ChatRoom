require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./models/message");
const { encryptMessage, decryptMessage } = require("./encryption"); // Import module mã hóa/giải mã

const app = express(); // Khởi tạo app trước
const server = http.createServer(app); // Tạo server HTTP dựa trên app
const io = socketIO(server); // Tạo socket.io dựa trên server HTTP

const PORT = process.env.PORT || 3000;

// Kết nối đến MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + "/public"));

app.get("/public/favicon.png", (req, res) => {
  res.sendFile(__dirname + "/public/favicon.png");
});

io.on("connection", (socket) => {
  console.log("Connected...");

  // Khi một người dùng tham gia vào phòng
  socket.on("joinRoom", async (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);

    // Tìm các tin nhắn cũ hơn 1 ngày
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const messages = await Message.find({
      room: room,
      timestamp: { $gte: oneDayAgo },
    });

    // Giải mã và gửi lại các tin nhắn cũ cho người dùng
    messages.forEach((message) => {
      const decryptedText = decryptMessage(message.message);
      socket.emit("message", { ...message.toObject(), message: decryptedText });
    });
  });

  // Xử lý tin nhắn mới
  socket.on("message", async (msg) => {
    const encryptedMessage = encryptMessage(msg.message); // Mã hóa tin nhắn trước khi lưu

    const message = new Message({
      user: msg.user,
      room: msg.room,
      message: encryptedMessage,
      timestamp: new Date(),
    });

    await message.save();

    // Xóa tin nhắn cũ hơn 1 ngày
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Message.deleteMany({ timestamp: { $lt: oneDayAgo } });

    socket.to(msg.room).emit("message", { ...msg, message: encryptedMessage }); // Gửi tin nhắn đã mã hóa
  });

  // Xử lý sự kiện ngắt kết nối
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

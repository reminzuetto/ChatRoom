const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const Message = require("./models/message"); // Đảm bảo đường dẫn đúng

const PORT = process.env.PORT || 3000;

// Kết nối đến MongoDB
mongoose
  .connect("mongodb://localhost/chatApp")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/join.html");
});

io.on("connection", (socket) => {
  console.log("Connected...");

  // Join a room
  socket.on("joinRoom", async (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);

    // Gửi lại các tin nhắn cũ hơn 1 ngày
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const messages = await Message.find({
      room: room,
      timestamp: { $gte: oneDayAgo },
    });

    messages.forEach((message) => {
      socket.emit("message", message);
    });
  });

  // Handle message and broadcast it to the specific room
  socket.on("message", async (msg) => {
    const message = new Message({
      user: msg.user,
      room: msg.room,
      message: msg.message,
      timestamp: new Date(),
    });

    await message.save();

    // Xóa tin nhắn cũ hơn 1 ngày
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Message.deleteMany({ timestamp: { $lt: oneDayAgo } });

    socket.to(msg.room).emit("message", msg); // Broadcast to room excluding sender
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

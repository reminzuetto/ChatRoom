const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const Message = require("./models/message");
const { encrypt, decrypt } = require("./functions/cryptoUtils");

const PORT = process.env.PORT || 3000;

// Kết nối đến MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + "/public"));

app.get("/public/favicon.png", (req, res) => {
  res.sendFile(__dirname + "/public/favicon.png");
});

io.on("connection", (socket) => {
  console.log("A user connected");

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
      socket.emit("message", {
        ...message.toObject(),
        message: decrypt(message.message), // Giải mã tin nhắn
      });
    });
  });

  // Handle message and broadcast it to the specific room
  socket.on("message", async (msg) => {
    const message = new Message({
      user: msg.user,
      room: msg.room,
      message: encrypt(msg.message), // Mã hóa tin nhắn
      timestamp: new Date(),
    });

    await message.save();

    // Xóa tin nhắn cũ hơn 1 ngày
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Message.deleteMany({ timestamp: { $lt: oneDayAgo } });

    socket.to(msg.room).emit("message", {
      user: msg.user,
      room: msg.room,
      message: msg.message,
      timestamp: new Date(),
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
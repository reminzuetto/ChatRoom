const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const connectToDB = require("./config/db.js");
const Message = require("./models/message");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Kết nối đến MongoDB
connectToDB();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "join.html"));
});

io.on("connection", (socket) => {
  console.log("User connected...");

  socket.on("joinRoom", async (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);

    try {
      // Gửi lại các tin nhắn cũ hơn 1 ngày
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const messages = await Message.find({
        room: room,
        timestamp: { $gte: oneDayAgo },
      });

      messages.forEach((message) => {
        socket.emit("message", message);
      });
    } catch (error) {
      console.error("Error retrieving messages:", error);
    }
  });

  socket.on("message", async (msg) => {
    try {
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

      // Broadcast to room excluding sender
      socket.to(msg.room).emit("message", msg);
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// server.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });

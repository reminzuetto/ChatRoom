const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectToDB = require("./config/db.js");
const Message = require("./models/message");

// Khởi tạo ứng dụng Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Kết nối đến MongoDB
connectToDB();

// Phục vụ tệp tĩnh
app.use(express.static(__dirname + "/public"));

// Route chính
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/join.html");
});

// Xử lý kết nối socket.io
io.on("connection", (socket) => {
  console.log("User connected");

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

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Lắng nghe trên cổng 3000 hoặc cổng được chỉ định trong biến môi trường
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

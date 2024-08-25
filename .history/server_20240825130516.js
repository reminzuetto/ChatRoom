const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./models/message");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Cấu hình CORS
app.use(
  cors({
    origin: "https://chatinstant-7ca0a.web.app", // Thay thế với URL client của bạn
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

mongoose
  .connect(
    "mongodb+srv://duyetleminh2004:280604@database.hgwbyae.mongodb.net/?retryWrites=true&w=majority&appName=database"
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

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

// Lắng nghe yêu cầu trên cổng được chỉ định
server.listen(PORT, () => {
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

// Lắng nghe yêu cầu trên cổng được chỉ định
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const functions = require("firebase-functions");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");

// Mongoose model (tạo thư mục models và định nghĩa schema Message)
const Message = require("./models/message");

// Kết nối đến MongoDB
mongoose
  .connect(
    "mongodb+srv://duyetleminh2004:280604@database.hgwbyae.mongodb.net/?retryWrites=true&w=majority&appName=database",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("Connected...");

  socket.on("joinRoom", async (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const messages = await Message.find({
      room: room,
      timestamp: { $gte: oneDayAgo },
    });

    messages.forEach((message) => {
      socket.emit("message", message);
    });
  });

  socket.on("message", async (msg) => {
    const message = new Message({
      user: msg.user,
      room: msg.room,
      message: msg.message,
      timestamp: new Date(),
    });

    await message.save();

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Message.deleteMany({ timestamp: { $lt: oneDayAgo } });

    io.to(msg.room).emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

exports.api = functions.https.onRequest(app);

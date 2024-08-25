import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Message from "./models/message.js"; //

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Kết nối đến MongoDB
mongoose
  .connect("mongodb://localhost/chatApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/join.html");
});

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

    socket.to(msg.room).emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

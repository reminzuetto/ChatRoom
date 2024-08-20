const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

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
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Handle message and broadcast it to the specific room
  socket.on("message", (msg) => {
    socket.to(msg.room).emit("message", msg); // Broadcast to room excluding sender
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
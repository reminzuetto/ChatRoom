const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const mongoose = require("mongoose");
const Message = require("./models/message"); // Đảm bảo đường dẫn đúng

const PORT = process.env.PORT || 3000;

// Kết nối đến MongoDB
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://duyetleminh2004:<280604>@database.hgwbyae.mongodb.net/?retryWrites=true&w=majority&appName=database";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
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

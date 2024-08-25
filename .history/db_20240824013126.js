// db.js
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config(); // Load environment variables

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://duyetleminh2004:280604@database.hgwbyae.mongodb.net/?retryWrites=true&w=majority&appName=database";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true, // Enable SSL/TLS
  tlsAllowInvalidCertificates: true, // Allow invalid certificates (if needed)
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client; // return the client for further use
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err; // rethrow the error to handle it in the calling code
  }
}

module.exports = { connectDB, client };

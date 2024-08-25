const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config(); // Load environment variables

dotenv.config();

const connectionString = process.env.DB_STRING;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true, // Enable SSL/TLS
  tlsAllowInvalidCertificates: true, // Allow invalid certificates (use with caution)
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

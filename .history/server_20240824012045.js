// server.js
const { connectDB } = require("./db");

async function run() {
  try {
    const client = await connectDB();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Your server code can go here, e.g., setting up Express.js routes, etc.
  } catch (err) {
    console.error("Error occurred during the server run:", err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

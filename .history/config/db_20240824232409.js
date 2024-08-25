const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectionString = process.env.MONGODB_URI;

const connectToDB = async () => {
  try {
    await mongoose.connect(connectionString, {
      autoIndex: true,
    });
    console.log("Connected to Mongodb Atlas");
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectToDB;

const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config(); // Load environment variables

dotenv.config();

const connectionString = process.env.DB_STRING;

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

export default connectToDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from environment variables
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;

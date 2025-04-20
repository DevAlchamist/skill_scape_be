const mongoose = require("mongoose");
const { DB_URI } = process.env;

const connectToDatabase = async (app) => {
  try {
    await mongoose.connect(DB_URI);
    console.log("💽 Database is Connected Successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the process if there's an error connecting to the database
  }
};

module.exports = connectToDatabase;

// @ts-nocheck
const mongoose = require("mongoose");
exports.db_connection = async () => {
  try {
    const mongo_url = process.env.MONGO_URL;
    await mongoose.connect(mongo_url);
    console.log("Connected to mongo db successfuly");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};

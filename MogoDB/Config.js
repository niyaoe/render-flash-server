const mongoose = require("mongoose");

const connection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

  } catch (error) {
    console.log("DB error : ", error);
    process.exit();
  }
};

module.exports = connection;

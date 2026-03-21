const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user: String,
    message: String,
    avatar: String,
    time: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
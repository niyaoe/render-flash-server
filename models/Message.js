const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      default: "global_room", // keeps global chat working
    },
    user: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    avatar: String,
    time: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
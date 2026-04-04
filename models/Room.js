const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      unique: true,
      required: true,
    },

    users: [
      {
        socketId: String,
        name: String,
        avatar: String,
      },
    ],

    createdBy: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Room", roomSchema);

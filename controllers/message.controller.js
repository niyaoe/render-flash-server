const Message = require("../models/Message");

/* ===============================
   GET GLOBAL CHAT ONLY
================================= */
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      room: "global_room", // 🔥 IMPORTANT FIX
    })
      .sort({ createdAt: 1 })
      .limit(30);

    res.json(messages);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

/* ===============================
   GET ROOM CHAT
================================= */
exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ room: roomId })
      .sort({ createdAt: 1 })
      .limit(50);

    res.json(messages);

  } catch (err) {
    res.status(500).json({ msg: "Error fetching room messages" });
  }
};
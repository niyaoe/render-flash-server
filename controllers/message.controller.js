const Message = require("../models/Message");

/* ===============================
   GET LAST MESSAGES
================================= */
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 }) // latest first
      .limit(30); // 🔥 limit

    res.json(messages.reverse()); // oldest → newest
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
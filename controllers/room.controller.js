const Room = require("../models/Room");

/* =========================
   CREATE ROOM
========================= */
exports.createRoom = async (req, res) => {
  try {
    const { roomId, user } = req.body;

    const room = await Room.create({
      roomId,
      createdBy: user,
    });

    res.json(room);
  } catch (err) {
    res.status(500).json({ msg: "Error creating room" });
  }
};

/* =========================
   GET ALL ROOMS
========================= */
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching rooms" });
  }
};
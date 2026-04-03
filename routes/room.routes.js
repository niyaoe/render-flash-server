const express = require("express");
const router = express.Router();

const {
  createRoom,
  getRooms,
} = require("../controllers/room.controller");

router.post("/create", createRoom);
router.get("/", getRooms);

module.exports = router;
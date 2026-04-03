const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/message.controller");
const { getRoomMessages } = require("../controllers/message.controller");

router.get("/", getMessages);
router.get("/:roomId", getRoomMessages);

module.exports = router;



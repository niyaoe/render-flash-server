const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const {
  getMe,
  updateProfile,
} = require("../controllers/user.controller");

/* protected routes */
router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);

module.exports = router;
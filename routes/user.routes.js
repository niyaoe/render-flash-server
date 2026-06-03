const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  getMe,
  updateProfile,
  getAllUsers,
  getUserById,
} = require("../controllers/user.controller");

/* CURRENT USER */
router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);

/* USERS */
router.get("/all", protect, getAllUsers);
router.get("/:id", protect, getUserById);

module.exports = router;
const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");

const {
  getMe,
  updateProfile,
  getAllUsers,
  getUserById,
  followUser,
} = require("../controllers/user.controller");

/* CURRENT USER */
router.get("/me", protect, getMe);

router.put("/update", protect, upload.single("avatar"), updateProfile);

router.put("/follow/:id", protect, followUser);

/* USERS */
router.get("/all", protect, getAllUsers);
router.get("/profile/:id", protect, getUserById);

module.exports = router;

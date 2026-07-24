const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");

const upload = require("../middleware/upload");

const {
  createPost,
  getPosts,
  getPost,
  deletePost,
  toggleLike,
  addComment,
  addView,
  getUserPosts,
  getLikedPosts,
  
} = require("../controllers/post.controller");

router.post("/create", upload.single("media"), createPost);

router.get("/", getPosts);

router.get("/:id", getPost);

router.delete("/:id", protect, deletePost);

router.post("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);
router.post("/:id/view", protect, addView);

router.get("/user/:userId", getUserPosts);

router.get("/liked/:userId", getLikedPosts);

module.exports = router;

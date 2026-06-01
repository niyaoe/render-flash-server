const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createPost,
  getPosts,
  getPost,
  deletePost,
} = require("../controllers/post.controller");

router.post(
  "/create",
  upload.single("media"),
  createPost
);

router.get("/", getPosts);

router.get("/:id", getPost);

router.delete("/:id", deletePost);

module.exports = router;
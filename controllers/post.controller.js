const Post = require("../models/Post");

/* =========================
   CREATE POST
========================= */
exports.createPost = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { user, username, avatar, caption, category } = req.body;

    if (!req.file) {
      return res.status(400).json({
        msg: "Media is required",
      });
    }

    if (!user || !username) {
      return res.status(400).json({
        msg: "User data missing",
      });
    }

    const mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";

    const post = await Post.create({
      user,
      username,
      avatar: avatar || "",
      caption: caption?.trim() || "",
      category: category || "General",

      // Cloudinary URL
      media: req.file.path,

      mediaType,
    });

    console.log("POST SAVED:", post._id);

    res.status(201).json({
      success: true,
      post,
    });
  } catch (err) {
    console.log("Create Post Error:", err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

/* =========================
   GET ALL POSTS
========================= */
exports.getPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      hasMore: skip + posts.length < totalPosts,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

/* =========================
   GET SINGLE POST
========================= */
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    res.status(200).json(post);
  } catch (err) {
    console.log("Get Post Error:", err);

    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
};

/* =========================
   DELETE POST
========================= */
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      msg: "Post deleted",
    });
  } catch (err) {
    console.log("Delete Post Error:", err);

    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
};

//like

exports.toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id);

  const alreadyLiked = post.likes.includes(req.user.id);

  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
  } else {
    post.likes.push(req.user.id);
  }

  await post.save();

  res.json({
    likes: post.likes.length,
    liked: !alreadyLiked,
  });
};

//comment
exports.addComment = async (req, res) => {
  const post = await Post.findById(req.params.id);

  post.comments.push({
    user: req.user.id,
    username: req.user.username,
    avatar: req.user.avatar,
    text: req.body.text,
  });

  await post.save();

  res.json(post.comments);
};

//view

exports.addView = async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, {
    $inc: { views: 1 },
  });

  res.json({ success: true });
};

//userpost

exports.getUserPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const skip = (page - 1) * limit;

    const totalEdits = await Post.countDocuments({
      user: req.params.userId,
    });

    const posts = await Post.find({
      user: req.params.userId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      posts,
      totalEdits,
      currentPage: page,
      totalPages: Math.ceil(totalEdits / limit),
      hasMore: skip + posts.length < totalEdits,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
//liked post

exports.getLikedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      likes: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

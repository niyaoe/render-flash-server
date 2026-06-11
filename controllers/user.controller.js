const User = require("../models/User");

/* GET CURRENT USER */   //coworkwith JWT

exports.getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* EDIT PROFILE */

exports.updateProfile = async (req, res) => {
  try {
    const {
      username,
      bio,
      softwares,
      country,
      name,
    } = req.body;

    let parsedSoftwares = [];

    if (softwares) {
      parsedSoftwares = JSON.parse(softwares);
    }

    const updateData = {
      name,
      username,
      bio,
      country,
      softwares: parsedSoftwares,
    };

    // Cloudinary avatar URL
    if (req.file) {
      updateData.avatar = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.json(updatedUser);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

//get all user


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//get single user


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


exports.followUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.id;

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({
        message: "Cannot follow yourself",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyFollowing =
      currentUser.following.includes(targetUserId);

    if (alreadyFollowing) {
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      following: !alreadyFollowing,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
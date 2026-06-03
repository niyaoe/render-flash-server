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
    const { username, bio, softwares, country, avatar ,name } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        username,
        bio,
        softwares,
        country,
        avatar,
      },
      { new: true }
    ).select("-password");

    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ message: err.message });
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
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

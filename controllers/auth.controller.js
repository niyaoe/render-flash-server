const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const {
  sendVerificationEmail,
} = require("../utils/sendEmail");

/* =========================
   REGISTER
========================= */

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // =========================
    // CHECK EXISTING EMAIL
    // =========================

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // =========================
    // CHECK USERNAME
    // =========================

    const existingUsername = await User.findOne({
      username,
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // =========================
    // HASH PASSWORD
    // =========================

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // =========================
    // CREATE VERIFICATION TOKEN
    // =========================

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    // Token expires after 1 hour

    const verificationExpires =
      Date.now() + 60 * 60 * 1000;

    // =========================
    // CREATE USER
    // =========================

    const user = await User.create({
      username,

      email: email.toLowerCase(),

      password: hashedPassword,

      isVerified: false,

      emailVerificationToken: verificationToken,

      emailVerificationExpires: verificationExpires,
    });

    // =========================
    // VERIFICATION URL
    // =========================

    const verificationUrl =
      `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // =========================
    // SEND EMAIL
    // =========================

    try {
      await sendVerificationEmail(
        user.email,
        user.username,
        verificationUrl
      );
    } catch (emailError) {

      console.log(
        "Verification email error:",
        emailError
      );

      // Remove user if email could not be sent

      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        message:
          "Account could not be created because verification email failed.",
      });
    }

    // =========================
    // RESPONSE
    // =========================

    res.status(201).json({
      message:
        "Registration successful. Please verify your email.",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};


/* =========================
   VERIFY EMAIL
========================= */

exports.verifyEmail = async (req, res) => {
  try {

    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is missing",
      });
    }

    // =========================
    // FIND USER
    // =========================

    const user = await User.findOne({
      emailVerificationToken: token,

      emailVerificationExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Verification link is invalid or expired",
      });
    }

    // =========================
    // VERIFY
    // =========================

    user.isVerified = true;

    user.emailVerificationToken = null;

    user.emailVerificationExpires = null;

    await user.save();

    res.json({
      message: "Email verified successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};


/* =========================
   LOGIN
========================= */

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // =========================
    // FIND USER
    // =========================

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // =========================
    // CHECK EMAIL
    // =========================

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Please verify your email before logging in.",
      });
    }

    // =========================
    // CHECK PASSWORD
    // =========================

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // =========================
    // JWT
    // =========================

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // =========================
    // RESPONSE
    // =========================

    res.json({
      token,
      user,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};
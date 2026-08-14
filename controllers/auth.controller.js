const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { sendVerificationEmail } = require("../utils/sendEmail");

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

    const hashedPassword = await bcrypt.hash(password, salt);

    // =========================
    // CREATE VERIFICATION TOKEN
    // =========================

    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Token expires after 1 hour

    const verificationExpires = new Date(Date.now() + 60 * 60 * 1000);

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

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // =========================
    // SEND EMAIL
    // =========================

    console.log("========== VERIFICATION URL ==========");
    console.log(verificationUrl);
    console.log("======================================");

    try {
      await sendVerificationEmail(user.email, user.username, verificationUrl);
    } catch (emailError) {
      console.log("Verification email error:", emailError);

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
      message: "Registration successful. Please verify your email.",
    });

    console.log("========== REGISTER DEBUG ==========");
    console.log("EMAIL:", user.email);
    console.log("GENERATED TOKEN:", verificationToken);
    console.log("TOKEN SAVED TO DB:", user.emailVerificationToken);
    console.log("VERIFICATION URL:", verificationUrl);
    console.log("====================================");
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

    console.log("========== VERIFY DEBUG ==========");
    console.log("TOKEN FROM URL:", token);

    if (!token) {
      return res.status(400).json({
        message: "Verification token is missing",
      });
    }

    const userByToken = await User.findOne({
      emailVerificationToken: token,
    });

    console.log("========== VERIFY DEBUG ==========");
    console.log("TOKEN FROM URL:", token);
    console.log("USER FOUND:", !!userByToken);

    if (userByToken) {
      console.log("DB TOKEN:", userByToken.emailVerificationToken);
      console.log("DB EXPIRES:", userByToken.emailVerificationExpires);
      console.log("CURRENT TIME:", new Date());
      console.log(
        "EXPIRED:",
        userByToken.emailVerificationExpires < new Date(),
      );
    }

    console.log("==================================");

    // Find user using token
    const user = await User.findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Verification link is invalid or expired",
      });
    }

    // Already verified
    if (user.isVerified) {
      return res.json({
        message: "Email is already verified.",
      });
    }

    // Check expiration
    if (
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Verification link has expired.",
      });
    }

    // Verify user
    user.isVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    console.log("========== VERIFY SUCCESS ==========");
    console.log("USER VERIFIED:", user.isVerified);
    console.log("TOKEN AFTER SAVE:", user.emailVerificationToken);
    console.log("EXPIRES AFTER SAVE:", user.emailVerificationExpires);
    console.log("====================================");

    return res.json({
      message: "Email verified successfully.",
    });
  } catch (err) {
    console.log("Verify email error:", err);

    return res.status(500).json({
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
    // CHECK EMAIL (commented on august)
    // =========================

    // if (!user.isVerified) {
    //   return res.status(403).json({
    //     message: "Please verify your email before logging in.",
    //   });
    // }

    // =========================
    // CHECK PASSWORD
    // =========================

    const isMatch = await bcrypt.compare(password, user.password);

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
      },
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

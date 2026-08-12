const express = require("express");

const router = express.Router();

const {
  register,
  login,
  verifyEmail,
} = require("../controllers/auth.controller");


// REGISTER
router.post("/register", register);


// LOGIN
router.post("/login", login);


// VERIFY EMAIL
router.get("/verify-email", verifyEmail);


module.exports = router;
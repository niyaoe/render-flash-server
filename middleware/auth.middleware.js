const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  try {
    // console.log("req.headers.authorization : ",req.headers.authorization);
    
    // get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("decoded :",decoded);
      

      // attach user to request (without password)
      req.user = await User.findById(decoded.id).select("-password");
      // console.log("req.user : ",req.user);
      

      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Token failed" });
  }
};

module.exports = protect;
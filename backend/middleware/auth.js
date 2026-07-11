// ============================================================
// Authentication Middleware
// Verifies the JWT from cookie or Authorization header and
// attaches the authenticated user to req.user.
// ============================================================

const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Try cookie
    if (req.cookies.token) {
      token = req.cookies.token;
    }
    // 2) Try Authorization Bearer header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new ApiError("You are not logged in. Please log in to continue.", 401)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new ApiError("The user belonging to this token no longer exists.", 401)
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError("Authentication failed. Please log in again.", 401));
  }
};

module.exports = protect;

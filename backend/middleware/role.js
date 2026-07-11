// ============================================================
// Role Based Authorization Middleware
// Restricts access to routes based on the authenticated user's
// role. Usage: authorize("admin"), authorize("admin","recruiter")
// ============================================================

const ApiError = require("../utils/apiError");

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError("Not authorized. Please log in.", 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `Role (${req.user.role}) is not authorized to access this resource.`,
          403
        )
      );
    }
    next();
  };
};

module.exports = authorize;

// ============================================================
// Central Error Handler & 404 Handler
// Handles operational ApiError instances, Mongoose errors,
// validation errors and JWT errors consistently.
// ============================================================

const ApiError = require("../utils/apiError");

// 404 handler for unknown routes within the app
const notFound = (req, res, next) => {
  next(new ApiError(`Resource not found - ${req.originalUrl}`, 404));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    message = `Resource not found with id ${err.value}`;
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value entered for ${field}. Please use another.`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token. Please log in again.";
    statusCode = 401;
  }
  if (err.name === "TokenExpiredError") {
    message = "Your token has expired. Please log in again.";
    statusCode = 401;
  }

  // Multer file size / type errors
  if (err.code === "LIMIT_FILE_SIZE") {
    message = "File too large. Maximum allowed size exceeded.";
    statusCode = 400;
  }

  if (err.isOperational && err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};

module.exports = { errorHandler, notFound };

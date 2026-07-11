// ============================================================
// Custom API Error class
// Used across controllers to throw consistent errors.
// ============================================================

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;

// ============================================================
// Validation Middleware
// Processes express-validator results and throws a 400 error
// with a readable message listing all failures.
// ============================================================

const { validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(". ");
    return next(new ApiError(message, 400));
  }
  next();
};

module.exports = validate;

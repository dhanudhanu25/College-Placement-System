// ============================================================
// File Upload Middleware (Multer)
// Handles resume (PDF) and image (profile/logo) uploads with
// size & type validation. Stores files in /uploads.
// ============================================================

const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const ApiError = require("../utils/apiError");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomBytes(16).toString("hex");
    cb(null, `${uniqueName}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const isPdf = file.mimetype === "application/pdf";

  if (isImage || isPdf) {
    cb(null, true);
  } else {
    cb(new ApiError("Only image and PDF files are allowed.", 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (process.env.MAX_FILE_SIZE || 5) * 1024 * 1024,
  },
});

module.exports = upload;

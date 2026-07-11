// ============================================================
// Notification Routes
// ============================================================

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const {
  getNotifications,
  createNotification,
  markAllRead,
  deleteNotification,
} = require("../controllers/notificationController");

router.get("/", protect, getNotifications);
router.put("/read-all", protect, markAllRead);
router.post("/", protect, authorize("admin"), createNotification);
router.delete("/:id", protect, deleteNotification);

module.exports = router;

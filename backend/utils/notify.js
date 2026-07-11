// ============================================================
// Notification Helper
// Creates a notification document for a given user.
// ============================================================

const Notification = require("../models/Notification");

const createNotification = async (userId, title, message, link = "") => {
  try {
    await Notification.create({ user: userId, title, message, link });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

module.exports = createNotification;

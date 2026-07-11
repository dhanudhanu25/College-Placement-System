// ============================================================
// Notification Controller
// Users read and delete their notifications.
// ============================================================

const ApiError = require("../utils/apiError");

const Notification = require("../models/Notification");

// -------------------- GET MY NOTIFICATIONS --------------------
exports.getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };
    if (req.query.read === "true") filter.read = true;
    if (req.query.read === "false") filter.read = false;

    const total = await Notification.countDocuments(filter);
    const notifications = await Notification.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const unread = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unread,
      total,
      page,
      pages: Math.ceil(total / limit),
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- CREATE NOTIFICATION (ADMIN) --------------------
exports.createNotification = async (req, res, next) => {
  try {
    const { userId, title, message, link } = req.body;
    if (!userId || !title || !message)
      return next(new ApiError("userId, title and message are required.", 400));

    const notification = await Notification.create({
      user: userId,
      title,
      message,
      link,
    });
    res
      .status(201)
      .json({ success: true, message: "Notification sent.", notification });
  } catch (error) {
    next(error);
  }
};

// -------------------- MARK ALL READ --------------------
exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    res
      .status(200)
      .json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    next(error);
  }
};

// -------------------- DELETE NOTIFICATION --------------------
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!notification)
      return next(new ApiError("Notification not found.", 404));
    res.status(200).json({ success: true, message: "Notification deleted." });
  } catch (error) {
    next(error);
  }
};

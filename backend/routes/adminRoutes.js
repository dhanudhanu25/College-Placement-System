// ============================================================
// Admin (Placement Officer) Routes
// ============================================================

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const {
  adminDashboard,
  getRecruiters,
  getUsers,
  deleteUser,
  getPending,
  generateReport,
} = require("../controllers/adminController");

router.get("/dashboard", protect, authorize("admin"), adminDashboard);
router.get("/pending", protect, authorize("admin"), getPending);
router.get("/recruiters", protect, authorize("admin"), getRecruiters);
router.get("/users", protect, authorize("admin"), getUsers);
router.get("/report", protect, authorize("admin"), generateReport);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

module.exports = router;

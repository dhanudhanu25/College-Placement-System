// ============================================================
// Student Routes
// ============================================================

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const {
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  studentDashboard,
  profileCompletion,
} = require("../controllers/studentController");

router.get("/", protect, authorize("admin"), getStudents);
router.get("/dashboard", protect, authorize("student"), studentDashboard);
router.get(
  "/completion",
  protect,
  authorize("student"),
  profileCompletion
);

router.get("/:id", protect, authorize("admin", "student"), getStudent);
router.put("/:id", protect, authorize("admin", "student"), updateStudent);
router.delete("/:id", protect, authorize("admin"), deleteStudent);

module.exports = router;

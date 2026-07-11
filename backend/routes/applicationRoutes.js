// ============================================================
// Application Routes
// ============================================================

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const {
  applyJob,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController");

router.post("/", protect, authorize("student"), applyJob);
router.get("/", protect, authorize("student", "recruiter", "admin"), getApplications);
router.get("/:id", protect, authorize("student", "recruiter", "admin"), getApplication);
router.put(
  "/:id",
  protect,
  authorize("recruiter", "admin"),
  updateApplication
);
router.delete(
  "/:id",
  protect,
  authorize("student", "recruiter", "admin"),
  deleteApplication
);

module.exports = router;

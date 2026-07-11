// ============================================================
// Job Routes
// ============================================================

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  setJobApproval,
} = require("../controllers/jobController");

router.get("/", getJobs);
router.get("/:id", getJob);

router.post("/", protect, authorize("recruiter", "admin"), createJob);
router.put("/:id", protect, authorize("recruiter", "admin"), updateJob);
router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob);

// Admin approval of a job
router.put(
  "/:id/approval",
  protect,
  authorize("admin"),
  setJobApproval
);

module.exports = router;

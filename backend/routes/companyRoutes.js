// ============================================================
// Company Routes
// ============================================================

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");
const upload = require("../middleware/upload");

const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  setApproval,
  companyDashboard,
} = require("../controllers/companyController");

// Public & authenticated list
router.get("/", getCompanies);
router.get("/:id", getCompany);

// Recruiter dashboard
router.get(
  "/dashboard/me",
  protect,
  authorize("recruiter", "admin"),
  companyDashboard
);

// Create (recruiter from signup uses /auth/signup; admin can create here)
router.post("/", protect, authorize("admin", "recruiter"), upload.single("logo"), createCompany);

// Admin approval
router.put(
  "/:id/approval",
  protect,
  authorize("admin"),
  setApproval
);

// Update / delete
router.put(
  "/:id",
  protect,
  authorize("admin", "recruiter"),
  upload.single("logo"),
  updateCompany
);
router.delete("/:id", protect, authorize("admin"), deleteCompany);

module.exports = router;

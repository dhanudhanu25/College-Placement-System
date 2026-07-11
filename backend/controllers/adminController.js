// ============================================================
// Admin (Placement Officer) Controller
// Dashboard analytics, user/recruiter management, reports.
// ============================================================

const ApiError = require("../utils/apiError");

const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");

// -------------------- ADMIN DASHBOARD --------------------
exports.adminDashboard = async (req, res, next) => {
  try {
    const [totalStudents, totalRecruiters, totalCompanies, totalJobs, totalApplications] =
      await Promise.all([
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "recruiter" }),
        Company.countDocuments(),
        Job.countDocuments(),
        Application.countDocuments(),
      ]);

    const pendingCompanies = await Company.countDocuments({ approved: false });
    const pendingJobs = await Job.countDocuments({ approved: false });
    const selected = await Application.countDocuments({ status: "Selected" });
    const interviews = await Application.countDocuments({
      status: "Interview Scheduled",
    });

    // Placement statistics by department
    const byDepartment = await User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly applications for the graph (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthly = await Application.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyLabels = monthly.map(
      (m) => `${m._id.year}-${String(m._id.month).padStart(2, "0")}`
    );
    const monthlyData = monthly.map((m) => m.count);

    // Application status breakdown
    const statusBreakdown = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalRecruiters,
        totalCompanies,
        totalJobs,
        totalApplications,
        pendingCompanies,
        pendingJobs,
        selected,
        interviews,
      },
      byDepartment,
      monthly: { labels: monthlyLabels, data: monthlyData },
      statusBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- MANAGE RECRUITERS --------------------
exports.getRecruiters = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { role: "recruiter" };
    if (req.query.search)
      filter.name = { $regex: req.query.search, $options: "i" };

    const total = await User.countDocuments(filter);
    const recruiters = await User.find(filter)
      .select("-password")
      .populate("company", "companyName approved")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: recruiters.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      recruiters,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- GET ALL USERS (any role) --------------------
exports.getUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter)
      .select("-password")
      .populate("company", "companyName")
      .sort("-createdAt");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// -------------------- DELETE USER --------------------
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ApiError("User not found.", 404));
    if (user.role === "admin")
      return next(new ApiError("Cannot delete an admin.", 403));

    await User.findByIdAndDelete(req.params.id);
    if (user.role === "student")
      await Application.deleteMany({ student: user._id });
    res.status(200).json({ success: true, message: "User deleted." });
  } catch (error) {
    next(error);
  }
};

// -------------------- PENDING APPROVALS --------------------
exports.getPending = async (req, res, next) => {
  try {
    const companies = await Company.find({ approved: false }).sort(
      "-createdAt"
    );
    const jobs = await Job.find({ approved: false })
      .populate("company", "companyName")
      .sort("-createdAt");
    res.status(200).json({ success: true, companies, jobs });
  } catch (error) {
    next(error);
  }
};

// -------------------- REPORTS (students + applications) --------------------
exports.generateReport = async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" })
      .select("name email department cgpa phone isVerified createdAt")
      .sort("name");

    const applications = await Application.find()
      .populate("student", "name email department")
      .populate("job", "title")
      .populate("company", "companyName")
      .sort("-appliedDate");

    res.status(200).json({
      success: true,
      generatedAt: new Date(),
      students,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

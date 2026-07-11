// ============================================================
// Student Controller
// CRUD operations for student users (role: student).
// ============================================================

const ApiError = require("../utils/apiError");
const createNotification = require("../utils/notify");

const User = require("../models/User");
const Application = require("../models/Application");

// Build a searchable query from request
const buildStudentQuery = (query) => {
  const filter = { role: "student" };
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { department: { $regex: query.search, $options: "i" } },
    ];
  }
  if (query.department) filter.department = query.department;
  return filter;
};

// -------------------- GET ALL STUDENTS --------------------
exports.getStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = buildStudentQuery(req.query);
    const sort = req.query.sort || "-createdAt";

    const total = await User.countDocuments(filter);
    const students = await User.find(filter)
      .select("-password")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      students,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- GET SINGLE STUDENT --------------------
exports.getStudent = async (req, res, next) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "student",
    })
      .select("-password")
      .populate("company");
    if (!student) return next(new ApiError("Student not found.", 404));
    res.status(200).json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

// -------------------- UPDATE STUDENT --------------------
exports.updateStudent = async (req, res, next) => {
  try {
    const allowed = [
      "name",
      "phone",
      "department",
      "cgpa",
      "skills",
      "profileImage",
      "resume",
      "isVerified",
    ];
    const updateFields = {};
    Object.keys(req.body).forEach((key) => {
      if (allowed.includes(key)) updateFields[key] = req.body[key];
    });

    if (updateFields.skills && !Array.isArray(updateFields.skills)) {
      updateFields.skills = updateFields.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: "student" },
      updateFields,
      { new: true, runValidators: true }
    ).select("-password");

    if (!student) return next(new ApiError("Student not found.", 404));
    res
      .status(200)
      .json({ success: true, message: "Student updated.", student });
  } catch (error) {
    next(error);
  }
};

// -------------------- DELETE STUDENT --------------------
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await User.findOneAndDelete({
      _id: req.params.id,
      role: "student",
    });
    if (!student) return next(new ApiError("Student not found.", 404));
    // Cascade delete applications
    await Application.deleteMany({ student: student._id });
    res.status(200).json({ success: true, message: "Student deleted." });
  } catch (error) {
    next(error);
  }
};

// -------------------- STUDENT DASHBOARD STATS --------------------
exports.studentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const applications = await Application.find({ student: studentId })
      .populate("job")
      .populate("company")
      .sort("-appliedDate");

    const appliedCount = applications.length;
    const pendingCount = applications.filter((a) =>
      ["Applied", "Under Review", "Shortlisted"].includes(a.status)
    ).length;
    const selectedCount = applications.filter(
      (a) => a.status === "Selected"
    ).length;
    const rejectedCount = applications.filter(
      (a) => a.status === "Rejected"
    ).length;

    res.status(200).json({
      success: true,
      stats: {
        appliedCount,
        pendingCount,
        selectedCount,
        rejectedCount,
      },
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- PROFILE COMPLETION --------------------
exports.profileCompletion = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const fields = [
      user.name,
      user.email,
      user.phone,
      user.department,
      user.cgpa,
      user.skills && user.skills.length,
      user.profileImage,
      user.resume,
    ];
    const filled = fields.filter(Boolean).length;
    const percent = Math.round((filled / fields.length) * 100);
    res.status(200).json({ success: true, percent });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// Authentication Controller
// Handles signup, login, logout, profile, password reset.
// ============================================================

const crypto = require("crypto");
const ApiError = require("../utils/apiError");
const sendToken = require("../utils/sendToken");
const createNotification = require("../utils/notify");

const User = require("../models/User");
const Company = require("../models/Company");

// -------------------- SIGNUP --------------------
exports.signup = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      department,
      cgpa,
      skills,
      companyName,
      companyEmail,
      website,
      location,
      industry,
      description,
    } = req.body;

    const allowedRoles = ["student", "recruiter"];
    const userRole = allowedRoles.includes(role) ? role : "student";

    // Prevent public admin creation
    if (userRole === "admin") {
      return next(new ApiError("Cannot register as admin.", 403));
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return next(new ApiError("Email already registered.", 400));
    }

    const userData = {
      name,
      email,
      phone,
      password,
      role: userRole,
      department: userRole === "student" ? department : "",
      cgpa: userRole === "student" ? cgpa : 0,
      skills: userRole === "student" && skills ? skills : [],
    };

    let company = null;
    if (userRole === "recruiter") {
      if (!companyName) {
        return next(
          new ApiError("Company name is required for recruiters.", 400)
        );
      }
      company = await Company.create({
        companyName,
        email: companyEmail || email,
        website,
        location,
        industry,
        description,
        approved: false,
      });
      userData.company = company._id;
    }

    const user = await User.create(userData);

    if (company) {
      company.createdBy = user._id;
      await company.save();
    }

    await createNotification(
      user._id,
      "Welcome to College Placement Portal",
      "Your account has been created successfully. Complete your profile to get started.",
      "/profile"
    );

    sendToken(user, 201, res, "Registration successful.");
  } catch (error) {
    next(error);
  }
};

// -------------------- LOGIN --------------------
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError("Please provide email and password.", 400));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      return next(new ApiError("Invalid credentials.", 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ApiError("Invalid credentials.", 401));
    }

    // Recruiters can only log in once their company is approved
    if (
      user.role === "recruiter" &&
      user.company &&
      !user.isVerified
    ) {
      // Still allow login; restriction applied at company level elsewhere.
    }

    sendToken(user, 200, res, "Login successful.");
  } catch (error) {
    next(error);
  }
};

// -------------------- LOGOUT --------------------
exports.logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged out successfully." });
};

// -------------------- GET CURRENT USER --------------------
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("company");
    if (!user) return next(new ApiError("User not found.", 404));
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// -------------------- UPDATE PROFILE --------------------
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      department,
      cgpa,
      skills,
      password,
      profileImage,
      resume,
    } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (req.user.role === "student") {
      if (department !== undefined) updateFields.department = department;
      if (cgpa !== undefined) updateFields.cgpa = cgpa;
      if (skills !== undefined)
        updateFields.skills = Array.isArray(skills)
          ? skills
          : skills
          ? skills.split(",").map((s) => s.trim())
          : [];
    }
    if (profileImage !== undefined) updateFields.profileImage = profileImage;
    if (resume !== undefined) updateFields.resume = resume;
    if (password) updateFields.password = password;

    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      runValidators: true,
    }).populate("company");

    res
      .status(200)
      .json({ success: true, message: "Profile updated.", user });
  } catch (error) {
    next(error);
  }
};

// -------------------- FORGOT PASSWORD --------------------
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(new ApiError("No account with that email exists.", 404));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // In production send via nodemailer; here we return the token for demo.
    res.status(200).json({
      success: true,
      message:
        "Password reset token generated. (Demo mode: token returned below)",
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- RESET PASSWORD --------------------
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return next(new ApiError("Token and new password are required.", 400));
    }

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ApiError("Invalid or expired reset token.", 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res, "Password has been reset. Please log in.");
  } catch (error) {
    next(error);
  }
};

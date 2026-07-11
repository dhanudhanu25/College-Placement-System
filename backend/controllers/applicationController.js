// ============================================================
// Application Controller
// Students apply to jobs; recruiters & admins manage them.
// ============================================================

const ApiError = require("../utils/apiError");
const createNotification = require("../utils/notify");

const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const Company = require("../models/Company");

// -------------------- APPLY TO JOB (STUDENT) --------------------
exports.applyJob = async (req, res, next) => {
  try {
    const { job: jobId } = req.body;
    const student = await User.findById(req.user._id);
    if (!student.resume) {
      return next(
        new ApiError("Please upload your resume before applying.", 400)
      );
    }

    const job = await Job.findById(jobId);
    if (!job) return next(new ApiError("Job not found.", 404));
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return next(new ApiError("Application deadline has passed.", 400));
    }

    const existing = await Application.findOne({
      student: req.user._id,
      job: jobId,
    });
    if (existing) {
      return next(
        new ApiError("You have already applied to this job.", 400)
      );
    }

    const application = await Application.create({
      student: req.user._id,
      job: jobId,
      company: job.company,
      resume: student.resume,
      status: "Applied",
    });

    // Notify recruiter
    const company = await Company.findById(job.company);
    if (company && company.createdBy) {
      await createNotification(
        company.createdBy,
        "New Application",
        `${student.name} applied for ${job.title}.`,
        "/applicants"
      );
    }

    res
      .status(201)
      .json({ success: true, message: "Applied successfully.", application });
  } catch (error) {
    // Duplicate key (race) -> friendly message
    if (error.code === 11000) {
      return next(new ApiError("You have already applied to this job.", 400));
    }
    next(error);
  }
};

// -------------------- GET ALL APPLICATIONS --------------------
exports.getApplications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.job) filter.job = req.query.job;
    if (req.query.student) filter.student = req.query.student;

    // Recruiters only see applications to their company's jobs
    if (req.user.role === "recruiter" && req.user.company) {
      const jobs = await Job.find({ company: req.user.company });
      filter.job = { $in: jobs.map((j) => j._id) };
    }

    const total = await Application.countDocuments(filter);
    const applications = await Application.find(filter)
      .populate("student", "name email department cgpa skills profileImage")
      .populate("job", "title salary location jobType")
      .populate("company", "companyName logo")
      .sort(req.query.sort || "-appliedDate")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- GET SINGLE APPLICATION --------------------
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("student", "name email department cgpa skills profileImage resume")
      .populate("job")
      .populate("company", "companyName logo");
    if (!application) return next(new ApiError("Application not found.", 404));
    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// -------------------- UPDATE APPLICATION STATUS --------------------
exports.updateApplication = async (req, res, next) => {
  try {
    const { status, interviewDate } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return next(new ApiError("Application not found.", 404));

    if (status) application.status = status;
    if (interviewDate) application.interviewDate = interviewDate;
    await application.save();

    // Notify the student
    const notifyMessages = {
      "Under Review": "Your application is under review.",
      Shortlisted: "Congratulations! You have been shortlisted.",
      "Interview Scheduled": "Your interview has been scheduled.",
      Selected: "🎉 Congratulations! You have been selected.",
      Rejected: "Unfortunately, your application was not successful this time.",
    };
    if (notifyMessages[application.status]) {
      await createNotification(
        application.student,
        `Application Update - ${application.status}`,
        notifyMessages[application.status],
        "/applied"
      );
    }

    res.status(200).json({
      success: true,
      message: "Application updated.",
      application,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- WITHDRAW / DELETE APPLICATION --------------------
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return next(new ApiError("Application not found.", 404));

    // Students can only withdraw their own; recruiters/admins can remove any
    if (
      req.user.role === "student" &&
      application.student.toString() !== req.user._id.toString()
    ) {
      return next(
        new ApiError("Not authorized to withdraw this application.", 403)
      );
    }

    await application.deleteOne();
    res.status(200).json({ success: true, message: "Application removed." });
  } catch (error) {
    next(error);
  }
};

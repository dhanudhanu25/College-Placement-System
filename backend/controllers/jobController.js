// ============================================================
// Job Controller
// CRUD operations for job postings with search/filter support.
// ============================================================

const ApiError = require("../utils/apiError");
const createNotification = require("../utils/notify");

const Job = require("../models/Job");
const Company = require("../models/Company");
const Application = require("../models/Application");
const User = require("../models/User");

const buildJobQuery = (query) => {
  const filter = {};

  // Only show approved jobs to the public (non-admin/recruiter)
  if (query.public === "true") filter.approved = true;

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { location: { $regex: query.search, $options: "i" } },
      { experience: { $regex: query.search, $options: "i" } },
    ];
  }
  if (query.location) filter.location = query.location;
  if (query.jobType) filter.jobType = query.jobType;
  if (query.experience) filter.experience = query.experience;
  if (query.company) filter.company = query.company;
  return filter;
};

// -------------------- GET ALL JOBS --------------------
exports.getJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const filter = buildJobQuery(req.query);
    const sort = req.query.sort || "-createdAt";

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .populate("company", "companyName logo location industry")
      .populate("postedBy", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- GET SINGLE JOB --------------------
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company")
      .populate("postedBy", "name email");
    if (!job) return next(new ApiError("Job not found.", 404));
    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// -------------------- CREATE JOB --------------------
exports.createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      jobType,
      experience,
      description,
      requirements,
      deadline,
    } = req.body;

    // Validate company exists
    const companyDoc = await Company.findById(company);
    if (!companyDoc) return next(new ApiError("Company not found.", 404));

    const job = await Job.create({
      title,
      company,
      location,
      salary,
      jobType,
      experience,
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements
        ? requirements.split(",").map((r) => r.trim())
        : [],
      deadline,
      postedBy: req.user ? req.user._id : null,
      // Auto-approve if admin posts; otherwise pending officer approval
      approved: req.user && req.user.role === "admin",
    });

    res.status(201).json({ success: true, message: "Job posted.", job });
  } catch (error) {
    next(error);
  }
};

// -------------------- UPDATE JOB --------------------
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) return next(new ApiError("Job not found.", 404));
    res.status(200).json({ success: true, message: "Job updated.", job });
  } catch (error) {
    next(error);
  }
};

// -------------------- DELETE JOB --------------------
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return next(new ApiError("Job not found.", 404));
    await Application.deleteMany({ job: job._id });
    res.status(200).json({ success: true, message: "Job deleted." });
  } catch (error) {
    next(error);
  }
};

// -------------------- APPROVE / REJECT JOB (ADMIN) --------------------
exports.setJobApproval = async (req, res, next) => {
  try {
    const { approved } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { approved: !!approved },
      { new: true }
    ).populate("company");
    if (!job) return next(new ApiError("Job not found.", 404));

    if (approved && job.postedBy) {
      await createNotification(
        job.postedBy,
        "Job Approved",
        `Your job "${job.title}" has been approved and is now live.`
      );
    }

    res.status(200).json({
      success: true,
      message: `Job ${approved ? "approved" : "rejected"}.`,
      job,
    });
  } catch (error) {
    next(error);
  }
};

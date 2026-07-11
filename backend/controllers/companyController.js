// ============================================================
// Company Controller
// CRUD operations for companies. Companies must be approved
// by the placement officer before their jobs are public.
// ============================================================

const ApiError = require("../utils/apiError");
const createNotification = require("../utils/notify");

const Company = require("../models/Company");
const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");

const buildCompanyQuery = (query) => {
  const filter = {};
  if (query.search) {
    filter.$or = [
      { companyName: { $regex: query.search, $options: "i" } },
      { industry: { $regex: query.search, $options: "i" } },
      { location: { $regex: query.search, $options: "i" } },
    ];
  }
  if (query.location) filter.location = query.location;
  if (query.industry) filter.industry = query.industry;
  if (query.approved === "true") filter.approved = true;
  if (query.approved === "false") filter.approved = false;
  return filter;
};

// -------------------- GET ALL COMPANIES --------------------
exports.getCompanies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const filter = buildCompanyQuery(req.query);
    const sort = req.query.sort || "-createdAt";

    const total = await Company.countDocuments(filter);
    const companies = await Company.find(filter)
      .populate("createdBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: companies.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      companies,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- GET SINGLE COMPANY --------------------
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!company) return next(new ApiError("Company not found.", 404));

    const jobs = await Job.find({ company: company._id }).sort("-createdAt");
    res.status(200).json({ success: true, company, jobs });
  } catch (error) {
    next(error);
  }
};

// -------------------- CREATE COMPANY --------------------
exports.createCompany = async (req, res, next) => {
  try {
    const {
      companyName,
      email,
      website,
      location,
      industry,
      description,
      logo,
    } = req.body;

    const exists = await Company.findOne({ companyName });
    if (exists)
      return next(new ApiError("Company with this name already exists.", 400));

    const company = await Company.create({
      companyName,
      email,
      website,
      location,
      industry,
      description,
      logo,
      createdBy: req.user ? req.user._id : null,
      approved: req.user && req.user.role === "admin" ? true : false,
    });

    res
      .status(201)
      .json({ success: true, message: "Company created.", company });
  } catch (error) {
    next(error);
  }
};

// -------------------- UPDATE COMPANY --------------------
exports.updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!company) return next(new ApiError("Company not found.", 404));
    res
      .status(200)
      .json({ success: true, message: "Company updated.", company });
  } catch (error) {
    next(error);
  }
};

// -------------------- DELETE COMPANY --------------------
exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return next(new ApiError("Company not found.", 404));
    // Cascade delete jobs & their applications
    const jobs = await Job.find({ company: company._id });
    const jobIds = jobs.map((j) => j._id);
    await Job.deleteMany({ company: company._id });
    await Application.deleteMany({ job: { $in: jobIds } });
    res.status(200).json({ success: true, message: "Company deleted." });
  } catch (error) {
    next(error);
  }
};

// -------------------- APPROVE / REJECT COMPANY (ADMIN) --------------------
exports.setApproval = async (req, res, next) => {
  try {
    const { approved } = req.body;
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { approved: !!approved },
      { new: true }
    );
    if (!company) return next(new ApiError("Company not found.", 404));

    // Notify the recruiter who created the company
    if (req.body.notify !== false && company.createdBy) {
      await createNotification(
        company.createdBy,
        approved ? "Company Approved 🎉" : "Company Rejected",
        approved
          ? `Your company "${company.companyName}" has been approved by the placement officer.`
          : `Your company "${company.companyName}" was not approved.`
      );
    }

    res.status(200).json({
      success: true,
      message: `Company ${approved ? "approved" : "rejected"}.`,
      company,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------- COMPANY DASHBOARD STATS --------------------
exports.companyDashboard = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    if (!companyId)
      return next(new ApiError("No company associated with this account.", 400));

    const jobs = await Job.find({ company: companyId });
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({
      job: { $in: jobIds },
    }).populate("student", "name email department cgpa");

    const interviewsScheduled = applications.filter(
      (a) => a.status === "Interview Scheduled"
    ).length;
    const selectedCandidates = applications.filter(
      (a) => a.status === "Selected"
    ).length;

    res.status(200).json({
      success: true,
      stats: {
        postedJobs: jobs.length,
        applications: applications.length,
        interviewsScheduled,
        selectedCandidates,
      },
      jobs,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

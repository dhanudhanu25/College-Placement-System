// ============================================================
// Job Model
// Represents job openings posted by companies.
// ============================================================

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    salary: {
      type: String,
      trim: true,
      default: "Not Disclosed",
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"],
      default: "Full-time",
    },
    experience: {
      type: String,
      trim: true,
      default: "0-1 years",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    requirements: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      default: null,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);

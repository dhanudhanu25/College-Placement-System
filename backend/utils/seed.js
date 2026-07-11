// ============================================================
// Seed Data Generator
// Creates:
//   - 1 Placement Officer (admin)
//   - 1 Demo Recruiter (company) + 4 more recruiters
//   - 5 Companies
//   - 20 Students
//   - 30 Jobs
//   - 50 Applications
//
// Run:  npm run seed   (requires .env with MONGODB_URI)
// ============================================================

require("dotenv").config();
const mongoose = require("mongoose");

const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Electrical",
  "Civil",
];
const STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
];
const JOB_TITLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "DevOps Engineer",
  "QA Tester",
  "UI/UX Designer",
  "Machine Learning Engineer",
  "Cloud Engineer",
  "Mobile App Developer",
  "Business Analyst",
  "System Administrator",
  "Product Manager",
  "Network Engineer",
];
const LOCATIONS = [
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Mumbai",
  "Pune",
  "Delhi",
  "Noida",
  "Kolkata",
  "Remote",
];
const INDUSTRIES = [
  "Information Technology",
  "Finance",
  "Healthcare",
  "E-commerce",
  "Consulting",
];

const COMPANY_NAMES = [
  "TechNova Solutions",
  "InnoSoft Labs",
  "DataCrest Systems",
  "CloudPeak Technologies",
  "BrightWave Analytics",
];

const SKILLS_POOL = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "MongoDB",
  "AWS",
  "Docker",
  "C++",
  "TypeScript",
  "Django",
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB. Clearing existing data...");

  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  // ---- Admin ----
  const admin = await User.create({
    name: "Placement Officer",
    email: "admin@gmail.com",
    phone: "9000000000",
    password: "Admin@123",
    role: "admin",
    isVerified: true,
  });

  // ---- Companies ----
  const companies = [];
  for (let i = 0; i < COMPANY_NAMES.length; i++) {
    const c = await Company.create({
      companyName: COMPANY_NAMES[i],
      email: `hr${i + 1}@${COMPANY_NAMES[i]
        .toLowerCase()
        .replace(/[^a-z]/g, "")}.com`,
      website: `https://${COMPANY_NAMES[i].toLowerCase().replace(/[^a-z]/g, "")}.com`,
      location: rand(LOCATIONS),
      industry: rand(INDUSTRIES),
      description:
        "A leading organization focused on innovation and delivering world-class solutions to global clients.",
      approved: true,
    });
    companies.push(c);
  }

  // ---- Recruiters (one per company) ----
  const recruiters = [];
  for (let i = 0; i < companies.length; i++) {
    const isDemo = i === 0;
    const recruiter = await User.create({
      name: isDemo ? "Company Recruiter" : `${companies[i].companyName} HR`,
      email: isDemo ? "company@gmail.com" : `recruiter${i + 1}@gmail.com`,
      phone: `98${randInt(10000000, 99999999)}`,
      password: isDemo ? "Company@123" : `Recruiter@${i + 1}`,
      role: "recruiter",
      company: companies[i]._id,
      isVerified: true,
    });
    companies[i].createdBy = recruiter._id;
    await companies[i].save();
    recruiters.push(recruiter);
  }

  // ---- Students ----
  const students = [];
  for (let i = 0; i < 20; i++) {
    const isDemo = i === 0;
    const dept = rand(DEPARTMENTS);
    const skills = [];
    const count = randInt(3, 5);
    while (skills.length < count) {
      const s = rand(SKILLS_POOL);
      if (!skills.includes(s)) skills.push(s);
    }
    const student = await User.create({
      name: isDemo ? "Demo Student" : `Student ${i + 1}`,
      email: isDemo ? "student@gmail.com" : `student${i + 1}@gmail.com`,
      phone: `97${randInt(10000000, 99999999)}`,
      password: isDemo ? "Student@123" : `Student@${i + 1}`,
      role: "student",
      department: dept,
      cgpa: parseFloat((randInt(60, 95) / 10).toFixed(2)),
      skills,
      isVerified: true,
    });
    students.push(student);
  }

  // ---- Jobs (30) ----
  const jobs = [];
  for (let i = 0; i < 30; i++) {
    const company = rand(companies);
    const job = await Job.create({
      title: rand(JOB_TITLES),
      company: company._id,
      location: rand(LOCATIONS),
      salary: `₹${randInt(3, 15)} LPA`,
      jobType: rand(["Full-time", "Internship", "Part-time", "Remote", "Contract"]),
      experience: rand(["0-1 years", "1-2 years", "2-3 years", "3-5 years"]),
      description:
        "We are looking for a passionate candidate to join our team and contribute to exciting projects. You will work with modern technologies and collaborate with cross-functional teams.",
      requirements: [
        "Strong problem-solving skills",
        "Good communication",
        "Relevant project experience",
        "Willingness to learn",
      ],
      deadline: new Date(Date.now() + randInt(5, 60) * 24 * 60 * 60 * 1000),
      postedBy: rand(recruiters)._id,
      approved: true,
    });
    jobs.push(job);
  }

  // ---- Applications (50) ----
  for (let i = 0; i < 50; i++) {
    const student = rand(students);
    const job = rand(jobs);
    try {
      await Application.create({
        student: student._id,
        job: job._id,
        company: job.company,
        status: rand(STATUSES),
        resume: "",
        appliedDate: new Date(
          Date.now() - randInt(0, 40) * 24 * 60 * 60 * 1000
        ),
      });
    } catch (e) {
      // skip duplicate (unique index)
    }
  }

  // ---- Notifications for students ----
  for (const s of students) {
    await Notification.create({
      user: s._id,
      title: "Welcome to Placement Portal",
      message:
        "Complete your profile and upload your resume to start applying for jobs.",
      read: Math.random() > 0.5,
    });
  }

  console.log("✅ Seed completed:");
  console.log(`   Admin: ${admin.email} / Admin@123`);
  console.log(`   Recruiter (demo): company@gmail.com / Company@123`);
  console.log(`   Student (demo): student@gmail.com / Student@123`);
  console.log(`   Companies: ${companies.length}`);
  console.log(`   Recruiters: ${recruiters.length}`);
  console.log(`   Students: ${students.length}`);
  console.log(`   Jobs: ${jobs.length}`);
  const appCount = await Application.countDocuments();
  console.log(`   Applications: ${appCount}`);

  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

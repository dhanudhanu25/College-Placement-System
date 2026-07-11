export const formatDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const fileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = import.meta.env.VITE_UPLOADS_URL || "/uploads";
  return `${base}/${path}`;
};

export const APPLICATION_STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
  "Withdrawn",
];

export const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract", "Remote"];

export const ROLE_LABELS = {
  student: "Student",
  recruiter: "Company Recruiter",
  admin: "Placement Officer",
};

export const statusBadge = (status) => {
  const map = {
    Applied: "info",
    "Under Review": "secondary",
    Shortlisted: "primary",
    "Interview Scheduled": "warning",
    Selected: "success",
    Rejected: "danger",
    Withdrawn: "dark",
  };
  return map[status] || "light";
};

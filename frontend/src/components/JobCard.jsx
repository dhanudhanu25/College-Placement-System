import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaBuilding } from "react-icons/fa";
import { fileUrl } from "../utils/format";

const JobCard = ({ job, onApply, showApply = true, applying = false }) => {
  const company = job.company || {};
  return (
    <div className="card card-hover p-3 h-100 d-flex flex-column">
      <div className="d-flex align-items-center gap-2 mb-2">
        {company.logo ? (
          <img
            src={fileUrl(company.logo)}
            alt={company.companyName}
            width={42}
            height={42}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          <div
            className="avatar"
            style={{ width: 42, height: 42 }}
          >
            {company.companyName?.charAt(0) || "C"}
          </div>
        )}
        <div>
          <Link
            to={`/jobs/${job._id}`}
            className="fw-bold text-decoration-none text-dark"
          >
            {job.title}
          </Link>
          <div className="small text-muted-cpp d-flex align-items-center gap-1">
            <FaBuilding /> {company.companyName || "Company"}
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 small text-muted-cpp mb-2">
        <span className="d-flex align-items-center gap-1">
          <FaMapMarkerAlt /> {job.location || "Anywhere"}
        </span>
        <span className="d-flex align-items-center gap-1">
          <FaBriefcase /> {job.jobType}
        </span>
        <span className="d-flex align-items-center gap-1">
          <FaMoneyBillWave /> {job.salary}
        </span>
      </div>

      <div className="mt-auto d-flex gap-2">
        <Link to={`/jobs/${job._id}`} className="btn btn-outline-primary btn-sm flex-fill">
          View Details
        </Link>
        {showApply && (
          <button
            className="btn btn-primary btn-sm flex-fill"
            disabled={applying}
            onClick={() => onApply && onApply(job)}
          >
            {applying ? "Applying..." : "Apply"}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;

import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaIndustry, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { fileUrl } from "../utils/format";

const CompanyCard = ({ company }) => (
  <div className="card card-hover p-3 h-100 text-center">
    <div className="mx-auto mb-2">
      {company.logo ? (
        <img
          src={fileUrl(company.logo)}
          alt={company.companyName}
          width={64}
          height={64}
          style={{ objectFit: "cover", borderRadius: 12 }}
        />
      ) : (
        <div className="avatar mx-auto" style={{ width: 64, height: 64, fontSize: 24 }}>
          {company.companyName?.charAt(0)}
        </div>
      )}
    </div>
    <Link
      to={`/companies/${company._id}`}
      className="fw-bold text-decoration-none text-dark"
    >
      {company.companyName}
    </Link>
    <div className="small text-muted-cpp d-flex align-items-center justify-content-center gap-1 mt-1">
      <FaIndustry /> {company.industry || "Industry"}
    </div>
    <div className="small text-muted-cpp d-flex align-items-center justify-content-center gap-1">
      <FaMapMarkerAlt /> {company.location || "Location"}
    </div>
    <div className="mt-2">
      {company.approved ? (
        <span className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1">
          <FaCheckCircle /> Verified
        </span>
      ) : (
        <span className="badge bg-warning-subtle text-warning d-inline-flex align-items-center gap-1">
          <FaTimesCircle /> Pending
        </span>
      )}
    </div>
  </div>
);

export default CompanyCard;

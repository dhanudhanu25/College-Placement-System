import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { companyService, jobService } from "../../services/dataService";
import { useAuth } from "../../context/AuthContext";
import JobCard from "../../components/JobCard";
import Spinner from "../../components/Spinner";
import { fileUrl } from "../../utils/format";
import { toast } from "react-toastify";
import { FaIndustry, FaMapMarkerAlt, FaGlobe, FaBriefcase } from "react-icons/fa";

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([companyService.getById(id), jobService.getAll({ company: id, limit: 50 })])
      .then(([c, j]) => {
        setCompany(c.data.company);
        setJobs(j.data.jobs);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner fullScreen />;
  if (!company) return <div className="container py-5">Company not found.</div>;

  const applyFlow = (job) => {
    if (!user) {
      toast.info("Please login to apply.");
      return navigate("/login");
    }
    if (user.role !== "student") return toast.warn("Only students can apply.");
    navigate(`/jobs/${job._id}`);
  };

  return (
    <div className="py-4">
      <div className="container">
        <div className="card p-4 mb-4">
          <div className="d-flex align-items-center gap-3">
            {company.logo ? (
              <img
                src={fileUrl(company.logo)}
                width={80}
                height={80}
                style={{ objectFit: "cover", borderRadius: 12 }}
                alt=""
              />
            ) : (
              <div className="avatar" style={{ width: 80, height: 80, fontSize: 32 }}>
                {company.companyName.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="fw-bold mb-1">{company.companyName}</h3>
              <div className="text-muted-cpp d-flex flex-wrap gap-3 small">
                <span><FaIndustry /> {company.industry}</span>
                <span><FaMapMarkerAlt /> {company.location}</span>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer">
                    <FaGlobe /> Website
                  </a>
                )}
              </div>
            </div>
          </div>
          <p className="text-muted-cpp mt-3 mb-0">{company.description}</p>
        </div>

        <h4 className="section-title mb-3 d-flex align-items-center gap-2">
          <FaBriefcase /> Open Positions ({jobs.length})
        </h4>
        {jobs.length === 0 ? (
          <p className="text-muted-cpp">No active jobs posted yet.</p>
        ) : (
          <div className="row g-3">
            {jobs.map((j) => (
              <div className="col-md-6 col-lg-4" key={j._id}>
                <JobCard job={j} onApply={applyFlow} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;

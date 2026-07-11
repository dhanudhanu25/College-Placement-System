import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobService, applicationService } from "../../services/dataService";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";
import { fileUrl, formatDate } from "../../utils/format";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaBuilding,
  FaArrowLeft,
} from "react-icons/fa";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    jobService.getById(id).then((res) => setJob(res.data.job)).finally(() => setLoading(false));
    if (user?.role === "student") {
      applicationService
        .getAll({ student: user._id, job: id })
        .then((res) => {
          if (res.data.applications?.length) setApplied(true);
        })
        .catch(() => {});
    }
  }, [id, user]);

  if (loading) return <Spinner fullScreen />;
  if (!job) return <div className="container py-5">Job not found.</div>;

  const handleApply = async () => {
    if (!user) {
      toast.info("Please login to apply.");
      return navigate("/login");
    }
    if (user.role !== "student") return toast.warn("Only students can apply.");
    setApplying(true);
    try {
      await applicationService.apply(job._id);
      toast.success("Applied successfully!");
      setApplied(true);
      navigate("/student/applied");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply.");
    } finally {
      setApplying(false);
    }
  };

  const company = job.company || {};

  return (
    <div className="py-4">
      <div className="container">
        <button className="btn btn-link text-decoration-none ps-0 mb-3" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                {company.logo ? (
                  <img src={fileUrl(company.logo)} width={60} height={60} style={{ objectFit: "cover", borderRadius: 10 }} alt="" />
                ) : (
                  <div className="avatar" style={{ width: 60, height: 60 }}>{company.companyName?.charAt(0)}</div>
                )}
                <div>
                  <h3 className="fw-bold mb-0">{job.title}</h3>
                  <div className="text-muted-cpp">{company.companyName}</div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3 mb-3 small">
                <span className="badge bg-light text-dark"><FaMapMarkerAlt className="me-1" />{job.location}</span>
                <span className="badge bg-light text-dark"><FaBriefcase className="me-1" />{job.jobType}</span>
                <span className="badge bg-light text-dark"><FaMoneyBillWave className="me-1" />{job.salary}</span>
                <span className="badge bg-light text-dark"><FaCalendarAlt className="me-1" />Exp: {job.experience}</span>
              </div>

              <h6 className="fw-bold">Description</h6>
              <p className="text-muted-cpp">{job.description}</p>

              <h6 className="fw-bold">Requirements</h6>
              <ul className="text-muted-cpp">
                {(job.requirements || []).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>

              <div className="small text-muted-cpp">
                <FaCalendarAlt className="me-1" />
                Deadline: {formatDate(job.deadline)}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card p-4">
              {user?.role === "student" ? (
                applied ? (
                  <div className="alert alert-success text-center mb-0">
                    ✓ You have already applied to this job.
                  </div>
                ) : (
                  <button
                    className="btn btn-primary w-100"
                    disabled={applying}
                    onClick={handleApply}
                  >
                    {applying ? "Applying..." : "Apply Now"}
                  </button>
                )
              ) : (
                <div className="alert alert-info text-center mb-0">
                  {user ? "Recruiters/admins cannot apply." : "Login as a student to apply."}
                </div>
              )}
              <hr />
              <div className="small">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FaBuilding /> {company.companyName}
                </div>
                <div className="text-muted-cpp">{company.industry} · {company.location}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

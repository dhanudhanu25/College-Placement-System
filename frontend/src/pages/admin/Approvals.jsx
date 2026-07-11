import { useState, useEffect } from "react";
import { adminService, companyService, jobService } from "../../services/dataService";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { fileUrl } from "../../utils/format";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaBuilding, FaBriefcase } from "react-icons/fa";

const Approvals = () => {
  const [data, setData] = useState({ loading: true, companies: [], jobs: [] });

  const load = () => {
    setData((d) => ({ ...d, loading: true }));
    adminService.pending().then((res) =>
      setData({ loading: false, companies: res.data.companies, jobs: res.data.jobs })
    );
  };
  useEffect(load, []);

  const approveCompany = async (id, approved) => {
    try {
      await companyService.setApproval(id, approved);
      toast.success(approved ? "Company approved." : "Company rejected.");
      load();
    } catch (e) {
      toast.error("Failed.");
    }
  };

  const approveJob = async (id, approved) => {
    try {
      await jobService.setApproval(id, approved);
      toast.success(approved ? "Job approved." : "Job rejected.");
      load();
    } catch (e) {
      toast.error("Failed.");
    }
  };

  if (data.loading) return <Spinner fullScreen />;

  return (
    <div>
      <h4 className="section-title mb-3">Pending Approvals</h4>

      <h6 className="fw-bold mt-2">
        <FaBuilding className="me-2 text-primary" /> Companies ({data.companies.length})
      </h6>
      {data.companies.length === 0 ? (
        <EmptyState title="No pending companies" />
      ) : (
        data.companies.map((c) => (
          <div className="card p-3 mb-2 d-flex flex-row justify-content-between align-items-center" key={c._id}>
            <div className="d-flex align-items-center gap-2">
              {c.logo ? (
                <img src={fileUrl(c.logo)} width={40} height={40} style={{ objectFit: "cover", borderRadius: 8 }} alt="" />
              ) : (
                <div className="avatar" style={{ width: 40, height: 40 }}>{c.companyName.charAt(0)}</div>
              )}
              <div>
                <div className="fw-semibold">{c.companyName}</div>
                <div className="small text-muted-cpp">{c.industry} · {c.location}</div>
              </div>
            </div>
            <div className="btn-group btn-group-sm">
              <button className="btn btn-success" onClick={() => approveCompany(c._id, true)}>
                <FaCheck /> Approve
              </button>
              <button className="btn btn-outline-danger" onClick={() => approveCompany(c._id, false)}>
                <FaTimes /> Reject
              </button>
            </div>
          </div>
        ))
      )}

      <h6 className="fw-bold mt-4">
        <FaBriefcase className="me-2 text-primary" /> Jobs ({data.jobs.length})
      </h6>
      {data.jobs.length === 0 ? (
        <EmptyState title="No pending jobs" />
      ) : (
        data.jobs.map((j) => (
          <div className="card p-3 mb-2 d-flex flex-row justify-content-between align-items-center" key={j._id}>
            <div>
              <div className="fw-semibold">{j.title}</div>
              <div className="small text-muted-cpp">
                {j.company?.companyName} · {j.location}
              </div>
            </div>
            <div className="btn-group btn-group-sm">
              <button className="btn btn-success" onClick={() => approveJob(j._id, true)}>
                <FaCheck /> Approve
              </button>
              <button className="btn btn-outline-danger" onClick={() => approveJob(j._id, false)}>
                <FaTimes /> Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Approvals;

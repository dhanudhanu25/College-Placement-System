import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { applicationService } from "../../services/dataService";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { statusBadge, fileUrl, formatDate, APPLICATION_STATUSES } from "../../utils/format";
import { toast } from "react-toastify";
import { FaUserGraduate, FaFileAlt, FaCheck, FaTimes, FaEye } from "react-icons/fa";

const ViewApplicants = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const load = () => {
    setLoading(true);
    applicationService
      .getAll({ limit: 100, status: statusFilter })
      .then((res) => setApps(res.data.applications))
      .finally(() => setLoading(false));
  };
  useEffect(load, [statusFilter, user]);

  const update = async (id, status) => {
    try {
      await applicationService.update(id, { status });
      toast.success("Status updated.");
      load();
    } catch (e) {
      toast.error("Failed.");
    }
  };

  if (loading) return <Spinner fullScreen />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="section-title mb-0">
          <FaUserGraduate className="me-2 text-primary" /> View Applicants
        </h4>
        <select
          className="form-select w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {apps.length === 0 ? (
        <EmptyState title="No applicants found" />
      ) : (
        <div className="card p-2">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Job</th>
                  <th>CGPA</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {a.student?.profileImage ? (
                          <img src={fileUrl(a.student.profileImage)} width={34} height={34} style={{ borderRadius: "50%", objectFit: "cover" }} alt="" />
                        ) : (
                          <div className="avatar" style={{ width: 34, height: 34 }}>{a.student?.name?.charAt(0)}</div>
                        )}
                        <div>
                          <div className="fw-semibold small">{a.student?.name}</div>
                          <div className="small text-muted-cpp">{a.student?.department}</div>
                        </div>
                      </div>
                    </td>
                    <td>{a.job?.title}</td>
                    <td>{a.student?.cgpa}</td>
                    <td>
                      <span className={`badge bg-${statusBadge(a.status)}-subtle text-${statusBadge(a.status)}`}>{a.status}</span>
                    </td>
                    <td className="small text-muted-cpp">{formatDate(a.appliedDate)}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary" onClick={() => setSelected(a)} title="View">
                          <FaEye />
                        </button>
                        <a
                          className="btn btn-outline-primary"
                          href={a.resume ? fileUrl(a.resume) : (a.student?.resume ? fileUrl(a.student.resume) : "#")}
                          target="_blank"
                          rel="noreferrer"
                          title="Resume"
                        >
                          <FaFileAlt />
                        </a>
                        <button className="btn btn-outline-success" onClick={() => update(a._id, "Selected")} title="Accept">
                          <FaCheck />
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => update(a._id, "Rejected")} title="Reject">
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Applicant detail modal */}
      {selected && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setSelected(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selected.student?.name}</h5>
                <button className="btn-close" onClick={() => setSelected(null)} />
              </div>
              <div className="modal-body">
                <p className="small text-muted-cpp mb-1">{selected.student?.email}</p>
                <p className="small text-muted-cpp mb-1">Department: {selected.student?.department}</p>
                <p className="small text-muted-cpp mb-1">CGPA: {selected.student?.cgpa}</p>
                <p className="small text-muted-cpp mb-2">
                  Skills: {(selected.student?.skills || []).join(", ")}
                </p>
                <p className="small mb-1">Applied for: <strong>{selected.job?.title}</strong></p>
                <p className="small text-muted-cpp">Applied on: {formatDate(selected.appliedDate)}</p>
                <label className="small fw-semibold">Update Status</label>
                <select
                  className="form-select"
                  value={selected.status}
                  onChange={(e) => {
                    update(selected._id, e.target.value);
                    setSelected({ ...selected, status: e.target.value });
                  }}
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <a
                  className="btn btn-primary btn-sm"
                  href={selected.resume ? fileUrl(selected.resume) : (selected.student?.resume ? fileUrl(selected.student.resume) : "#")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaFileAlt className="me-1" /> Download Resume
                </a>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplicants;

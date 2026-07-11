import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jobService } from "../../services/dataService";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { formatDate } from "../../utils/format";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaUsers } from "react-icons/fa";

const ManageJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    jobService
      .getAll({ company: user?.company, limit: 100 })
      .then((res) => setJobs(res.data.jobs))
      .finally(() => setLoading(false));
  };
  useEffect(load, [user]);

  const remove = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await jobService.remove(id);
      toast.success("Job deleted.");
      load();
    } catch (e) {
      toast.error("Failed.");
    }
  };

  if (loading) return <Spinner fullScreen />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="section-title mb-0">Manage Jobs</h4>
        <Link to="/company/post-job" className="btn btn-primary btn-sm">
          <FaPlus className="me-1" /> Post Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState title="No jobs posted yet" action={<Link to="/company/post-job" className="btn btn-primary btn-sm">Post your first job</Link>} />
      ) : (
        <div className="card p-2">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j._id}>
                    <td className="fw-semibold">{j.title}</td>
                    <td>{j.location}</td>
                    <td>{j.jobType}</td>
                    <td>
                      {j.approved ? (
                        <span className="badge bg-success-subtle text-success">Approved</span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning">Pending</span>
                      )}
                    </td>
                    <td className="small text-muted-cpp">{formatDate(j.deadline)}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Link to={`/jobs/${j._id}`} className="btn btn-outline-secondary">
                          <FaUsers />
                        </Link>
                        <button className="btn btn-outline-danger" onClick={() => remove(j._id)}>
                          <FaTrash />
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
    </div>
  );
};

export default ManageJobs;

import { useState, useEffect } from "react";
import { jobService } from "../../services/dataService";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { formatDate } from "../../utils/format";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaTrash, FaBriefcase } from "react-icons/fa";

const ManageJobs = () => {
  const [params, setParams] = useState({ page: 1, limit: 10, search: "" });
  const [state, setState] = useState({ loading: true, jobs: [], total: 0, pages: 1 });

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }));
    jobService.getAll(params).then((res) =>
      setState({
        loading: false,
        jobs: res.data.jobs,
        total: res.data.total,
        pages: res.data.pages,
      })
    );
  }, [params]);

  const approve = async (id, approved) => {
    try {
      await jobService.setApproval(id, approved);
      toast.success(approved ? "Job approved." : "Job rejected.");
      setParams((p) => ({ ...p, page: 1 }));
    } catch (e) {
      toast.error("Failed.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await jobService.remove(id);
      toast.success("Job deleted.");
      setParams((p) => ({ ...p, page: 1 }));
    } catch (e) {
      toast.error("Failed.");
    }
  };

  return (
    <div>
      <h4 className="section-title mb-3">Manage Jobs</h4>
      <SearchBar
        onSearch={(search) => setParams((p) => ({ ...p, search, page: 1 }))}
        placeholder="Search jobs..."
        className="mb-3"
      />

      {state.loading ? (
        <Spinner fullScreen />
      ) : state.jobs.length === 0 ? (
        <EmptyState title="No jobs found" />
      ) : (
        <>
          <div className="card p-2">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.jobs.map((j) => (
                    <tr key={j._id}>
                      <td className="fw-semibold">{j.title}</td>
                      <td>{j.company?.companyName}</td>
                      <td>{j.location}</td>
                      <td>
                        {j.approved ? (
                          <span className="badge bg-success-subtle text-success">Approved</span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning">Pending</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          {!j.approved && (
                            <button className="btn btn-outline-success" onClick={() => approve(j._id, true)}>
                              <FaCheck />
                            </button>
                          )}
                          {j.approved && (
                            <button className="btn btn-outline-warning" onClick={() => approve(j._id, false)}>
                              <FaTimes />
                            </button>
                          )}
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
          <div className="mt-3">
            <Pagination page={params.page} pages={state.pages} onPageChange={(page) => setParams((p) => ({ ...p, page }))} />
          </div>
        </>
      )}
    </div>
  );
};

export default ManageJobs;

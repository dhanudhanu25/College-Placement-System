import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { applicationService } from "../../services/dataService";
import { useAuth } from "../../context/AuthContext";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { generateOfferLetter } from "../../components/OfferLetter";
import { statusBadge, formatDate } from "../../utils/format";
import { toast } from "react-toastify";
import { FaFilePdf, FaTimesCircle } from "react-icons/fa";

const AppliedJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, limit: 8, student: user?._id });
  const [state, setState] = useState({ loading: true, apps: [], total: 0, pages: 1 });
  const [withdrawing, setWithdrawing] = useState(null);

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }));
    applicationService
      .getAll(params)
      .then((res) =>
        setState({
          loading: false,
          apps: res.data.applications,
          total: res.data.total,
          pages: res.data.pages,
        })
      )
      .catch(() => setState((s) => ({ ...s, loading: false })));
  }, [params]);

  const withdraw = async (app) => {
    if (!window.confirm("Withdraw this application?")) return;
    setWithdrawing(app._id);
    try {
      await applicationService.remove(app._id);
      toast.success("Application withdrawn.");
      setParams((p) => ({ ...p, page: 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally {
      setWithdrawing(null);
    }
  };

  if (state.loading) return <Spinner fullScreen />;

  return (
    <div>
      <h4 className="section-title mb-3">Applied Jobs</h4>
      {state.apps.length === 0 ? (
        <EmptyState
          title="No applications yet"
          message="Browse jobs and apply to track them here."
          action={
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/jobs")}>
              Browse Jobs
            </button>
          }
        />
      ) : (
        <>
          <div className="card p-3">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.apps.map((a) => (
                    <tr key={a._id}>
                      <td className="fw-semibold">{a.job?.title}</td>
                      <td>{a.company?.companyName}</td>
                      <td>
                        <span className={`badge bg-${statusBadge(a.status)}-subtle text-${statusBadge(a.status)}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="small text-muted-cpp">{formatDate(a.appliedDate)}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          {a.status === "Selected" && (
                            <button
                              className="btn btn-outline-success"
                              onClick={() =>
                                generateOfferLetter(user, a.job, a.company)
                              }
                              title="Download Offer Letter"
                            >
                              <FaFilePdf />
                            </button>
                          )}
                          <button
                            className="btn btn-outline-danger"
                            disabled={withdrawing === a._id}
                            onClick={() => withdraw(a)}
                          >
                            <FaTimesCircle />
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
            <Pagination
              page={params.page}
              pages={state.pages}
              onPageChange={(page) => setParams((p) => ({ ...p, page }))}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AppliedJobs;

import { useState, useEffect } from "react";
import { applicationService } from "../../services/dataService";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { statusBadge, formatDate } from "../../utils/format";
import { APPLICATION_STATUSES } from "../../utils/format";
import { toast } from "react-toastify";
import { FaUserGraduate, FaSync } from "react-icons/fa";

const ManageApplications = () => {
  const [params, setParams] = useState({ page: 1, limit: 10, status: "", job: "" });
  const [state, setState] = useState({ loading: true, apps: [], total: 0, pages: 1 });
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }));
    applicationService.getAll(params).then((res) =>
      setState({
        loading: false,
        apps: res.data.applications,
        total: res.data.total,
        pages: res.data.pages,
      })
    );
  }, [params]);

  const updateStatus = async (id, status) => {
    try {
      await applicationService.update(id, { status });
      toast.success("Status updated.");
      setParams((p) => ({ ...p, page: 1 }));
    } catch (e) {
      toast.error("Failed.");
    }
  };

  return (
    <div>
      <h4 className="section-title mb-3">Manage Applications</h4>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={params.status}
            onChange={(e) => setParams((p) => ({ ...p, status: e.target.value, page: 1 }))}
          >
            <option value="">All Statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {state.loading ? (
        <Spinner fullScreen />
      ) : state.apps.length === 0 ? (
        <EmptyState title="No applications found" />
      ) : (
        <>
          <div className="card p-2">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {state.apps.map((a) => (
                    <tr key={a._id}>
                      <td>
                        <div className="fw-semibold">{a.student?.name}</div>
                        <div className="small text-muted-cpp">{a.student?.department}</div>
                      </td>
                      <td>{a.job?.title}</td>
                      <td>{a.company?.companyName}</td>
                      <td>
                        <span className={`badge bg-${statusBadge(a.status)}-subtle text-${statusBadge(a.status)}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="small text-muted-cpp">{formatDate(a.appliedDate)}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={a.status}
                          onChange={(e) => updateStatus(a._id, e.target.value)}
                        >
                          {APPLICATION_STATUSES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
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

export default ManageApplications;

import { useState, useEffect } from "react";
import { companyService } from "../../services/dataService";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { fileUrl } from "../../utils/format";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaTrash, FaBuilding } from "react-icons/fa";

const ManageCompanies = () => {
  const [params, setParams] = useState({ page: 1, limit: 9, search: "" });
  const [state, setState] = useState({ loading: true, companies: [], total: 0, pages: 1 });

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }));
    companyService.getAll(params).then((res) =>
      setState({
        loading: false,
        companies: res.data.companies,
        total: res.data.total,
        pages: res.data.pages,
      })
    );
  }, [params]);

  const approve = async (id, approved) => {
    try {
      await companyService.setApproval(id, approved);
      toast.success(approved ? "Company approved." : "Company rejected.");
      setParams((p) => ({ ...p, page: 1 }));
    } catch (e) {
      toast.error("Failed.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this company and its jobs?")) return;
    try {
      await companyService.remove(id);
      toast.success("Company deleted.");
      setParams((p) => ({ ...p, page: 1 }));
    } catch (e) {
      toast.error("Failed.");
    }
  };

  return (
    <div>
      <h4 className="section-title mb-3">Manage Companies</h4>
      <SearchBar
        onSearch={(search) => setParams((p) => ({ ...p, search, page: 1 }))}
        placeholder="Search companies..."
        className="mb-3"
      />

      {state.loading ? (
        <Spinner fullScreen />
      ) : state.companies.length === 0 ? (
        <EmptyState title="No companies found" />
      ) : (
        <>
          <div className="card p-2">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Industry</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.companies.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {c.logo ? (
                            <img src={fileUrl(c.logo)} width={32} height={32} style={{ objectFit: "cover", borderRadius: 6 }} alt="" />
                          ) : (
                            <div className="avatar" style={{ width: 32, height: 32 }}>{c.companyName.charAt(0)}</div>
                          )}
                          <span className="fw-semibold">{c.companyName}</span>
                        </div>
                      </td>
                      <td>{c.industry}</td>
                      <td>{c.location}</td>
                      <td>
                        {c.approved ? (
                          <span className="badge bg-success-subtle text-success">Approved</span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning">Pending</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          {!c.approved && (
                            <button className="btn btn-outline-success" onClick={() => approve(c._id, true)}>
                              <FaCheck />
                            </button>
                          )}
                          {c.approved && (
                            <button className="btn btn-outline-warning" onClick={() => approve(c._id, false)}>
                              <FaTimes />
                            </button>
                          )}
                          <button className="btn btn-outline-danger" onClick={() => remove(c._id)}>
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

export default ManageCompanies;

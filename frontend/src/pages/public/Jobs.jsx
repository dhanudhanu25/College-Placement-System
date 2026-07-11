import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jobService, companyService } from "../../services/dataService";
import { useAuth } from "../../context/AuthContext";
import JobCard from "../../components/JobCard";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import { SkeletonCard } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import { JOB_TYPES } from "../../utils/format";
import { toast } from "react-toastify";

const Jobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [params, setParams] = useState({
    page: 1,
    limit: 9,
    search: "",
    location: "",
    jobType: "",
    experience: "",
    sort: "-createdAt",
    public: "true",
  });
  const [state, setState] = useState({ loading: true, jobs: [], total: 0, pages: 1 });
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true }));
    jobService.getAll(params).then((res) => {
      if (active)
        setState({
          loading: false,
          jobs: res.data.jobs,
          total: res.data.total,
          pages: res.data.pages,
        });
    });
    companyService.getAll({ limit: 50, approved: "true" }).then((res) =>
      setCompanies(res.data.companies)
    );
    return () => (active = false);
  }, [params]);

  const update = (patch) => setParams((p) => ({ ...p, ...patch, page: 1 }));
  const handleSearch = (search) => update({ search });
  const handlePage = (page) => setParams((p) => ({ ...p, page }));

  const applyFlow = (job) => {
    if (!user) {
      toast.info("Please login to apply for jobs.");
      return navigate("/login");
    }
    if (user.role !== "student") return toast.warn("Only students can apply.");
    navigate(`/jobs/${job._id}`);
  };

  return (
    <div className="py-4">
      <div className="container">
        <h2 className="section-title mb-3">Browse Jobs</h2>
        <div className="row g-3">
          {/* Filters */}
          <div className="col-lg-3">
            <div className="card p-3">
              <h6 className="fw-bold">Filters</h6>
              <div className="mb-3">
                <label className="small fw-semibold">Location</label>
                <input
                  className="form-control form-control-sm"
                  value={params.location}
                  onChange={(e) => update({ location: e.target.value })}
                  placeholder="e.g. Bangalore"
                />
              </div>
              <div className="mb-3">
                <label className="small fw-semibold">Job Type</label>
                <select
                  className="form-select form-select-sm"
                  value={params.jobType}
                  onChange={(e) => update({ jobType: e.target.value })}
                >
                  <option value="">All</option>
                  {JOB_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="small fw-semibold">Experience</label>
                <select
                  className="form-select form-select-sm"
                  value={params.experience}
                  onChange={(e) => update({ experience: e.target.value })}
                >
                  <option value="">All</option>
                  {["0-1 years", "1-2 years", "2-3 years", "3-5 years"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="small fw-semibold">Company</label>
                <select
                  className="form-select form-select-sm"
                  value={params.company}
                  onChange={(e) => update({ company: e.target.value })}
                >
                  <option value="">All</option>
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="small fw-semibold">Sort By</label>
                <select
                  className="form-select form-select-sm"
                  value={params.sort}
                  onChange={(e) => update({ sort: e.target.value })}
                >
                  <option value="-createdAt">Newest</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="location">Location</option>
                </select>
              </div>
              <button
                className="btn btn-outline-secondary btn-sm w-100 mt-3"
                onClick={() =>
                  setParams({
                    page: 1,
                    limit: 9,
                    search: "",
                    location: "",
                    jobType: "",
                    experience: "",
                    sort: "-createdAt",
                    public: "true",
                  })
                }
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* List */}
          <div className="col-lg-9">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search job title, location, experience"
              className="mb-3"
            />
            {state.loading ? (
              <div className="row g-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div className="col-md-6" key={i}>
                    <SkeletonCard />
                  </div>
                ))}
              </div>
            ) : state.jobs.length === 0 ? (
              <EmptyState title="No jobs found" message="Try adjusting your filters." />
            ) : (
              <>
                <p className="small text-muted-cpp">{state.total} jobs found</p>
                <div className="row g-3">
                  {state.jobs.map((j) => (
                    <div className="col-md-6 col-lg-4" key={j._id}>
                      <JobCard job={j} onApply={applyFlow} />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Pagination page={params.page} pages={state.pages} onPageChange={handlePage} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;

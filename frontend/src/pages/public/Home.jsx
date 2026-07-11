import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jobService, companyService, adminService } from "../../services/dataService";
import useFetch from "../../hooks/useFetch";
import JobCard from "../../components/JobCard";
import CompanyCard from "../../components/CompanyCard";
import Spinner from "../../components/Spinner";
import { SkeletonCard } from "../../components/Skeleton";
import { toast } from "react-toastify";
import { FaRocket, FaUserGraduate, FaBuilding, FaBriefcase, FaArrowRight } from "react-icons/fa";

const Home = () => {
  const { user } = useAuth();
  const jobs = useFetch(() => jobService.getAll({ limit: 6, public: "true" }), []);
  const companies = useFetch(() => companyService.getAll({ limit: 8, approved: "true" }), []);
  const stats = useFetch(() => adminService.dashboard(), []);

  const applyFlow = (job) => {
    if (!user) {
      toast.info("Please login to apply for jobs.");
      window.location.href = "/login";
      return;
    }
    if (user.role !== "student") {
      toast.warn("Only students can apply for jobs.");
      return;
    }
    window.location.href = `/jobs/${job._id}`;
  };

  const s = stats.data?.stats || {};

  return (
    <>
      {/* HERO */}
      <section className="gradient-hero py-5">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 text-white">
              <span className="badge bg-white text-primary mb-3 px-3 py-2">
                🚀 Your Career Starts Here
              </span>
              <h1 className="display-4 fw-bold mb-3">
                Launch Your Career with Top Companies
              </h1>
              <p className="lead mb-4 opacity-75">
                The College Placement Portal connects students with leading
                recruiters. Discover internships, jobs and build your future.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/jobs" className="btn btn-light btn-lg px-4">
                  Browse Jobs <FaArrowRight className="ms-2" />
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-outline-light btn-lg px-4"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="p-4 bg-white rounded-4 shadow-lg fade-up">
                <div className="row g-3 text-center">
                  {[
                    { icon: <FaUserGraduate />, label: "Students", value: s.totalStudents || "—" },
                    { icon: <FaBuilding />, label: "Companies", value: s.totalCompanies || "—" },
                    { icon: <FaBriefcase />, label: "Jobs", value: s.totalJobs || "—" },
                    { icon: <FaRocket />, label: "Placements", value: s.selected || "—" },
                  ].map((item, i) => (
                    <div className="col-6" key={i}>
                      <div className="p-3 rounded-3 bg-light">
                        <div className="text-primary fs-3">{item.icon}</div>
                        <div className="h4 fw-bold mb-0">{item.value}</div>
                        <div className="small text-muted">{item.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-4">
        <div className="container">
          <div className="row g-3 text-center">
            <div className="col-6 col-md-3">
              <div className="stat-card flex-column">
                <div className="icon mx-auto" style={{ background: "#4f46e5" }}>
                  <FaUserGraduate />
                </div>
                <div className="h3 mb-0">{s.totalStudents || "—"}</div>
                <div className="small text-muted-cpp">Registered Students</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card flex-column">
                <div className="icon mx-auto" style={{ background: "#0ea5e9" }}>
                  <FaBuilding />
                </div>
                <div className="h3 mb-0">{s.totalCompanies || "—"}</div>
                <div className="small text-muted-cpp">Partner Companies</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card flex-column">
                <div className="icon mx-auto" style={{ background: "#f59e0b" }}>
                  <FaBriefcase />
                </div>
                <div className="h3 mb-0">{s.totalJobs || "—"}</div>
                <div className="small text-muted-cpp">Active Jobs</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card flex-column">
                <div className="icon mx-auto" style={{ background: "#10b981" }}>
                  <FaRocket />
                </div>
                <div className="h3 mb-0">{s.totalApplications || "—"}</div>
                <div className="small text-muted-cpp">Applications</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP RECRUITERS */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0">Top Recruiters</h2>
            <Link to="/companies" className="text-decoration-none">
              View all <FaArrowRight />
            </Link>
          </div>
          {companies.loading ? (
            <div className="row g-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="col-md-3" key={i}>
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-3">
              {companies.data?.companies?.map((c) => (
                <div className="col-md-3 col-6" key={c._id}>
                  <CompanyCard company={c} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="py-5" style={{ background: "var(--cpp-surface)" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0">Latest Jobs</h2>
            <Link to="/jobs" className="text-decoration-none">
              Browse all <FaArrowRight />
            </Link>
          </div>
          {jobs.loading ? (
            <Spinner fullScreen />
          ) : (
            <div className="row g-3">
              {jobs.data?.jobs?.map((j) => (
                <div className="col-lg-4 col-md-6" key={j._id}>
                  <JobCard job={j} onApply={applyFlow} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SUCCESS STORIES / TESTIMONIALS */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-center mb-4">Success Stories</h2>
          <div className="row g-3">
            {[
              {
                name: "Aarav Sharma",
                role: "SDE at TechNova",
                text: "The portal made it incredibly easy to find and apply to roles that matched my skills. I landed my dream job!",
              },
              {
                name: "Priya Nair",
                role: "Analyst at DataCrest",
                text: "Great platform with a clean interface. The notifications kept me updated on every application status.",
              },
              {
                name: "Rohan Verma",
                role: "Intern at InnoSoft",
                text: "From profile to offer letter, everything was seamless. Highly recommended for every student.",
              },
            ].map((t, i) => (
              <div className="col-md-4" key={i}>
                <div className="card p-4 h-100">
                  <div className="text-warning mb-2">★★★★★</div>
                  <p className="text-muted-cpp">"{t.text}"</p>
                  <div className="d-flex align-items-center gap-2 mt-auto">
                    <div className="avatar">{t.name.charAt(0)}</div>
                    <div>
                      <div className="fw-bold small">{t.name}</div>
                      <div className="small text-muted-cpp">{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container">
          <div className="gradient-hero rounded-4 p-5 text-center text-white">
            <h2 className="fw-bold">Ready to begin your journey?</h2>
            <p className="lead opacity-75">
              Join thousands of students who found their career through our portal.
            </p>
            <Link to="/signup" className="btn btn-light btn-lg px-4">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

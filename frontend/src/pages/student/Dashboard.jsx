import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/dataService";
import useFetch from "../../hooks/useFetch";
import StatCard from "../../components/StatCard";
import Spinner from "../../components/Spinner";
import { BarChart } from "../../components/charts/Charts";
import { fileUrl, formatDate, statusBadge } from "../../utils/format";
import { FaBriefcase, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();
  const dash = useFetch(() => studentService.dashboard(), []);
  const completion = useFetch(() => studentService.completion(), []);

  if (dash.loading) return <Spinner fullScreen />;

  const stats = dash.data?.stats || {};
  const applications = dash.data?.applications || [];
  const percent = completion.data?.percent || 0;

  const statusCounts = {};
  applications.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });
  const chartLabels = Object.keys(statusCounts);
  const chartData = Object.values(statusCounts);

  return (
    <div>
      {/* Greeting */}
      <div className="card p-4 mb-4 gradient-hero text-white fade-up">
        <h3 className="fw-bold mb-1">Welcome, {user?.name} 👋</h3>
        <p className="mb-0 opacity-75">
          Track your applications and discover new opportunities.
        </p>
      </div>

      {/* Profile completion */}
      <div className="card p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-semibold small">Profile Completion</span>
          <span className="badge bg-primary-subtle text-primary">{percent}%</span>
        </div>
        <div className="progress" style={{ height: 8 }}>
          <div
            className="progress-bar bg-primary"
            style={{ width: `${percent}%` }}
          />
        </div>
        {percent < 100 && (
          <Link to="/student/profile" className="small text-decoration-none mt-2 d-inline-block">
            Complete your profile →
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatCard icon={<FaBriefcase />} title="Applied" value={stats.appliedCount} color="#4f46e5" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<FaClock />} title="Pending" value={stats.pendingCount} color="#f59e0b" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<FaCheckCircle />} title="Selected" value={stats.selectedCount} color="#10b981" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<FaTimesCircle />} title="Rejected" value={stats.rejectedCount} color="#ef4444" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card p-3">
            <h6 className="fw-bold">Application Status</h6>
            {chartLabels.length ? (
              <BarChart labels={chartLabels} data={chartData} label="Applications" />
            ) : (
              <p className="text-muted-cpp small">No applications yet.</p>
            )}
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card p-3">
            <h6 className="fw-bold mb-3">Recent Applications</h6>
            {applications.length === 0 ? (
              <p className="text-muted-cpp small">
                You haven't applied to any jobs yet.{" "}
                <Link to="/jobs">Browse jobs →</Link>
              </p>
            ) : (
              <div className="list-group list-group-flush">
                {applications.slice(0, 6).map((a) => (
                  <div
                    key={a._id}
                    className="list-group-item d-flex justify-content-between align-items-center px-0"
                    style={{ background: "transparent" }}
                  >
                    <div>
                      <div className="fw-semibold">{a.job?.title}</div>
                      <div className="small text-muted-cpp">
                        {a.company?.companyName} · {formatDate(a.appliedDate)}
                      </div>
                    </div>
                    <span className={`badge bg-${statusBadge(a.status)}-subtle text-${statusBadge(a.status)}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

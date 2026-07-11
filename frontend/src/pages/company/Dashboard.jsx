import { useAuth } from "../../context/AuthContext";
import { companyService } from "../../services/dataService";
import useFetch from "../../hooks/useFetch";
import StatCard from "../../components/StatCard";
import Spinner from "../../components/Spinner";
import { DoughnutChart } from "../../components/charts/Charts";
import { fileUrl, statusBadge } from "../../utils/format";
import { FaBriefcase, FaUsers, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

const CompanyDashboard = () => {
  const { user } = useAuth();
  const dash = useFetch(() => companyService.dashboard(), []);

  if (dash.loading) return <Spinner fullScreen />;

  const stats = dash.data?.stats || {};
  const applications = dash.data?.applications || [];

  const statusMap = {};
  applications.forEach((a) => {
    statusMap[a.status] = (statusMap[a.status] || 0) + 1;
  });

  return (
    <div>
      <div className="card p-4 mb-4 gradient-hero text-white fade-up">
        <h3 className="fw-bold mb-0">{user?.company?.companyName || "Company"} Dashboard</h3>
        <p className="mb-0 opacity-75">Manage your job posts and candidates.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatCard icon={<FaBriefcase />} title="Posted Jobs" value={stats.postedJobs} color="#4f46e5" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<FaUsers />} title="Applications" value={stats.applications} color="#0ea5e9" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<FaCalendarAlt />} title="Interviews" value={stats.interviewsScheduled} color="#f59e0b" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<FaCheckCircle />} title="Selected" value={stats.selectedCandidates} color="#10b981" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card p-3">
            <h6 className="fw-bold">Application Status</h6>
            <DoughnutChart
              labels={Object.keys(statusMap)}
              data={Object.values(statusMap)}
            />
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card p-3">
            <h6 className="fw-bold mb-3">Recent Applicants</h6>
            {applications.length === 0 ? (
              <p className="text-muted-cpp small">No applications yet.</p>
            ) : (
              <div className="list-group list-group-flush">
                {applications.slice(0, 6).map((a) => (
                  <div key={a._id} className="list-group-item d-flex justify-content-between align-items-center px-0" style={{ background: "transparent" }}>
                    <div className="d-flex align-items-center gap-2">
                      {a.student?.profileImage ? (
                        <img src={fileUrl(a.student.profileImage)} width={36} height={36} style={{ borderRadius: "50%", objectFit: "cover" }} alt="" />
                      ) : (
                        <div className="avatar" style={{ width: 36, height: 36 }}>{a.student?.name?.charAt(0)}</div>
                      )}
                      <div>
                        <div className="fw-semibold small">{a.student?.name}</div>
                        <div className="small text-muted-cpp">{a.job?.title}</div>
                      </div>
                    </div>
                    <span className={`badge bg-${statusBadge(a.status)}-subtle text-${statusBadge(a.status)}`}>{a.status}</span>
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

export default CompanyDashboard;

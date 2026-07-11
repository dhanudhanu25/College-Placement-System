import { Link } from "react-router-dom";
import { adminService } from "../../services/dataService";
import useFetch from "../../hooks/useFetch";
import StatCard from "../../components/StatCard";
import Spinner from "../../components/Spinner";
import { LineChart, DoughnutChart, BarChart } from "../../components/charts/Charts";
import { FaUserGraduate, FaBuilding, FaBriefcase, FaClipboardList, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

const AdminDashboard = () => {
  const dash = useFetch(() => adminService.dashboard(), []);

  if (dash.loading) return <Spinner fullScreen />;

  const s = dash.data?.stats || {};
  const monthly = dash.data?.monthly || { labels: [], data: [] };
  const status = dash.data?.statusBreakdown || [];
  const dept = dash.data?.byDepartment || [];

  const statusLabels = status.map((x) => x._id);
  const statusData = status.map((x) => x.count);
  const deptLabels = dept.map((x) => x._id || "Other");
  const deptData = dept.map((x) => x.count);

  return (
    <div>
      <div className="card p-4 mb-4 gradient-hero text-white fade-up">
        <h3 className="fw-bold mb-0">Placement Officer Dashboard</h3>
        <p className="mb-0 opacity-75">
          Overview of placement activities across the campus.
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatCard icon={<FaUserGraduate />} title="Students" value={s.totalStudents} color="#4f46e5" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<FaBuilding />} title="Companies" value={s.totalCompanies} color="#0ea5e9" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<FaBriefcase />} title="Jobs" value={s.totalJobs} color="#f59e0b" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<FaClipboardList />} title="Applications" value={s.totalApplications} color="#10b981" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<FaCheckCircle />} title="Selected" value={s.selected} color="#22c55e" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<FaHourglassHalf />} title="Interviews" value={s.interviews} color="#8b5cf6" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<FaBuilding />} title="Pending Cos." value={s.pendingCompanies} color="#ef4444" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard icon={<FaBriefcase />} title="Pending Jobs" value={s.pendingJobs} color="#f97316" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card p-3">
            <h6 className="fw-bold">Applications (Last 6 Months)</h6>
            <LineChart labels={monthly.labels} data={monthly.data} label="Applications" />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card p-3">
            <h6 className="fw-bold">Status Breakdown</h6>
            {statusLabels.length ? (
              <DoughnutChart labels={statusLabels} data={statusData} />
            ) : (
              <p className="text-muted-cpp small">No data.</p>
            )}
          </div>
        </div>
        <div className="col-12">
          <div className="card p-3">
            <h6 className="fw-bold">Students by Department</h6>
            <BarChart labels={deptLabels} data={deptData} label="Students" color="#0ea5e9" />
          </div>
        </div>
      </div>

      <div className="mt-3 d-flex gap-2 flex-wrap">
        <Link to="/admin/approvals" className="btn btn-outline-primary">
          Review Pending Approvals ({s.pendingCompanies + s.pendingJobs})
        </Link>
        <Link to="/admin/report" className="btn btn-outline-secondary">
          Generate Reports
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

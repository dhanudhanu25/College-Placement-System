import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import PublicLayout from "./components/PublicLayout";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

// Public pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Companies from "./pages/public/Companies";
import CompanyDetail from "./pages/public/CompanyDetail";
import Jobs from "./pages/public/Jobs";
import JobDetail from "./pages/public/JobDetail";
import Contact from "./pages/public/Contact";
import Login from "./pages/public/Login";
import Signup from "./pages/public/Signup";
import ForgotPassword from "./pages/public/ForgotPassword";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentEditProfile from "./pages/student/EditProfile";
import ResumeUpload from "./pages/student/ResumeUpload";
import AppliedJobs from "./pages/student/AppliedJobs";
import StudentNotifications from "./pages/student/Notifications";
import StudentSettings from "./pages/student/Settings";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageCompanies from "./pages/admin/ManageCompanies";
import ManageJobs from "./pages/admin/ManageJobs";
import ManageApplications from "./pages/admin/ManageApplications";
import Approvals from "./pages/admin/Approvals";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";

// Company pages
import CompanyDashboard from "./pages/company/Dashboard";
import CompanyProfile from "./pages/company/CompanyProfile";
import PostJob from "./pages/company/PostJob";
import CompanyManageJobs from "./pages/company/ManageJobs";
import ViewApplicants from "./pages/company/ViewApplicants";
import ScheduleInterviews from "./pages/company/ScheduleInterviews";

// Redirect logged-in users away from auth pages
const GuestOnly = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (user) {
    const dashboards = {
      student: "/student/dashboard",
      recruiter: "/company/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={dashboards[user.role] || "/"} replace />;
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public + auth routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/login"
          element={
            <GuestOnly>
              <Login />
            </GuestOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestOnly>
              <Signup />
            </GuestOnly>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestOnly>
              <ForgotPassword />
            </GuestOnly>
          }
        />
      </Route>

      {/* Student dashboard routes */}
      <Route
        element={
          <ProtectedRoute roles={["student"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/profile/edit" element={<StudentEditProfile />} />
        <Route path="/student/resume" element={<ResumeUpload />} />
        <Route path="/student/applied" element={<AppliedJobs />} />
        <Route path="/student/notifications" element={<StudentNotifications />} />
        <Route path="/student/settings" element={<StudentSettings />} />
      </Route>

      {/* Admin dashboard routes */}
      <Route
        element={
          <ProtectedRoute roles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<ManageStudents />} />
        <Route path="/admin/companies" element={<ManageCompanies />} />
        <Route path="/admin/jobs" element={<ManageJobs />} />
        <Route path="/admin/applications" element={<ManageApplications />} />
        <Route path="/admin/approvals" element={<Approvals />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* Company dashboard routes */}
      <Route
        element={
          <ProtectedRoute roles={["recruiter"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/profile" element={<CompanyProfile />} />
        <Route path="/company/post-job" element={<PostJob />} />
        <Route path="/company/jobs" element={CompanyManageJobs} />
        <Route path="/company/applicants" element={ViewApplicants} />
        <Route path="/company/interviews" element={ScheduleInterviews} />
      </Route>

      {/* 404 */}
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

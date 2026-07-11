import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to the correct dashboard based on role
    const dashboards = {
      student: "/student/dashboard",
      recruiter: "/company/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={dashboards[user.role] || "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;

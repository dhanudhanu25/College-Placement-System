import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaUser,
  FaFileAlt,
  FaBriefcase,
  FaBuilding,
  FaBell,
  FaCog,
  FaUsers,
  FaList,
  FaChartBar,
  FaPlus,
  FaCalendarAlt,
  FaUserGraduate,
  FaClipboardList,
  FaCheckCircle,
  FaGraduationCap,
} from "react-icons/fa";

const Sidebar = ({ onNavigate }) => {
  const { user } = useAuth();

  const studentLinks = [
    { to: "/student/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/student/profile", label: "My Profile", icon: <FaUser /> },
    { to: "/student/applied", label: "Applied Jobs", icon: <FaFileAlt /> },
    { to: "/jobs", label: "Browse Jobs", icon: <FaBriefcase /> },
    { to: "/companies", label: "Companies", icon: <FaBuilding /> },
    { to: "/student/notifications", label: "Notifications", icon: <FaBell /> },
    { to: "/student/settings", label: "Settings", icon: <FaCog /> },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/admin/students", label: "Manage Students", icon: <FaUsers /> },
    { to: "/admin/companies", label: "Manage Companies", icon: <FaBuilding /> },
    { to: "/admin/jobs", label: "Manage Jobs", icon: <FaBriefcase /> },
    { to: "/admin/applications", label: "Applications", icon: <FaClipboardList /> },
    { to: "/admin/approvals", label: "Approvals", icon: <FaCheckCircle /> },
    { to: "/admin/analytics", label: "Analytics", icon: <FaChartBar /> },
    { to: "/admin/settings", label: "Settings", icon: <FaCog /> },
  ];

  const companyLinks = [
    { to: "/company/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/company/profile", label: "Company Profile", icon: <FaBuilding /> },
    { to: "/company/post-job", label: "Post Job", icon: <FaPlus /> },
    { to: "/company/jobs", label: "Manage Jobs", icon: <FaList /> },
    { to: "/company/applicants", label: "View Applicants", icon: <FaUserGraduate /> },
    { to: "/company/interviews", label: "Interviews", icon: <FaCalendarAlt /> },
  ];

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "recruiter"
      ? companyLinks
      : studentLinks;

  return (
    <aside className="sidebar">
      <div className="brand">
        <FaGraduationCap /> Placement Portal
      </div>
      <nav className="nav flex-column">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className="nav-link"
            onClick={onNavigate}
          >
            <span style={{ width: 20 }}>{l.icon}</span> {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

import { useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";
import { FaBars, FaBell, FaSignOutAlt, FaUser } from "react-icons/fa";
import { fileUrl } from "../utils/format";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="dashboard-shell">
      <Sidebar onNavigate={() => setOpen(false)} />
      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}
      {open && <Sidebar />}

      <div className="dashboard-content">
        <div className="topbar">
          <button
            className="btn btn-sm d-lg-none"
            onClick={() => setOpen(!open)}
          >
            <FaBars />
          </button>
          <div className="ms-auto d-flex align-items-center gap-3">
            <Link to="/student/notifications" className="text-decoration-none text-muted position-relative">
              <FaBell />
            </Link>
            <ThemeToggle />
            <div className="dropdown">
              <button
                className="btn btn-sm d-flex align-items-center gap-2"
                data-bs-toggle="dropdown"
              >
                {user?.profileImage ? (
                  <img
                    src={fileUrl(user.profileImage)}
                    width={34}
                    height={34}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                    alt=""
                  />
                ) : (
                  <div className="avatar" style={{ width: 34, height: 34 }}>
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="d-none d-sm-inline fw-semibold small">
                  {user?.name}
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link
                    className="dropdown-item"
                    to={
                      user?.role === "recruiter"
                        ? "/company/profile"
                        : "/student/profile"
                    }
                  >
                    <FaUser className="me-2" /> Profile
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

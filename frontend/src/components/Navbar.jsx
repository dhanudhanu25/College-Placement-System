import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { FaGraduationCap } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboards = {
    student: "/student/dashboard",
    recruiter: "/company/dashboard",
    admin: "/admin/dashboard",
  };

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/companies", label: "Companies" },
    { to: "/jobs", label: "Jobs" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-cpp sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <span className="text-primary fs-4">
            <FaGraduationCap />
          </span>
          <span>
            Placement<span className="text-primary">Portal</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#cppNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="cppNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {publicLinks.map((l) => (
              <li className="nav-item" key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <Link to={dashboards[user.role]} className="btn btn-primary btn-sm">
                  Dashboard
                </Link>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => logout()}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

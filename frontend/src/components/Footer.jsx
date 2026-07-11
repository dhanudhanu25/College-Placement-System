import { Link } from "react-router-dom";
import { FaGraduationCap, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => (
  <footer
    className="pt-5 pb-3 mt-5"
    style={{ background: "var(--cpp-surface)", borderTop: "1px solid var(--cpp-border)" }}
  >
    <div className="container">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="fw-bold d-flex align-items-center gap-2 mb-2 fs-5">
            <span className="text-primary">
              <FaGraduationCap />
            </span>
            Placement<span className="text-primary">Portal</span>
          </div>
          <p className="text-muted-cpp small">
            Connecting talented students with top recruiters. A modern platform
            for campus placements and career growth.
          </p>
        </div>
        <div className="col-md-2">
          <h6 className="fw-bold">Quick Links</h6>
          <ul className="list-unstyled small">
            <li><Link to="/" className="text-muted-cpp">Home</Link></li>
            <li><Link to="/jobs" className="text-muted-cpp">Jobs</Link></li>
            <li><Link to="/companies" className="text-muted-cpp">Companies</Link></li>
            <li><Link to="/about" className="text-muted-cpp">About</Link></li>
          </ul>
        </div>
        <div className="col-md-3">
          <h6 className="fw-bold">For Users</h6>
          <ul className="list-unstyled small">
            <li><Link to="/signup" className="text-muted-cpp">Student Signup</Link></li>
            <li><Link to="/signup" className="text-muted-cpp">Recruiter Signup</Link></li>
            <li><Link to="/login" className="text-muted-cpp">Login</Link></li>
            <li><Link to="/contact" className="text-muted-cpp">Contact</Link></li>
          </ul>
        </div>
        <div className="col-md-3">
          <h6 className="fw-bold">Contact</h6>
          <ul className="list-unstyled small text-muted-cpp">
            <li className="d-flex gap-2"><FaMapMarkerAlt /> College Campus, India</li>
            <li className="d-flex gap-2"><FaEnvelope /> placements@college.edu</li>
            <li className="d-flex gap-2"><FaPhone /> +91 90000 00000</li>
          </ul>
        </div>
      </div>
      <hr style={{ borderColor: "var(--cpp-border)" }} />
      <div className="text-center small text-muted-cpp">
        © {new Date().getFullYear()} College Placement Portal. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFound = () => (
  <div
    className="d-flex flex-column align-items-center justify-content-center text-center py-5"
    style={{ minHeight: "70vh" }}
  >
    <h1 className="display-1 fw-bold gradient-text">404</h1>
    <h3 className="fw-bold">Page Not Found</h3>
    <p className="text-muted-cpp">
      The page you are looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="btn btn-primary">
      <FaHome className="me-2" /> Back to Home
    </Link>
  </div>
);

export default NotFound;

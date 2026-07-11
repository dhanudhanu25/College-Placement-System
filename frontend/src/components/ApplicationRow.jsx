import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaUserGraduate, FaBriefcase, FaCalendarAlt, FaClock } from "react-icons/fa";
import { statusBadge, fileUrl, formatDate } from "../utils/format";

const ApplicationRow = ({ app, onWithdraw, onView, withdrawing }) => {
  const student = app.student || {};
  const job = app.job || {};
  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-2">
          {student.profileImage ? (
            <img
              src={fileUrl(student.profileImage)}
              width={36}
              height={36}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              alt=""
            />
          ) : (
            <div className="avatar" style={{ width: 36, height: 36 }}>
              {student.name?.charAt(0) || "S"}
            </div>
          )}
          <div>
            <div className="fw-semibold">{student.name || "Student"}</div>
            <div className="small text-muted-cpp">{student.email}</div>
          </div>
        </div>
      </td>
      <td>
        <Link to={`/jobs/${job._id}`} className="text-decoration-none">
          {job.title || "Job"}
        </Link>
        <div className="small text-muted-cpp">{app.company?.companyName}</div>
      </td>
      <td>
        <span className={`badge bg-${statusBadge(app.status)}-subtle text-${statusBadge(app.status)}`}>
          {app.status}
        </span>
      </td>
      <td className="small text-muted-cpp">{formatDate(app.appliedDate)}</td>
      <td>
        <div className="btn-group btn-group-sm">
          <button className="btn btn-outline-secondary" onClick={() => onView && onView(app)}>
            View
          </button>
          {onWithdraw && (
            <button
              className="btn btn-outline-danger"
              disabled={withdrawing}
              onClick={() => onWithdraw(app)}
            >
              {withdrawing ? "..." : "Withdraw"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ApplicationRow;

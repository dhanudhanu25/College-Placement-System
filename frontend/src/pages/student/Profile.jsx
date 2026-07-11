import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fileUrl } from "../../utils/format";
import { FaEnvelope, FaPhone, FaIdCard, FaFileAlt, FaEdit, FaStar } from "react-icons/fa";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="card p-4 mb-4">
        <div className="d-flex align-items-center gap-3">
          {user?.profileImage ? (
            <img
              src={fileUrl(user.profileImage)}
              width={90}
              height={90}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              alt=""
            />
          ) : (
            <div className="avatar" style={{ width: 90, height: 90, fontSize: 36 }}>
              {user?.name?.charAt(0)}
            </div>
          )}
          <div className="flex-fill">
            <h3 className="fw-bold mb-0">{user?.name}</h3>
            <div className="text-muted-cpp">
              <FaIdCard className="me-1" />
              {user?.department || "Department not set"} · Student
            </div>
            <span className="badge bg-primary-subtle text-primary mt-1">
              CGPA: {user?.cgpa || "—"}
            </span>
          </div>
          <Link to="/student/profile/edit" className="btn btn-primary">
            <FaEdit className="me-1" /> Edit
          </Link>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card p-3">
            <h6 className="fw-bold">Contact</h6>
            <div className="small d-flex align-items-center gap-2 mb-2">
              <FaEnvelope className="text-primary" /> {user?.email}
            </div>
            <div className="small d-flex align-items-center gap-2">
              <FaPhone className="text-primary" /> {user?.phone || "Not provided"}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3">
            <h6 className="fw-bold">Resume</h6>
            {user?.resume ? (
              <a
                href={fileUrl(user.resume)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-primary"
              >
                <FaFileAlt className="me-1" /> View / Download
              </a>
            ) : (
              <div>
                <p className="small text-muted-cpp mb-2">No resume uploaded.</p>
                <Link to="/student/resume" className="btn btn-sm btn-primary">
                  Upload Resume
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="col-12">
          <div className="card p-3">
            <h6 className="fw-bold d-flex align-items-center gap-2">
              <FaStar className="text-warning" /> Skills
            </h6>
            <div>
              {(user?.skills || []).length ? (
                user.skills.map((s, i) => (
                  <span key={i} className="pill me-2 mb-2">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-muted-cpp small">No skills added.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

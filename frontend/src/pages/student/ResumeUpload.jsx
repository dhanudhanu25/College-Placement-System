import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import { FaUpload, FaFileAlt } from "react-icons/fa";
import { fileUrl } from "../../utils/format";

const ResumeUpload = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!resume && !profileImage) {
      toast.warn("Please select a file to upload.");
      return;
    }
    setSaving(true);
    try {
      const res = await authService.updateProfile({}, { resume, profileImage });
      setUser(res.data.user);
      toast.success("Upload successful!");
      navigate("/student/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h4 className="section-title mb-3">Resume & Profile Picture</h4>
      <div className="card p-4">
        {user?.resume && (
          <div className="alert alert-light d-flex align-items-center gap-2 mb-3">
            <FaFileAlt /> Current resume:{" "}
            <a href={fileUrl(user.resume)} target="_blank" rel="noreferrer">
              View
            </a>
          </div>
        )}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="small fw-semibold">Upload Resume (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              className="form-control"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </div>
          <div className="mb-3">
            <label className="small fw-semibold">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </div>
          <button className="btn btn-primary" disabled={saving}>
            <FaUpload className="me-2" /> {saving ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeUpload;

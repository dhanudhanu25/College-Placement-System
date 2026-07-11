import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import ThemeToggle from "../../components/ThemeToggle";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa";

const Settings = () => {
  const { user } = useAuth();
  const [pw, setPw] = useState({ password: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  const changePassword = async (e) => {
    e.preventDefault();
    if (pw.password !== pw.confirm) {
      return toast.warn("Passwords do not match.");
    }
    if (pw.password.length < 6) {
      return toast.warn("Password must be at least 6 characters.");
    }
    setSaving(true);
    try {
      await authService.updateProfile({ password: pw.password });
      toast.success("Password updated.");
      setPw({ password: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h4 className="section-title mb-3">Settings</h4>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card p-3">
            <h6 className="fw-bold">Appearance</h6>
            <p className="small text-muted-cpp">
              Toggle between light and dark mode.
            </p>
            <div className="d-flex align-items-center gap-2">
              <ThemeToggle /> <span className="small">Dark mode</span>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            <h6 className="fw-bold">Account</h6>
            <p className="small text-muted-cpp mb-1">
              Email: <strong>{user?.email}</strong>
            </p>
            <p className="small text-muted-cpp mb-0">
              Role: <strong className="text-capitalize">{user?.role}</strong>
            </p>
          </div>
        </div>

        <div className="col-12">
          <div className="card p-3">
            <h6 className="fw-bold">
              <FaLock className="me-1 text-primary" /> Change Password
            </h6>
            <form onSubmit={changePassword} className="row g-3 mt-1">
              <div className="col-md-5">
                <input
                  type="password"
                  className="form-control"
                  placeholder="New password"
                  value={pw.password}
                  onChange={(e) => setPw({ ...pw, password: e.target.value })}
                />
              </div>
              <div className="col-md-5">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm password"
                  value={pw.confirm}
                  onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100" disabled={saving}>
                  {saving ? "..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGraduationCap } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const dashboards = {
    student: "/student/dashboard",
    recruiter: "/company/dashboard",
    admin: "/admin/dashboard",
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form.email, form.password, form.remember);
      if (res.success) {
        const role = res.user.role;
        toast.success(`Welcome back, ${res.user.name}!`);
        navigate(dashboards[role] || "/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5"
      style={{ minHeight: "80vh" }}
    >
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: 420 }}>
        <div className="text-center mb-3">
          <div className="text-primary fs-1">
            <FaGraduationCap />
          </div>
          <h4 className="fw-bold">Welcome Back</h4>
          <p className="text-muted-cpp small">Login to your placement account</p>
        </div>

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="small fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input
                type="email"
                required
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="small fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                type={showPw ? "text" : "password"}
                required
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="input-group-text"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="remember"
                checked={form.remember}
                onChange={(e) => setForm({ ...form, remember: e.target.checked })}
              />
              <label className="form-check-label small" htmlFor="remember">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="small text-decoration-none">
              Forgot password?
            </Link>
          </div>

          <button className="btn btn-primary w-100" disabled={loading} type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3 small text-muted-cpp">
          Don't have an account?{" "}
          <Link to="/signup" className="text-decoration-none">Sign up</Link>
        </div>

        <div className="alert alert-light mt-3 small mb-0">
          <strong>Demo Accounts:</strong>
          <br />
          Admin: admin@gmail.com / Admin@123
          <br />
          Company: company@gmail.com / Company@123
          <br />
          Student: student@gmail.com / Student@123
        </div>
      </div>
    </div>
  );
};

export default Login;

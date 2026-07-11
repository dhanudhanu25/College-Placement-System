import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setResult(res.data);
      toast.success("If the email exists, a reset token was generated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 d-flex justify-content-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: 440 }}>
        <button className="btn btn-link ps-0 mb-2" onClick={() => window.history.back()}>
          <FaArrowLeft /> Back
        </button>
        <h4 className="fw-bold">Forgot Password</h4>
        <p className="text-muted-cpp small">
          Enter your email and we'll generate a password reset token.
        </p>

        <form onSubmit={submit}>
          <div className="input-group mb-3">
            <span className="input-group-text"><FaEnvelope /></span>
            <input
              type="email"
              required
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Processing..." : "Send Reset Link"}
          </button>
        </form>

        {result?.resetToken && (
          <div className="alert alert-info mt-3 small">
            <strong>Demo Mode:</strong> Use this token to reset:
            <div className="fw-bold mt-1">{result.resetToken}</div>
            <Link to="/login" className="small">Return to login</Link>
          </div>
        )}

        <div className="text-center mt-3 small">
          <Link to="/login" className="text-decoration-none">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

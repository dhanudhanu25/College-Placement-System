import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FaUserGraduate, FaBuilding, FaUpload, FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState("student");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    cgpa: "",
    skills: "",
    companyName: "",
    companyEmail: "",
    website: "",
    location: "",
    industry: "",
    description: "",
  });
  const [resume, setResume] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      fd.append("role", role);
      if (resume) fd.append("resume", resume);
      if (profileImage) fd.append("profileImage", profileImage);

      const res = await register(fd);
      if (res.success) {
        toast.success("Account created! Welcome aboard.");
        const dashboards = {
          student: "/student/dashboard",
          recruiter: "/company/dashboard",
          admin: "/admin/dashboard",
        };
        navigate(dashboards[res.user.role] || "/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card p-4 shadow">
              <h4 className="fw-bold text-center mb-1">Create Your Account</h4>
              <p className="text-muted-cpp text-center small mb-3">
                Join the placement portal as a Student or Company Recruiter
              </p>

              {/* Role toggle */}
              <div className="btn-group w-100 mb-4" role="group">
                <button
                  type="button"
                  className={`btn ${role === "student" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setRole("student")}
                >
                  <FaUserGraduate className="me-1" /> Student
                </button>
                <button
                  type="button"
                  className={`btn ${role === "recruiter" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setRole("recruiter")}
                >
                  <FaBuilding className="me-1" /> Recruiter
                </button>
              </div>

              <form onSubmit={submit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="small fw-semibold">Full Name *</label>
                    <input required className="form-control" value={form.name} onChange={set("name")} />
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-semibold">Email *</label>
                    <input required type="email" className="form-control" value={form.email} onChange={set("email")} />
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-semibold">Phone</label>
                    <input className="form-control" value={form.phone} onChange={set("phone")} />
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-semibold">Password *</label>
                    <div className="input-group">
                      <input
                        required
                        type={showPw ? "text" : "password"}
                        className="form-control"
                        value={form.password}
                        onChange={set("password")}
                      />
                      <button type="button" className="input-group-text" onClick={() => setShowPw(!showPw)}>
                        {showPw ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {role === "student" ? (
                    <>
                      <div className="col-md-4">
                        <label className="small fw-semibold">Department</label>
                        <input className="form-control" value={form.department} onChange={set("department")} />
                      </div>
                      <div className="col-md-4">
                        <label className="small fw-semibold">CGPA</label>
                        <input type="number" step="0.01" min="0" max="10" className="form-control" value={form.cgpa} onChange={set("cgpa")} />
                      </div>
                      <div className="col-md-4">
                        <label className="small fw-semibold">Skills (comma separated)</label>
                        <input className="form-control" placeholder="React, Node" value={form.skills} onChange={set("skills")} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-md-6">
                        <label className="small fw-semibold">Company Name *</label>
                        <input required className="form-control" value={form.companyName} onChange={set("companyName")} />
                      </div>
                      <div className="col-md-6">
                        <label className="small fw-semibold">Company Email</label>
                        <input type="email" className="form-control" value={form.companyEmail} onChange={set("companyEmail")} />
                      </div>
                      <div className="col-md-4">
                        <label className="small fw-semibold">Website</label>
                        <input className="form-control" value={form.website} onChange={set("website")} />
                      </div>
                      <div className="col-md-4">
                        <label className="small fw-semibold">Location</label>
                        <input className="form-control" value={form.location} onChange={set("location")} />
                      </div>
                      <div className="col-md-4">
                        <label className="small fw-semibold">Industry</label>
                        <input className="form-control" value={form.industry} onChange={set("industry")} />
                      </div>
                      <div className="col-12">
                        <label className="small fw-semibold">Description</label>
                        <textarea className="form-control" rows={2} value={form.description} onChange={set("description")} />
                      </div>
                    </>
                  )}

                  {role === "student" && (
                    <div className="col-md-6">
                      <label className="small fw-semibold">Resume (PDF)</label>
                      <input type="file" accept="application/pdf" className="form-control" onChange={(e) => setResume(e.target.files[0])} />
                    </div>
                  )}
                  <div className="col-md-6">
                    <label className="small fw-semibold">Profile Picture</label>
                    <input type="file" accept="image/*" className="form-control" onChange={(e) => setProfileImage(e.target.files[0])} />
                  </div>
                </div>

                <button className="btn btn-primary w-100 mt-4" disabled={loading} type="submit">
                  {loading ? "Creating..." : <><FaUpload className="me-2" /> Create Account</>}
                </button>
              </form>

              <div className="text-center mt-3 small text-muted-cpp">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

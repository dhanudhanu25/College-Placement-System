import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    department: user?.department || "",
    cgpa: user?.cgpa || "",
    skills: (user?.skills || []).join(", "),
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authService.updateProfile({
        ...form,
        cgpa: form.cgpa ? Number(form.cgpa) : 0,
      });
      setUser(res.data.user);
      toast.success("Profile updated!");
      navigate("/student/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h4 className="section-title mb-3">Edit Profile</h4>
      <div className="card p-4">
        <form onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="small fw-semibold">Full Name</label>
              <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="small fw-semibold">Phone</label>
              <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="small fw-semibold">Department</label>
              <input className="form-control" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="small fw-semibold">CGPA</label>
              <input type="number" step="0.01" min="0" max="10" className="form-control" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="small fw-semibold">Skills (comma separated)</label>
              <input className="form-control" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            </div>
          </div>
          <div className="mt-4 d-flex gap-2">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

import { useState, useEffect } from "react";
import { adminService, notificationService } from "../../services/dataService";
import ThemeToggle from "../../components/ThemeToggle";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { FaBell } from "react-icons/fa";

const AdminSettings = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ userId: "", title: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    adminService.users({ role: "student", limit: 100 }).then((res) => setUsers(res.data.users));
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.title || !form.message) {
      return toast.warn("All fields are required.");
    }
    setSending(true);
    try {
      await notificationService.create(form);
      toast.success("Notification sent.");
      setForm({ userId: "", title: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h4 className="section-title mb-3">Settings</h4>
      <div className="row g-3">
        <div className="col-md-5">
          <div className="card p-3">
            <h6 className="fw-bold">Appearance</h6>
            <div className="d-flex align-items-center gap-2">
              <ThemeToggle /> <span className="small">Toggle dark mode</span>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card p-3">
            <h6 className="fw-bold">
              <FaBell className="me-2 text-primary" /> Send Notification
            </h6>
            <form onSubmit={send}>
              <select
                className="form-select mb-2"
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
              >
                <option value="">Select student...</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              <input
                className="form-control mb-2"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                className="form-control mb-2"
                rows={3}
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button className="btn btn-primary btn-sm" disabled={sending}>
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e) => {
    e.preventDefault();
    toast.success("Thank you! Your message has been recorded.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            <h2 className="section-title">Get in Touch</h2>
            <p className="text-muted-cpp">
              Have questions about placements, partnerships or the portal? Our
              team is here to help.
            </p>
            <div className="mt-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="icon text-primary fs-4"><FaMapMarkerAlt /></div>
                <div>
                  <div className="fw-semibold">Address</div>
                  <div className="small text-muted-cpp">College Campus, India</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="icon text-primary fs-4"><FaEnvelope /></div>
                <div>
                  <div className="fw-semibold">Email</div>
                  <div className="small text-muted-cpp">placements@college.edu</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="icon text-primary fs-4"><FaPhone /></div>
                <div>
                  <div className="fw-semibold">Phone</div>
                  <div className="small text-muted-cpp">+91 90000 00000</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card p-4">
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="small fw-semibold">Name</label>
                  <input
                    required
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="small fw-semibold">Email</label>
                  <input
                    required
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="small fw-semibold">Message</label>
                  <textarea
                    required
                    rows={4}
                    className="form-control"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <button className="btn btn-primary w-100" type="submit">
                  <FaPaperPlane className="me-2" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <Link to="/signup" className="btn btn-outline-primary">
            Or create an account →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;

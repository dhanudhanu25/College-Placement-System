import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jobService } from "../../services/dataService";
import { JOB_TYPES } from "../../utils/format";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    salary: "",
    jobType: "Full-time",
    experience: "0-1 years",
    description: "",
    requirements: "",
    deadline: "",
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!user?.company) return toast.warn("No company linked.");
    setSaving(true);
    try {
      await jobService.create({
        ...form,
        company: user.company,
        requirements: form.requirements,
        deadline: form.deadline || undefined,
      });
      toast.success("Job posted! Awaiting admin approval.");
      navigate("/company/jobs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h4 className="section-title mb-3">
        <FaPlus className="me-2 text-primary" /> Post a New Job
      </h4>
      <div className="card p-4">
        <form onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-8">
              <label className="small fw-semibold">Job Title *</label>
              <input required className="form-control" value={form.title} onChange={set("title")} />
            </div>
            <div className="col-md-4">
              <label className="small fw-semibold">Job Type</label>
              <select className="form-select" value={form.jobType} onChange={set("jobType")}>
                {JOB_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="small fw-semibold">Location</label>
              <input className="form-control" value={form.location} onChange={set("location")} />
            </div>
            <div className="col-md-4">
              <label className="small fw-semibold">Salary</label>
              <input className="form-control" placeholder="e.g. ₹6 LPA" value={form.salary} onChange={set("salary")} />
            </div>
            <div className="col-md-4">
              <label className="small fw-semibold">Experience</label>
              <select className="form-select" value={form.experience} onChange={set("experience")}>
                {["0-1 years", "1-2 years", "2-3 years", "3-5 years"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="small fw-semibold">Description</label>
              <textarea className="form-control" rows={4} value={form.description} onChange={set("description")} />
            </div>
            <div className="col-md-8">
              <label className="small fw-semibold">Requirements (comma separated)</label>
              <input className="form-control" placeholder="React, Node, SQL" value={form.requirements} onChange={set("requirements")} />
            </div>
            <div className="col-md-4">
              <label className="small fw-semibold">Deadline</label>
              <input type="date" className="form-control" value={form.deadline} onChange={set("deadline")} />
            </div>
          </div>
          <button className="btn btn-primary mt-3" disabled={saving}>
            {saving ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;

import { useState, useEffect } from "react";
import { applicationService } from "../../services/dataService";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { fileUrl, formatDate, formatDateTime, statusBadge } from "../../utils/format";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaUserGraduate } from "react-icons/fa";

const ScheduleInterviews = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({});

  const load = () => {
    setLoading(true);
    applicationService
      .getAll({ limit: 100 })
      .then((res) =>
        setApps(
          res.data.applications.filter((a) =>
            ["Under Review", "Shortlisted", "Interview Scheduled"].includes(a.status)
          )
        )
      )
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const schedule = async (id) => {
    const interviewDate = dates[id];
    if (!interviewDate) return toast.warn("Pick a date first.");
    try {
      await applicationService.update(id, {
        status: "Interview Scheduled",
        interviewDate,
      });
      toast.success("Interview scheduled.");
      load();
    } catch (e) {
      toast.error("Failed.");
    }
  };

  if (loading) return <Spinner fullScreen />;

  return (
    <div>
      <h4 className="section-title mb-3">
        <FaCalendarAlt className="me-2 text-primary" /> Schedule Interviews
      </h4>

      {apps.length === 0 ? (
        <EmptyState title="No candidates to schedule" message="Shortlist candidates from View Applicants first." />
      ) : (
        <div className="row g-3">
          {apps.map((a) => (
            <div className="col-md-6" key={a._id}>
              <div className="card p-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  {a.student?.profileImage ? (
                    <img src={fileUrl(a.student.profileImage)} width={40} height={40} style={{ borderRadius: "50%", objectFit: "cover" }} alt="" />
                  ) : (
                    <div className="avatar" style={{ width: 40, height: 40 }}><FaUserGraduate /></div>
                  )}
                  <div>
                    <div className="fw-semibold">{a.student?.name}</div>
                    <div className="small text-muted-cpp">{a.job?.title}</div>
                  </div>
                  <span className={`badge bg-${statusBadge(a.status)}-subtle text-${statusBadge(a.status)} ms-auto`}>
                    {a.status}
                  </span>
                </div>

                {a.interviewDate && (
                  <div className="small text-success mb-2">
                    Scheduled: {formatDateTime(a.interviewDate)}
                  </div>
                )}

                <div className="input-group input-group-sm">
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={dates[a._id] || ""}
                    onChange={(e) => setDates({ ...dates, [a._id]: e.target.value })}
                  />
                  <button className="btn btn-primary" onClick={() => schedule(a._id)}>
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleInterviews;

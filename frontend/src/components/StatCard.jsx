import { fileUrl } from "../utils/format";

const StatCard = ({ icon, title, value, color = "#4f46e5", subtitle }) => (
  <div className="stat-card d-flex align-items-center gap-3 fade-up">
    <div className="icon" style={{ background: color }}>
      {icon}
    </div>
    <div>
      <div className="text-muted-cpp small fw-semibold text-uppercase">
        {title}
      </div>
      <div className="h3 mb-0 fw-bold">{value}</div>
      {subtitle && <div className="small text-muted-cpp">{subtitle}</div>}
    </div>
  </div>
);

export default StatCard;

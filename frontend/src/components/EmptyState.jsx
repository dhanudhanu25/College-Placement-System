import { FaInbox } from "react-icons/fa";

const EmptyState = ({ title = "Nothing here yet", message, action }) => (
  <div
    className="text-center py-5"
    style={{ background: "var(--cpp-surface)", borderRadius: 14, border: "1px solid var(--cpp-border)" }}
  >
    <div className="text-primary mb-3" style={{ fontSize: 40 }}>
      <FaInbox />
    </div>
    <h5 className="fw-bold">{title}</h5>
    {message && <p className="text-muted-cpp small">{message}</p>}
    {action}
  </div>
);

export default EmptyState;

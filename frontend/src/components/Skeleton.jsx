const SkeletonCard = ({ lines = 3, height = 180 }) => (
  <div className="card p-3" style={{ height }}>
    <div className="skeleton mb-2" style={{ height: 20, width: "60%" }} />
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton mb-2"
        style={{ height: 12, width: `${100 - i * 12}%` }}
      />
    ))}
  </div>
);

const SkeletonTable = ({ rows = 5 }) => (
  <div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton mb-2" style={{ height: 40, width: "100%" }} />
    ))}
  </div>
);

export { SkeletonCard, SkeletonTable };

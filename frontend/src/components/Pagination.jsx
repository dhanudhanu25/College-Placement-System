const Pagination = ({ page, pages, onPageChange }) => {
  if (!pages || pages <= 1) return null;

  const getItems = () => {
    const items = [];
    const max = 5;
    let start = Math.max(1, page - Math.floor(max / 2));
    let end = Math.min(pages, start + max - 1);
    start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) items.push(i);
    return items;
  };

  return (
    <nav>
      <ul className="pagination justify-content-center mb-0">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
        </li>
        {getItems().map((i) => (
          <li key={i} className={`page-item ${i === page ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(i)}>
              {i}
            </button>
          </li>
        ))}
        <li className={`page-item ${page === pages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(page + 1)}
            disabled={page === pages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

import { useState } from "react";

const SearchBar = ({ onSearch, placeholder = "Search...", className = "" }) => {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={submit} className={`d-flex gap-2 ${className}`}>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="btn btn-primary" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchBar;

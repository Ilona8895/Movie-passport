import { useState } from "react";

export function Search({ onSearchMovie }) {
  const [query, setQuery] = useState("");

  function handleOnChange(query) {
    setQuery(query);
    onSearchMovie(query);
  }

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => handleOnChange(e.target.value)}
    />
  );
}

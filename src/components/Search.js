import { useRef, useState } from "react";
import { useKey } from "./useKey";

export function Search({ onSearchMovie }) {
  const [query, setQuery] = useState("");

  function handleOnChange(query) {
    setQuery(query);
    onSearchMovie(query);
  }

  const inputElement = useRef(null);

  useKey("Enter", function () {
    inputElement.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => handleOnChange(e.target.value)}
      ref={inputElement}
    />
  );
}

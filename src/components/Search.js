import { useRef, useState } from "react";
import { useKey } from "../hooks/useKey";
import { useMovies } from "../contexts/MoviesContext";

export function Search() {
  const [query, setQuery] = useState("");

  const { searchMovie } = useMovies();

  function handleOnChange(query) {
    setQuery(query);
    searchMovie(query);
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

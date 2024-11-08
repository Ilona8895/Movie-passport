import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { KEY } from "../components/App";

const MoviesContext = createContext();

function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorage([], "watched");

  function selectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function closeMovie() {
    setSelectedId(null);
  }

  function addWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function deleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  function searchMovie(query) {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    closeMovie();
    fetchMovies();

    return function () {
      controller.abort();
    };
  }

  return (
    <MoviesContext.Provider
      value={{
        movies,
        isLoading,
        error,
        selectedId,
        watched,
        selectMovie,
        addWatched,
        deleteWatched,
        searchMovie,
        closeMovie,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
}

function useMovies() {
  const context = useContext(MoviesContext);
  if (context === undefined)
    throw new Error("MoviesContext was used outside the MoviesProvider");
  return context;
}

export { MoviesProvider, useMovies };

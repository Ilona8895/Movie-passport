import { useState, useEffect } from "react";
import { KEY } from "./App";
import { ErrorMessage } from "./ErrorMessage";
import { Loader } from "./Loader";
import StarRating from "./StarRating";
import { useKey } from "../hooks/useKey";
import { useMovies } from "../contexts/MoviesContext";

export function MovieDetails() {
  const { selectedId, closeMovie, addWatched, watched } = useMovies();
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState("");

  const isMovieWatched = watched
    .map((movie) => movie.imdbID)
    .includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    addWatched(newWatchedMovie);
    closeMovie();
  }

  useKey("Escape", closeMovie);

  useEffect(
    function () {
      if (!title) return;
      document.title = title;

      return function () {
        document.title = "MoviePassport";
      };
    },
    [title]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setMovie({});
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          const data = await res.json();
          if (data.Response === "False") throw new Error("Wrong film ID");

          setMovie(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedId]
  );

  return (
    <div className="details">
      {error && <ErrorMessage message={error} />}
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={closeMovie}>
              &larr;
            </button>
            <img src={poster} alt={`${movie} poster`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isMovieWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to list
                    </button>
                  )}{" "}
                </>
              ) : (
                <p>You rated movie {watchedUserRating}</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

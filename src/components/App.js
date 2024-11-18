import { Loader } from "./Loader.js";
import { ErrorMessage } from "./ErrorMessage.js";
import { NavBar } from "./NavBar.js";
import { Logo } from "./Logo.js";
import { Search } from "./Search.js";
import { NumResults } from "./NumResults.js";
import { Main } from "./Main.js";
import { Box } from "./Box.js";
import { MovieList } from "./MovieList.js";
import { MovieDetails } from "./MovieDetails.js";
import { WatchedSummary } from "./WatchedSummary.js";
import { WatchedMovieList } from "./WatchedMovieList.js";
import { useMovies } from "../contexts/MoviesContext.js";

export const KEY = "35813d51";

export default function App() {
  const { isLoading, error, selectedId } = useMovies();
  return (
    <>
      <NavBar>
        <Logo />
        <Search />
        <NumResults />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails />
          ) : (
            <>
              <WatchedSummary />
              <WatchedMovieList />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

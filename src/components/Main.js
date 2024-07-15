import React, { useEffect } from "react";
import { useState } from "react";
import StarRating from "./StarRating";

const average = (arr) => {
  const validValues = arr.filter(
    (value) => value !== undefined && value !== null && !isNaN(value)
  );
  if (validValues.length === 0) return 0;
  const avg =
    validValues.reduce((acc, cur) => acc + cur, 0) / validValues.length;
  return avg.toFixed(1);
};

function ListBox({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}
function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Moive key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}
function Moive({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, handleDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMoive
          key={movie.imdbID}
          movie={movie}
          handleDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
function WatchedMoive({ movie, handleDelete }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          className="btn-delete"
          onClick={() => {
            handleDelete(movie);
          }}
        >
          <i className="fa-solid fa-minus"></i>
        </button>
      </div>
    </li>
  );
}
function Loader() {
  return (
    <p className="loader">
      Loading...
      <i className="fa-solid fa-gear"></i>
    </p>
  );
}

function ErrorMessage({ error }) {
  return <p className="error">{error}</p>;
}
function MovieDetails({ selectedID, onBackClick, onAddClick, watched }) {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  // const [isRated, setIsRated] = useState(false);
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
  const isWatched = watched.some((movie) => movie.imdbID === selectedID);
  const KEY = "97e42653";
  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
          );
          if (!res.ok) {
            throw new Error(
              "Something went wrong with fetching movie's details"
            );
          }
          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("Details not found");
          }
          setMovie(data);
        } catch (err) {
          console.error(err.message);
        } finally {
          setLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedID]
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie: ${title}`;

      return function () {
        document.title = "MovieExplorer";
      };
    },
    [title]
  );

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onBackClick();
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onBackClick]
  );
  return (
    <div className="details">
      {loading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={() => onBackClick()}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    key={movie.imdbID}
                    maxRating={10}
                    setUserRating={setUserRating}
                  />
                  {userRating && (
                    <button
                      className="btn-add"
                      onClick={() => {
                        const newAddMovie = {
                          imdbID: selectedID,
                          title,
                          year,
                          poster,
                          imdbRating: Number(imdbRating),
                          runtime: Number(runtime.split(" ").at(0)),
                          userRating: userRating,
                        };
                        onAddClick(newAddMovie);
                        onBackClick();
                      }}
                    >
                      + ADD
                    </button>
                  )}
                </>
              ) : (
                <p>You have rated this movie</p>
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
export default function Main({
  movies,
  watched,
  loading,
  error,
  selectedID,
  onSelectMovie,
  onBackClick,
  handleAddWatched,
  handleDelete,
}) {
  return (
    <main className="main">
      <ListBox>
        {loading && !error && <Loader />}
        {!loading && !error && (
          <MovieList movies={movies} onSelectMovie={onSelectMovie} />
        )}
        {error && <ErrorMessage error={error} />}
      </ListBox>

      <ListBox>
        {selectedID ? (
          <MovieDetails
            selectedID={selectedID}
            onBackClick={onBackClick}
            onAddClick={handleAddWatched}
            watched={watched}
          />
        ) : (
          <>
            <WatchedSummary watched={watched} />
            <WatchedMovieList watched={watched} handleDelete={handleDelete} />
          </>
        )}
      </ListBox>
    </main>
  );
}

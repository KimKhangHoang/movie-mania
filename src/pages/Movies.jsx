import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchPopularMovies, fetchMovieQuery } from '../components/api';
import MovieCard from '../components/MovieCard';

const SEARCH_DELAY_MS = 400; // how long to wait after the last keystroke before searching

function Movies({ wishList, watchedMovies, onAddToWishList, onAddToWatchedMovies }) {
  const [searchParams, setSearchParams] = useSearchParams(); // the search lives in the URL (?q=...) so it survives navigation
  const query = searchParams.get('q') ?? ''; // the search currently applied
  const [inputValue, setInputValue] = useState(query); // what is typed in the search bar, updated on every keystroke
  const [lastQuery, setLastQuery] = useState(query); // the query seen on the previous render
  const [movies, setMovies] = useState([]); // a state to store the movies to show
  const [loading, setLoading] = useState(true); // a state to track loading status
  const [error, setError] = useState(null); // a state for error detection

  useEffect(() => {
    // apply the search once typing pauses, instead of sending a request on every keystroke
    const trimmed = inputValue.trim();
    if (trimmed === query) return;

    const timer = setTimeout(() => {
      setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true }); // replace, so each search doesn't add a history entry
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer); // a new keystroke cancels the pending search
  }, [inputValue, query, setSearchParams]);

  // keep the search bar in step when the URL changes elsewhere, e.g. the Movies link or the back button
  if (query !== lastQuery) {
    setLastQuery(query);
    if (inputValue.trim() !== query) setInputValue(query);
  }

  useEffect(() => {
    let ignore = false; // set when a newer search starts, so a slower older response can't overwrite its results

    const getMovies = async () => {
      // an async function to fetch and store movies
      setLoading(true);
      setError(null); // clear any previous errors

      try {
        const results = query ? await fetchMovieQuery(query) : await fetchPopularMovies();
        if (!ignore) setMovies(results); // store movies
      } catch (error) {
        if (!ignore) setError("Couldn't load movies. Please try again.");
        console.error('Error in movies page: ', error);
      } finally {
        if (!ignore) setLoading(false); // set loading status to false once movies are fetched
      }
    };

    getMovies(); // call the predefined async function
    return () => {
      ignore = true;
    };
  }, [query]);

  const handleSearch = (event) => {
    // handle search query changes
    setInputValue(event.target.value);
  };

  // decide what to show under the heading, keeping the search bar on screen in every case
  let content;
  if (loading) {
    content = (
      <div className="loading">
        Loading<span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </div>
    );
  } else if (error) {
    content = <div className="error">{error}</div>;
  } else if (movies.length === 0) {
    content = <p>{query ? `No movies found for "${query}".` : 'No movies to show right now.'}</p>;
  } else {
    content = (
      <div className="d-flex flex-wrap justify-content-center">
        {movies.map((movie) => {
          // render a MovieCard for each movie
          const isAddedToWishList = wishList.some((wish) => wish.id === movie.id); // check if the movie is already in the wish list
          const isAddedToWatchedMovies = watchedMovies.some((watched) => watched.id === movie.id); // check if the movie is already in the watched movies

          return (
            <MovieCard
              key={movie.id}
              movie={movie}
              onWishButtonClick={onAddToWishList} // pass the addToWishList function down to each movie card
              wishButtonLabel={isAddedToWishList ? 'Added to wish list' : 'Add to wish list'} // pass the button label based on condition
              onWatchedButtonClick={onAddToWatchedMovies} // pass the addToWatchedMovies function down to each movie card
              watchedButtonLabel={isAddedToWatchedMovies ? 'Added to watched movies' : 'Add to watched movies'} // pass the button label based on condition
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="movies-page">
      {/* Search bar */}
      <div className="search-bar-container">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          className="search-bar"
          placeholder="Search movies..."
          value={inputValue}
          onChange={handleSearch}
        />
      </div>

      <h1>Movies</h1>
      {content}
    </div>
  );
}

export default Movies;

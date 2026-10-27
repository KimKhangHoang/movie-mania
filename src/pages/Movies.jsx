import React, { useEffect, useState } from 'react';
import { fetchPopularMovies, fetchMovieQuery } from '../components/api';
import MovieCard from '../components/MovieCard';

function Movies({ wishList, watchedMovies, onAddToWishList, onAddToWatchedMovies }) {
  const [movies, setMovies] = useState([]); // a state to store popular movies
  const [searchQuery, setSearchQuery] = useState(''); // a state to store query movies 
  const [loading, setLoading] = useState(false); // a state to track loading status
  const [error, setError] = useState(null); // a state for error detection

  useEffect(() => {
    const getMovies = async () => { // an async function to fetch and store movies
      setError(null); // clear any previous errors
      
      try {
        if (searchQuery) {
          const results = await fetchMovieQuery(searchQuery);
          setMovies(results); // store movies
          //console.log(results);
        } else {
          const popularMovies = await fetchPopularMovies();
          setMovies(popularMovies);
        }
      } catch (error) {
        setError("Failed to search movies.");
        console.error('Error in movies page: ', error);
      } finally {
        setLoading(false); // set loading status to false once movies are fetched
      }
    };

    getMovies(); // call the predefined async function
  }, [searchQuery]);

  if (loading) return ( // show a loading message while fetching
    <div className="loading">
      Loading<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
    </div>);
  if (error) return <div className="error">{error}</div>; // show a message when an error occurs

  const handleSearch = (event) => { // handle search query changes
    setSearchQuery(event.target.value);
  };

  return (
    <div className="movies-page">
      {/* Search bar */}
      <div className="search-bar-container">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          className="search-bar"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <h1>Movies</h1>
      <div className="d-flex flex-wrap justify-content-center">
        {movies.map((movie) => { // render a MovieCard for each movie
          const isAddedToWishList = wishList.some((wish) => wish.id === movie.id); // check if the movie is already in the wish list
          const isAddedToWatchedMovies = watchedMovies.some((watched) => watched.id === movie.id); // check if the movie is already in the watched movies
          
          return ( 
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onWishButtonClick={onAddToWishList} // pass the addToWishList function down to each movie card
              wishButtonLabel={isAddedToWishList ? "Added to wish list" : "Add to wish list"} // pass the button label based on condition
              onWatchedButtonClick={onAddToWatchedMovies} // pass the addToWatchedMovies function down to each movie card
              watchedButtonLabel={isAddedToWatchedMovies ? "Added to watched movies" : "Add to watched movies"} // pass the button label based on condition
            /> 
          );
        })}
      </div>
    </div>
  );
}

export default Movies;

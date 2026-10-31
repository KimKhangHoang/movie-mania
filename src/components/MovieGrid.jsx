import React from 'react';
import MovieCard from './MovieCard';

const isInList = (list, movie) => list.some((item) => item.id === movie.id);

// Shows a grid of movie cards, marking which movies are already in each list
const MovieGrid = ({ movies, wishList, watchedMovies, onToggleWishList, onToggleWatched }) => (
  <div className="movie-grid">
    {movies.map((movie) => (
      <MovieCard
        key={movie.id}
        movie={movie}
        isInWishList={isInList(wishList, movie)}
        isWatched={isInList(watchedMovies, movie)}
        onToggleWishList={onToggleWishList}
        onToggleWatched={onToggleWatched}
      />
    ))}
  </div>
);

export default MovieGrid;

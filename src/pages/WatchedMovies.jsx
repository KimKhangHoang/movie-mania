import React from 'react';
import MovieGrid from '../components/MovieGrid';

function WatchedMovies(listProps) {
  const { watchedMovies } = listProps;

  return (
    <div className="watched-movies-page">
      <h1>Watched Movies</h1>
      {watchedMovies.length === 0 ? (
        <p>No movies have been watched yet.</p>
      ) : (
        <MovieGrid movies={watchedMovies} {...listProps} />
      )}
    </div>
  );
}

export default WatchedMovies;

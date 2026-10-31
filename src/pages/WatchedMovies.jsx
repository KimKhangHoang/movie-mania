import React from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import MovieGrid from '../components/MovieGrid';

function WatchedMovies(listProps) {
  const { watchedMovies } = listProps;

  return (
    <div className="page watched-movies-page">
      <h1 className="page-title">Watched movies</h1>
      {watchedMovies.length === 0 ? (
        <EmptyState icon="fa-eye" title="No watched movies yet">
          <p>Keep track of what you&apos;ve seen by tapping Watched on any movie.</p>
          <Link to="/" className="button-link">
            Browse movies
          </Link>
        </EmptyState>
      ) : (
        <MovieGrid movies={watchedMovies} {...listProps} />
      )}
    </div>
  );
}

export default WatchedMovies;

import React from 'react';
import { Link } from 'react-router-dom';
import { formatReleaseDate } from '../utils/formatReleaseDate';

const MovieCard = ({ movie, isInWishList, isWatched, onToggleWishList, onToggleWatched }) => {
  const { id, title, release_date, poster_path } = movie;
  const releaseDate = formatReleaseDate(release_date);

  return (
    <div className="card">
      <Link to={`/movie/${id}`} className="card-link">
        {poster_path ? (
          <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} className="card-img-top" alt={`${title} poster`} />
        ) : (
          // some movies have no poster on TMDB, so show a placeholder instead of a broken image
          <div className="card-img-top poster-placeholder" role="img" aria-label={`No poster available for ${title}`}>
            <i className="fas fa-film"></i>
          </div>
        )}
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{releaseDate ? `Release date: ${releaseDate}` : 'Release date unknown'}</p>
        </div>
      </Link>

      {/* each button adds the movie to its list, or removes it if it's already there */}
      <div className="card-actions">
        <button
          type="button"
          className={isInWishList ? 'btn-added-wish' : 'btn-normal-wish'}
          onClick={() => onToggleWishList(movie)}
        >
          <i className="fas fa-heart btn-icon"></i>
          {isInWishList ? 'Remove from wish list' : 'Add to wish list'}
        </button>

        <button
          type="button"
          className={isWatched ? 'btn-added-watched' : 'btn-normal-watched'}
          onClick={() => onToggleWatched(movie)}
        >
          <i className="fas fa-eye btn-icon"></i>
          {isWatched ? 'Remove from watched movies' : 'Add to watched movies'}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;

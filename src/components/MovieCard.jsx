import React from 'react';
import { Link } from 'react-router-dom';
import { formatReleaseDate } from '../utils/formatReleaseDate';

const MovieCard = ({ movie, isInWishList, isWatched, onToggleWishList, onToggleWatched }) => {
  const { id, title, release_date, poster_path } = movie;
  const releaseDate = formatReleaseDate(release_date);

  return (
    <article className="card">
      <Link to={`/movie/${id}`} className="card-link">
        {poster_path ? (
          <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} className="card-poster" alt="" loading="lazy" />
        ) : (
          // some movies have no poster on TMDB, so show a placeholder instead of a broken image
          <div className="poster-placeholder" aria-hidden="true">
            <i className="fa-solid fa-film"></i>
          </div>
        )}
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="card-text">{releaseDate ?? 'Release date unknown'}</p>
        </div>
      </Link>

      {/* each button adds the movie to its list, or removes it if it's already there */}
      <div className="card-actions">
        <button
          type="button"
          className="toggle-button toggle-wish"
          aria-pressed={isInWishList}
          title={isInWishList ? 'Remove from wish list' : 'Add to wish list'}
          onClick={() => onToggleWishList(movie)}
        >
          <i className={`${isInWishList ? 'fa-solid' : 'fa-regular'} fa-heart`} aria-hidden="true"></i>
          Wish list
        </button>

        <button
          type="button"
          className="toggle-button toggle-watched"
          aria-pressed={isWatched}
          title={isWatched ? 'Remove from watched' : 'Mark as watched'}
          onClick={() => onToggleWatched(movie)}
        >
          <i className={`${isWatched ? 'fa-solid' : 'fa-regular'} fa-eye`} aria-hidden="true"></i>
          Watched
        </button>
      </div>
    </article>
  );
};

export default MovieCard;

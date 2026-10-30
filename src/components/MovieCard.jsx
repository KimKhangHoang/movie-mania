import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, isInWishList, isWatched, onToggleWishList, onToggleWatched }) => {
  const { id, title, release_date, poster_path } = movie;

  return (
    <div className="card">
      <Link to={`/movie/${id}`} className="card-link">
        <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} className="card-img-top" alt={`${title} poster`} />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">Release Date: {release_date}</p>
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

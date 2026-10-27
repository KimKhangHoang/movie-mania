import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, onWishButtonClick, wishButtonLabel, onWatchedButtonClick, watchedButtonLabel }) => {
  const { id, title, release_date, poster_path } = movie;

  return (
    <div className="card">
      <Link to={`/movie/${id}`} className="card-link">
        <img
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          className="card-img-top"
          alt={`${title} poster`}
        />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">Release Date: {release_date}</p>
        </div>
      </Link>

      {/* Button for wish list actions */}
      <button
        className={wishButtonLabel === "Added to wish list" ? "btn-added-wish" : "btn-normal-wish"} // apply btn-added class if added
        onClick={() => onWishButtonClick(movie)}
      >
        <i className="fas fa-heart btn-icon"></i>
        {wishButtonLabel}
      </button>

      {/* Button for watched movies actions */}
      <button
        className={watchedButtonLabel === "Added to watched movies" ? "btn-added-watched" : "btn-normal-watched"} // apply btn-added class if added
        onClick={() => onWatchedButtonClick(movie)}
      >
        <i className="fas fa-eye btn-icon"></i>
        {watchedButtonLabel}
      </button>
    </div>
  );
};

export default MovieCard;

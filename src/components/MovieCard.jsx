import React from 'react';
import { Link } from 'react-router-dom';
import { formatReleaseDate } from '../utils/formatReleaseDate';
import ListToggles from './ListToggles';

const MovieCard = ({ movie, ...toggleProps }) => {
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

      <ListToggles movie={movie} className="card-actions" {...toggleProps} />
    </article>
  );
};

export default MovieCard;

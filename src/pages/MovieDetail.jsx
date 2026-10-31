import React, { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../components/api';
import { useParams } from 'react-router-dom';
import ListToggles from '../components/ListToggles';
import Loading from '../components/Loading';
import { formatReleaseDate } from '../utils/formatReleaseDate';
import { formatRuntime } from '../utils/formatRuntime';
import { isInList } from '../utils/lists';

function MovieDetail({ wishList, watchedMovies, onToggleWishList, onToggleWatched }) {
  const { id } = useParams(); // get the movie ID from the URL
  const [movie, setMovie] = useState(null); // a state to store movie details
  const [loading, setLoading] = useState(true); // a state to track loading status
  const [error, setError] = useState(null); // a state for error detection

  useEffect(() => {
    const getMovieData = async () => {
      // an async function to fetch and store a movie details
      try {
        const movieDetails = await fetchMovieDetails(id); // fetch the movie details from the API

        const trailerData = movieDetails.videos?.results.find(
          // extract trailer info from video data
          (video) => video.type === 'Trailer' && video.site === 'YouTube',
        );

        setMovie({
          // update the state to store movie details
          ...movieDetails, // copy all properties from movieDetails into the new object
          trailer: trailerData ? { key: trailerData.key } : null, // if exist then .key of YouTube videos, if not then null
        });
      } catch (error) {
        setError("Couldn't load this movie. It may not exist, or the connection failed.");
        console.error('Error in movie detail page: ', error);
      } finally {
        setLoading(false); // set loading status to false once movies are fetched
      }
    };

    getMovieData();
  }, [id]);

  if (loading)
    return (
      // show the loading animation while fetching
      <div className="page">
        <Loading />
      </div>
    );
  if (error) return <p className="page status-message error">{error}</p>; // show a message when an error occurs

  const releaseDate = formatReleaseDate(movie.release_date);
  const runtime = formatRuntime(movie.runtime);
  const rating = movie.vote_count > 0 ? movie.vote_average.toFixed(1) : null;

  // only the fields the list pages need, so saved lists stay small
  const savedMovie = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
  };

  return (
    <article className="movie-details">
      {/* the backdrop image sits behind the hero and fades into the page */}
      <section
        className="detail-hero"
        style={
          movie.backdrop_path ? { '--backdrop': `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` } : {}
        }
      >
        <div className="detail-hero-inner">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`Poster for ${movie.title}`}
              className="detail-poster"
            />
          ) : (
            <div className="detail-poster poster-placeholder" aria-hidden="true">
              <i className="fa-solid fa-film"></i>
            </div>
          )}

          <div className="detail-info">
            <h1 className="detail-title">{movie.title}</h1>
            {movie.tagline && <p className="detail-tagline">{movie.tagline}</p>}

            <ul className="detail-meta">
              <li>{releaseDate ?? 'Release date unknown'}</li>
              {runtime && <li>{runtime}</li>}
              {rating && (
                <li>
                  <i className="fa-solid fa-star detail-rating-icon" aria-hidden="true"></i> {rating}
                  <span className="visually-hidden"> out of 10</span>
                </li>
              )}
            </ul>

            {movie.genres.length > 0 && (
              <ul className="genre-list">
                {movie.genres.map((genre) => (
                  <li key={genre.id} className="genre-tag">
                    {genre.name}
                  </li>
                ))}
              </ul>
            )}

            {movie.overview && <p className="detail-overview">{movie.overview}</p>}

            <ListToggles
              movie={savedMovie}
              isInWishList={isInList(wishList, movie)}
              isWatched={isInList(watchedMovies, movie)}
              onToggleWishList={onToggleWishList}
              onToggleWatched={onToggleWatched}
              className="detail-actions"
            />
          </div>
        </div>
      </section>

      {movie.trailer && (
        <section className="page detail-trailer">
          <h2 className="section-title">Trailer</h2>
          <div className="video-frame">
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailer.key}`}
              title={`Trailer for ${movie.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </section>
      )}
    </article>
  );
}

export default MovieDetail;

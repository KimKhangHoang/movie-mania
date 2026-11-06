import React, { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../components/api';
import { useParams } from 'react-router';
import CastList from '../components/CastList';
import ListToggles from '../components/ListToggles';
import Loading from '../components/Loading';
import MovieGrid from '../components/MovieGrid';
import WatchProviders from '../components/WatchProviders';
import useDocumentTitle from '../hooks/useDocumentTitle';
import usePageView from '../hooks/usePageView';
import { formatReleaseDate } from '../utils/formatReleaseDate';
import { formatRuntime } from '../utils/formatRuntime';
import { isInList } from '../utils/lists';

const MAX_CAST = 12; // the top-billed actors, since some movies list 80 or more
const MAX_RECOMMENDATIONS = 10; // fills every row of the grid's 5 columns on desktop and 2 columns on phones

function MovieDetail(listProps) {
  const { wishList, watchedMovies, onToggleWishList, onToggleWatched } = listProps;
  const { id } = useParams(); // get the movie ID from the URL
  const [movie, setMovie] = useState(null); // a state to store movie details
  const [loading, setLoading] = useState(true); // a state to track loading status
  const [error, setError] = useState(null); // a state for error detection

  useEffect(() => {
    let ignore = false; // set when another movie is opened, so a slower older response can't overwrite it
    window.scrollTo(0, 0); // opening a related movie stays on this page, so start the new one from the top

    const getMovieData = async () => {
      // an async function to fetch and store a movie details
      setLoading(true);
      setError(null); // clear any previous errors
      setMovie(null);

      try {
        const movieDetails = await fetchMovieDetails(id); // fetch the movie details from the API
        if (ignore) return;

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
        if (!ignore) setError("Couldn't load this movie. It may not exist, or the connection failed.");
        console.error('Error in movie detail page: ', error);
      } finally {
        if (!ignore) setLoading(false); // set loading status to false once movies are fetched
      }
    };

    getMovieData();
    return () => {
      ignore = true;
    };
  }, [id]);

  useDocumentTitle(movie?.title);
  // counted once this movie loads, so the stats show its name rather than just its ID.
  // The ID check is for the moment after opening a related movie, when the previous movie is still in state.
  usePageView(String(movie?.id) === id ? movie.title : null);

  if (loading)
    return (
      // show the loading animation while fetching
      <div className="page">
        <Loading />
      </div>
    );
  if (error)
    return (
      // show a message when an error occurs
      <p className="page status-message error" role="alert">
        {error}
      </p>
    );

  const releaseDate = formatReleaseDate(movie.release_date);
  const runtime = formatRuntime(movie.runtime);
  const rating = movie.vote_count > 0 ? movie.vote_average.toFixed(1) : null;
  const cast = movie.credits?.cast.slice(0, MAX_CAST) ?? [];
  const recommendations = movie.recommendations?.results.slice(0, MAX_RECOMMENDATIONS) ?? [];

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

      <WatchProviders providers={movie['watch/providers']?.results.AU} />

      {movie.trailer && (
        <section className="page detail-section">
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

      {cast.length > 0 && (
        <section className="page detail-section">
          <h2 className="section-title">Cast</h2>
          <CastList cast={cast} />
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="page detail-section">
          <h2 className="section-title">More like this</h2>
          <MovieGrid movies={recommendations} headingLevel="h3" {...listProps} />
        </section>
      )}
    </article>
  );
}

export default MovieDetail;

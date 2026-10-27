import React, { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../components/api';
import { useParams } from 'react-router-dom';

function MovieDetail () {
   const { id } = useParams(); // get the movie ID from the URL
   const [movie, setMovie] = useState(null); // a state to store movie details
   const [loading, setLoading] = useState(true); // a state to track loading status
   const [error, setError] = useState(null); // a state for error detection


   useEffect(() => {
      const getMovieData = async () => { // an async function to fetch and store a movie details
         try {
            const movieDetails = await fetchMovieDetails(id); // fetch the movie details from the API
            
            const trailerData = movieDetails.videos?.results.find( // extract trailer info from video data
               (video) => video.type === 'Trailer' && video.site === 'YouTube'
            );

            setMovie({ // update the state to store movie details
               ...movieDetails, // copy all properties from movieDetails into the new object
               trailer: trailerData ? { key: trailerData.key } : null, // if exist then .key of YouTube videos, if not then null
            });

            //console.log(movieDetails); // checking object
         } catch (error) {
            setError("Failed to get the movie's details.");
            console.error('Error in movie detail page: ', error);
         } finally {
            setLoading(false); // set loading status to false once movies are fetched
         }
         
      };

      getMovieData();
   }, [id]);

   if (loading) return ( // show a loading message while fetching
      <div className="loading">
        Loading<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
      </div>);
   if (error) return <div className="error">{error}</div>; // show a message when an error occurs

   return (
      <div className="movie-details">
         {/* Backdrop Image */}
         <div className="movie-backdrop" style={{backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`}}>
            <div className="overlay">
               <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`Movie poster of ${movie.title}`}
                  className="movie-poster"
               />
               <h1 className="movie-title">{movie.title}</h1>
            </div>
         </div>

         <div className="movie-details-container">
            {/* Movie Information */}
            <div className="movie-info">
               <p><strong>Release Date:</strong> {movie.release_date}</p>
               <p style={{ textAlign: 'justify'}}><strong>Overview:</strong> {movie.overview}</p>
               <p><strong>Rating:</strong> {movie.vote_average}</p>
               <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
               <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
               {/* Add more details as needed */}
            </div>

            {/* Trailer Section */}
            {movie.trailer && movie.trailer.key && (
               <div className="movie-trailer">
                  <iframe
                     src={`https://www.youtube.com/embed/${movie.trailer.key}`}
                     title={`Trailer for ${movie.title}`}
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     loading="lazy"
                     allowFullScreen
                  />
               </div>
            )}
         </div>
      </div>
   );
};

export default MovieDetail;

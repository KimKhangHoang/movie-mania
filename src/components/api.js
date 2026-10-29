import axios from 'axios';

// All TMDB requests go through our own /api/tmdb proxy, which adds the API key on the server.
// Errors are passed on to the caller, so each page can decide how to show them.
const tmdbGet = (path, params = {}) => axios.get('/api/tmdb', { params: { path, ...params } });

export const fetchPopularMovies = async () => {
  // fetch a list of popular movies
  const response = await tmdbGet('movie/popular');
  return response.data.results; // return the list of movies
};

export const fetchMovieDetails = async (id) => {
  // fetch a movie details
  const response = await tmdbGet(`movie/${id}`, {
    append_to_response: 'videos', // add this parameter to include video data
  });
  return response.data; // return the movie details
};

export const fetchMovieQuery = async (query) => {
  // fetch a list of movies based on the query
  const response = await tmdbGet('search/movie', { query });
  return response.data.results;
};

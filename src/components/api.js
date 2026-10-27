import axios from 'axios';

// All TMDB requests go through our own /api/tmdb proxy, which adds the API key on the server
const tmdbGet = (path, params = {}) => axios.get('/api/tmdb', { params: { path, ...params } });

export const fetchPopularMovies = async () => {
  // fetch a list of popular movies
  try {
    const response = await tmdbGet('movie/popular');
    return response.data.results; // return the list of movies
  } catch (error) {
    console.error('Error fetching popular movies: ', error); // if there is an error, log it to the console
    return []; // return an empty array on error for consistency
  }
};

export const fetchMovieDetails = async (id) => {
  // fetch a movie details
  try {
    const response = await tmdbGet(`movie/${id}`, {
      append_to_response: 'videos', // add this parameter to include video data
    });
    return response.data; // return the movie details
  } catch (error) {
    console.error('Error fetching movie details: ', error); // if there is an error, log it to the console
    return null; // return null on error
  }
};

export const fetchMovieQuery = async (query) => {
  // fetch a list of movies based on the query
  try {
    const response = await tmdbGet('search/movie', { query });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies by query: ', error);
    return [];
  }
};

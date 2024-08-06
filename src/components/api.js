import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;
console.log(API_KEY);

export const fetchPopularMovies = async () => { // fetch a list of popular movies
  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', { // make a GET request to the TMDB API using axios
      params: { api_key: API_KEY }
    });
    return response.data.results; // return the list of movies
  } catch (error) {
    console.error('Error fetching popular movies: ', error); // if there is an error, log it to the console
    return []; // return an empty array on error for consistency
  }
};

export const fetchMovieDetails = async (id) => { // fetch a movie details
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, { // make a GET request to the TMDB API using axios
      params: {
        api_key: API_KEY,
        append_to_response: 'videos', // add this parameter to include video data
      }
    });
    return response.data; // return the movie details
  } catch (error) {
    console.error('Error fetching movie details: ', error); // if there is an error, log it to the console
    return null; // return null on error
  }
};

export const fetchMovieQuery = async (query) => { // fetch a list of movies based on the query
  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: API_KEY,
        query: query
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies by query: ', error);
    return [];
  }
};
import axios from 'axios';
import { BROWSE_LISTS } from '../utils/browseLists';

// All TMDB requests go through our own /api/tmdb proxy, which adds the API key on the server.
// Errors are passed on to the caller, so each page can decide how to show them.
const tmdbGet = (path, params = {}) => axios.get('/api/tmdb', { params: { path, ...params } });

// TMDB never serves more than 500 pages of a list, even when it reports more
const MAX_PAGES = 500;

// one page of a movie list, plus how many pages there are in total
const toMoviePage = (data) => ({ movies: data.results, totalPages: Math.min(data.total_pages, MAX_PAGES) });

export const fetchMovieList = async (listKey, page = 1, genreId = null) => {
  // fetch a page of one of the browse lists, e.g. popular or top rated, optionally narrowed to a genre
  const list = BROWSE_LISTS[listKey];
  const params = { ...list.params(genreId), page };
  if (genreId) params.with_genres = genreId;
  const response = await tmdbGet(list.path, params);
  return toMoviePage(response.data);
};

// the genre names rarely change, so they're fetched once and reused
let genresRequest = null;

export const fetchGenres = () => {
  // fetch TMDB's list of movie genres, e.g. { id: 18, name: 'Drama' }
  genresRequest ??= tmdbGet('genre/movie/list')
    .then((response) => response.data.genres)
    .catch((error) => {
      genresRequest = null; // let the next visit try again
      throw error;
    });
  return genresRequest;
};

export const fetchMovieDetails = async (id) => {
  // fetch a movie details
  const response = await tmdbGet(`movie/${id}`, {
    append_to_response: 'videos,credits,recommendations,watch/providers', // include the trailer, cast, related movies and where to watch in the same request
  });
  return response.data; // return the movie details
};

export const fetchMovieQuery = async (query, page = 1) => {
  // fetch a page of movies matching the query
  const response = await tmdbGet('search/movie', { query, page });
  return toMoviePage(response.data);
};

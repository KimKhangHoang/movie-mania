import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMovieList, fetchMovieQuery } from '../components/api';
import BrowseTabs from '../components/BrowseTabs';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import MovieGrid from '../components/MovieGrid';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { BROWSE_LISTS, DEFAULT_LIST } from '../utils/browseLists';

const SEARCH_DELAY_MS = 400; // how long to wait after the last keystroke before searching
const MAX_LOADED_PAGES = 8; // "Load more" stops after this many pages (160 movies), so the page stays light

// TMDB's pages can overlap when rankings shift between requests, so skip movies that are already shown
const addNewMovies = (shown, more) => {
  const shownIds = new Set(shown.map((movie) => movie.id));
  return [...shown, ...more.filter((movie) => !shownIds.has(movie.id))];
};

// updates the search in the URL while keeping the other settings, like the list being browsed
const withSearch = (params, text) => {
  const next = new URLSearchParams(params);
  if (text) next.set('q', text);
  else next.delete('q');
  return next;
};

// fetches a page of search results, or of the list being browsed when there's no search
const fetchMoviesPage = (query, listKey, page) =>
  query ? fetchMovieQuery(query, page) : fetchMovieList(listKey, page);

function Movies(listProps) {
  const [searchParams, setSearchParams] = useSearchParams(); // the search lives in the URL (?q=...) so it survives navigation
  const query = searchParams.get('q') ?? ''; // the search currently applied
  const listParam = searchParams.get('list');
  const listKey = BROWSE_LISTS[listParam] ? listParam : DEFAULT_LIST; // the list being browsed when not searching
  const requestKey = `${query}|${listKey}`; // identifies which movies are showing
  const [inputValue, setInputValue] = useState(query); // what is typed in the search bar, updated on every keystroke
  const [lastQuery, setLastQuery] = useState(query); // the query seen on the previous render
  const [movies, setMovies] = useState([]); // a state to store the movies to show
  const [loading, setLoading] = useState(true); // a state to track loading status
  const [error, setError] = useState(null); // a state for error detection
  const [page, setPage] = useState(1); // how many pages of results are showing
  const [totalPages, setTotalPages] = useState(1); // how many pages TMDB has for this list
  const [loadingMore, setLoadingMore] = useState(false); // a state to track the "Load more" button
  const [loadMoreError, setLoadMoreError] = useState(null); // a state for a failed "Load more"
  const latestRequest = useRef(requestKey); // lets "Load more" check the search or list hasn't changed while it was loading

  useEffect(() => {
    // apply the search once typing pauses, instead of sending a request on every keystroke
    const trimmed = inputValue.trim();
    if (trimmed === query) return;

    const timer = setTimeout(() => {
      setSearchParams((params) => withSearch(params, trimmed), { replace: true }); // replace, so each search doesn't add a history entry
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer); // a new keystroke cancels the pending search
  }, [inputValue, query, setSearchParams]);

  // keep the search bar in step when the URL changes elsewhere, e.g. the Movies link or the back button
  if (query !== lastQuery) {
    setLastQuery(query);
    if (inputValue.trim() !== query) setInputValue(query);
  }

  useEffect(() => {
    let ignore = false; // set when a newer search starts, so a slower older response can't overwrite its results
    latestRequest.current = requestKey;

    const getMovies = async () => {
      // an async function to fetch and store the first page of movies
      setLoading(true);
      setError(null); // clear any previous errors
      setLoadingMore(false);
      setLoadMoreError(null);

      try {
        const result = await fetchMoviesPage(query, listKey, 1);
        if (!ignore) {
          setMovies(result.movies); // store movies
          setPage(1);
          setTotalPages(result.totalPages);
        }
      } catch (error) {
        if (!ignore) setError("Couldn't load movies. Please try again.");
        console.error('Error in movies page: ', error);
      } finally {
        if (!ignore) setLoading(false); // set loading status to false once movies are fetched
      }
    };

    getMovies(); // call the predefined async function
    return () => {
      ignore = true;
    };
  }, [query, listKey, requestKey]);

  const handleSearch = (event) => {
    // handle search query changes
    setInputValue(event.target.value);
  };

  const handleLoadMore = async () => {
    // fetch the next page and add it below the movies already showing
    if (loadingMore) return; // ignore extra clicks while a page is loading
    const requested = requestKey;
    const nextPage = page + 1;
    setLoadingMore(true);
    setLoadMoreError(null);

    try {
      const result = await fetchMoviesPage(query, listKey, nextPage);
      if (latestRequest.current !== requested) return; // the search or list changed while this page was loading
      setMovies((shown) => addNewMovies(shown, result.movies));
      setPage(nextPage);
      setTotalPages(result.totalPages);
    } catch (error) {
      if (latestRequest.current === requested) setLoadMoreError("Couldn't load more movies. Please try again.");
      console.error('Error loading more movies: ', error);
    } finally {
      if (latestRequest.current === requested) setLoadingMore(false);
    }
  };

  const handleSubmit = (event) => {
    // pressing Enter searches straight away instead of waiting for the pause
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed !== query) setSearchParams((params) => withSearch(params, trimmed), { replace: true });
  };

  const pageTitle = query ? `Results for “${query}”` : BROWSE_LISTS[listKey].title;
  useDocumentTitle(pageTitle);

  // tells screen reader users how many movies are showing after a search or "Load more", since they can't see the grid change
  const itemName = query ? 'result' : 'movie';
  const resultsAnnouncement =
    !loading && !error && (query || page > 1)
      ? `Showing ${movies.length} ${movies.length === 1 ? itemName : `${itemName}s`}`
      : '';

  // decide what to show under the heading, keeping the search bar on screen in every case
  let content;
  if (loading) {
    content = <Loading />;
  } else if (error) {
    content = (
      <p className="status-message error" role="alert">
        {error}
      </p>
    );
  } else if (movies.length === 0) {
    content = (
      <EmptyState icon="fa-magnifying-glass" title={query ? `No movies found for “${query}”` : 'No movies to show'}>
        {query && <p>Check the spelling or try a different title.</p>}
      </EmptyState>
    );
  } else {
    content = (
      <>
        <MovieGrid movies={movies} {...listProps} />

        {/* past the cap, suggest searching instead of loading ever more movies */}
        {page >= MAX_LOADED_PAGES && page < totalPages && (
          <p className="list-end-note">You&apos;ve reached the end of this list. Search for a title to find more.</p>
        )}

        {/* hidden once every page has been loaded, or the cap is reached */}
        {page < Math.min(totalPages, MAX_LOADED_PAGES) && (
          <div className="load-more">
            {loadMoreError && (
              <p className="error" role="alert">
                {loadMoreError}
              </p>
            )}
            <button
              type="button"
              className="load-more-button"
              onClick={handleLoadMore}
              // aria-disabled rather than disabled, because a disabled button loses keyboard focus
              aria-disabled={loadingMore}
              aria-busy={loadingMore}
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="page movies-page">
      <h1 className="page-title">{pageTitle}</h1>

      {/* Search bar */}
      <form className="search-bar-container" role="search" onSubmit={handleSubmit}>
        <label htmlFor="movie-search" className="visually-hidden">
          Search movies
        </label>
        <i className="fa-solid fa-magnifying-glass search-icon" aria-hidden="true"></i>
        <input
          id="movie-search"
          type="search"
          className="search-bar"
          placeholder="Search movies..."
          value={inputValue}
          onChange={handleSearch}
        />
      </form>

      {/* searching replaces the lists, so the tabs only show while browsing */}
      {!query && <BrowseTabs activeList={listKey} />}

      <p className="visually-hidden" role="status">
        {resultsAnnouncement}
      </p>
      {content}
    </div>
  );
}

export default Movies;

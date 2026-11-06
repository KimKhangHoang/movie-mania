import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import usePersistentState from './hooks/usePersistentState';
import Movies from './pages/Movies';
import WishList from './pages/WishList';
import WatchedMovies from './pages/WatchedMovies';
import MovieDetail from './pages/MovieDetail';
import { countEvent } from './utils/analytics';
import { isInList } from './utils/lists';
import './App.css';

function App() {
  const [wishList, setWishList] = usePersistentState('wish-list', []); // wish list state, saved in the browser
  const [watchedMovies, setWatchedMovies] = usePersistentState('watched-movies', []); // watched movies state, saved in the browser

  // returns a handler that adds a movie to a list, or removes it if it's already there
  const toggleInList = (currentList, setList, addEvent) => (movie) => {
    if (!isInList(currentList, movie)) countEvent(addEvent);
    setList((list) => (isInList(list, movie) ? list.filter((item) => item.id !== movie.id) : [...list, movie]));
  };

  // what every page needs to show and update both lists
  const listProps = {
    wishList,
    watchedMovies,
    onToggleWishList: toggleInList(wishList, setWishList, 'add-to-wish-list'),
    onToggleWatched: toggleInList(watchedMovies, setWatchedMovies, 'mark-as-watched'),
  };

  return (
    <Router>
      {/* lets keyboard users jump past the header straight to the page content */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="site-header">
        <Link to="/" className="brand">
          <img src="/logo.svg" alt="" width="32" height="32" />
          <span>
            Movie<span className="brand-accent">Mania</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Main">
          <NavLink to="/" end className="nav-link">
            Movies
          </NavLink>
          <NavLink to="/wish-list" className="nav-link">
            Wish list{' '}
            <span className="nav-count">
              {wishList.length}
              <span className="visually-hidden"> {wishList.length === 1 ? 'movie' : 'movies'}</span>
            </span>
          </NavLink>
          <NavLink to="/watched-movies" className="nav-link">
            Watched{' '}
            <span className="nav-count">
              {watchedMovies.length}
              <span className="visually-hidden"> {watchedMovies.length === 1 ? 'movie' : 'movies'}</span>
            </span>
          </NavLink>
        </nav>
      </header>

      <main id="main-content" className="content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Movies {...listProps} />} />
          <Route path="/wish-list" element={<WishList {...listProps} />} />
          <Route path="/watched-movies" element={<WatchedMovies {...listProps} />} />
          <Route path="/movie/:id" element={<MovieDetail {...listProps} />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
          <img src="/tmdb-logo.svg" alt="TMDB" className="tmdb-logo" />
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </Router>
  );
}

export default App;

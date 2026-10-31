import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import usePersistentState from './hooks/usePersistentState';
import Movies from './pages/Movies';
import WishList from './pages/WishList';
import WatchedMovies from './pages/WatchedMovies';
import MovieDetail from './pages/MovieDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [wishList, setWishList] = usePersistentState('wish-list', []); // wish list state, saved in the browser
  const [watchedMovies, setWatchedMovies] = usePersistentState('watched-movies', []); // watched movies state, saved in the browser

  // returns a handler that adds a movie to a list, or removes it if it's already there
  const toggleInList = (setList) => (movie) =>
    setList((list) =>
      list.some((item) => item.id === movie.id) ? list.filter((item) => item.id !== movie.id) : [...list, movie],
    );

  // what every page needs to show and update both lists
  const listProps = {
    wishList,
    watchedMovies,
    onToggleWishList: toggleInList(setWishList),
    onToggleWatched: toggleInList(setWatchedMovies),
  };

  return (
    <Router>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-links-container">
          <NavLink to="/" className="nav-link">
            Movies
          </NavLink>
          <NavLink to="/wish-list" className="nav-link">
            Wish List
          </NavLink>
          <NavLink to="/watched-movies" className="nav-link">
            Watched Movies
          </NavLink>
        </div>
      </nav>

      {/* Content */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Movies {...listProps} />} />
          <Route path="/wish-list" element={<WishList {...listProps} />} />
          <Route path="/watched-movies" element={<WatchedMovies {...listProps} />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

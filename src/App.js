import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Movies from './pages/Movies';
import WishList from './pages/WishList';
import WatchedMovies from './pages/WatchedMovies';
import MovieDetail from './pages/MovieDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [wishList, setWishList] = useState([]); // wish list state
  const [watchedMovies, setWatchedMovies] = useState([]); // watched movies state

  const addToWishList = (movie) => { // add a movie to the wish list
    if (!wishList.some((wish) => wish.id === movie.id)) { //check if the movie is already in the wish list
      setWishList([...wishList, movie]);
    }
  };

  const removeFromWishList = (movie) => { // remove a movie from the wish list
    setWishList(wishList.filter((wish) => wish.id !== movie.id));
  };

  const addToWatchedMovies = (movie) => { // add a movie to the watched movies
    if (!watchedMovies.some((watched) => watched.id === movie.id)) { // check if the movie is already in the watched movies
      setWatchedMovies([...watchedMovies, movie]);
    }
  };
  
  const removeFromWatchedMovies = (movie) => { // remove the movie from the watched movies
    setWatchedMovies(watchedMovies.filter((watched) => watched.id !== movie.id));
  };

  return (
    <Router basename="/movie-mania">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-links-container">
          <NavLink to="/" className="nav-link">Movies</NavLink>
          <NavLink to="/wish-list" className="nav-link">Wish List</NavLink>
          <NavLink to="/watched-movies" className="nav-link">Watched Movies</NavLink>
        </div>
      </nav>

      {/* Content */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Movies wishList={wishList} watchedMovies={watchedMovies} onAddToWishList={addToWishList} onAddToWatchedMovies={addToWatchedMovies}/>} />
          <Route path="/wish-list" element={<WishList wishList={wishList} watchedMovies={watchedMovies} onRemoveFromWishList={removeFromWishList} onAddToWatchedMovies={addToWatchedMovies}/>} />
          <Route path="/watched-movies" element={<WatchedMovies wishList={wishList} watchedMovies={watchedMovies} onAddToWishList={addToWishList} onRemoveFromWatchedMovies={removeFromWatchedMovies}/>} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

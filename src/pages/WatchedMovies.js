import React from 'react';
import MovieCard from '../components/MovieCard';

function WatchedMovies({ wishList, watchedMovies, onAddToWishList, onRemoveFromWatchedMovies }) {
  return (
    <div className="watched-movies-page">
      <h1>Watched Movies</h1>
      {watchedMovies.length === 0 ? (
        <p>No movies have been watched yet.</p>
      ) : (
        <div className="d-flex flex-wrap justify-content-center">
          {watchedMovies.map((movie) => {
            const isAddedToWishList = wishList.some((wish) => wish.id === movie.id); // check if the movie is already in the wish list

            return (
              <MovieCard
                key={movie.id}
                movie={movie}
                onWishButtonClick={onAddToWishList} // pass the addToWishList function down to each movie card
                wishButtonLabel={isAddedToWishList ? "Added to wish list" : "Add to wish list"} // pass the button label based on condition
                onWatchedButtonClick={onRemoveFromWatchedMovies} // pass the removeFromWatchedMovies function down to each movie card
                watchedButtonLabel="Remove from watched movies"
              />
            )
          })}
        </div>
      )}
    </div>
  );
}

export default WatchedMovies;

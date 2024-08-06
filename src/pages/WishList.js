import React from 'react';
import MovieCard from '../components/MovieCard';

const WishList = ({wishList, watchedMovies, onRemoveFromWishList, onAddToWatchedMovies }) => {
  return (
    <div className="wishlist-page">
      <h1>Wish List</h1>
      {wishList.length === 0 ? (
        <p>There are no movies in your wish list yet.</p>
      ) : (
        <div className="d-flex flex-wrap justify-content-center">
          {wishList.map((movie) => {
            const isAddedToWatchedMovies = watchedMovies.some((watched) => watched.id === movie.id); // check if the movie is already in the watched movies
            
            return (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onWishButtonClick={onRemoveFromWishList} // pass the removeFromWishList function down to each movie card
                wishButtonLabel="Remove from wish list"
                onWatchedButtonClick={onAddToWatchedMovies} // pass the addToWatchedMovies function down to each movie card
                watchedButtonLabel={isAddedToWatchedMovies ? "Added to watched movies" : "Add to watched movies"} // pass the button label based on condition
              />
            )
          })}
        </div>
      )}
    </div>
  );
};

export default WishList;

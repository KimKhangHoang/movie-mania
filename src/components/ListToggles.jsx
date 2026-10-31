import React from 'react';

// The wish list and watched buttons. Each one adds the movie to its list, or removes it if it's already there.
const ListToggles = ({ movie, isInWishList, isWatched, onToggleWishList, onToggleWatched, className = '' }) => (
  <div className={className}>
    <button
      type="button"
      className="toggle-button toggle-wish"
      aria-pressed={isInWishList}
      title={isInWishList ? 'Remove from wish list' : 'Add to wish list'}
      onClick={() => onToggleWishList(movie)}
    >
      <i className={`${isInWishList ? 'fa-solid' : 'fa-regular'} fa-heart`} aria-hidden="true"></i>
      Wish list
    </button>

    <button
      type="button"
      className="toggle-button toggle-watched"
      aria-pressed={isWatched}
      title={isWatched ? 'Remove from watched' : 'Mark as watched'}
      onClick={() => onToggleWatched(movie)}
    >
      <i className={`${isWatched ? 'fa-solid' : 'fa-regular'} fa-eye`} aria-hidden="true"></i>
      Watched
    </button>
  </div>
);

export default ListToggles;

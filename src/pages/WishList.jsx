import React from 'react';
import MovieGrid from '../components/MovieGrid';

const WishList = (listProps) => {
  const { wishList } = listProps;

  return (
    <div className="wishlist-page">
      <h1>Wish List</h1>
      {wishList.length === 0 ? (
        <p>There are no movies in your wish list yet.</p>
      ) : (
        <MovieGrid movies={wishList} {...listProps} />
      )}
    </div>
  );
};

export default WishList;

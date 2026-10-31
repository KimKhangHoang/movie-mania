import React from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import MovieGrid from '../components/MovieGrid';

const WishList = (listProps) => {
  const { wishList } = listProps;

  return (
    <div className="page wishlist-page">
      <h1 className="page-title">Wish list</h1>
      {wishList.length === 0 ? (
        <EmptyState icon="fa-heart" title="Your wish list is empty">
          <p>Save movies you want to see by tapping Wish list on any movie.</p>
          <Link to="/" className="button-link">
            Browse movies
          </Link>
        </EmptyState>
      ) : (
        <MovieGrid movies={wishList} {...listProps} />
      )}
    </div>
  );
};

export default WishList;

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { browseUrl } from '../utils/browseLists';

// Genre chips for narrowing a list. They're links, so a filtered list can be shared or bookmarked.
const GenreFilter = ({ listKey, genres, activeGenre }) => {
  const rowRef = useRef(null);

  // on phones the chips scroll sideways, so bring the chosen one into view
  useEffect(() => {
    const row = rowRef.current;
    const chip = row?.querySelector('[aria-current="page"]');
    if (chip) row.scrollLeft = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
  }, [activeGenre, genres]);

  return (
    <nav className="genre-filter" aria-label="Filter by genre" ref={rowRef}>
      <Link to={browseUrl(listKey)} className="genre-chip" aria-current={activeGenre ? undefined : 'page'}>
        All genres
      </Link>
      {genres.map((genre) => (
        <Link
          key={genre.id}
          to={browseUrl(listKey, genre.id)}
          className="genre-chip"
          aria-current={String(genre.id) === activeGenre ? 'page' : undefined}
        >
          {genre.name}
        </Link>
      ))}
    </nav>
  );
};

export default GenreFilter;

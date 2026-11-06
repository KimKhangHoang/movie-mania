import React from 'react';
import { Link } from 'react-router';
import { BROWSE_LISTS, browseUrl } from '../utils/browseLists';

// Tabs for switching between the movie lists. They're links, so each list has its own shareable URL.
// The chosen genre carries over to lists that can be filtered by genre.
const BrowseTabs = ({ activeList, activeGenre }) => (
  <nav className="browse-tabs" aria-label="Movie lists">
    {Object.entries(BROWSE_LISTS).map(([key, list]) => (
      <Link
        key={key}
        to={browseUrl(key, list.hasGenres ? activeGenre : null)}
        className="browse-tab"
        aria-current={key === activeList ? 'page' : undefined}
      >
        {list.label}
      </Link>
    ))}
  </nav>
);

export default BrowseTabs;

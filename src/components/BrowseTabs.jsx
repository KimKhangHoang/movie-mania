import React from 'react';
import { Link } from 'react-router-dom';
import { BROWSE_LISTS, DEFAULT_LIST } from '../utils/browseLists';

// Tabs for switching between the movie lists. They're links, so each list has its own shareable URL.
const BrowseTabs = ({ activeList }) => (
  <nav className="browse-tabs" aria-label="Movie lists">
    {Object.entries(BROWSE_LISTS).map(([key, list]) => (
      <Link
        key={key}
        to={key === DEFAULT_LIST ? '/' : `/?list=${key}`}
        className="browse-tab"
        aria-current={key === activeList ? 'page' : undefined}
      >
        {list.label}
      </Link>
    ))}
  </nav>
);

export default BrowseTabs;

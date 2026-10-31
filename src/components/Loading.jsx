import React from 'react';

// Three bouncing dots. Screen readers hear "Loading" instead of the animation.
const Loading = () => (
  <div className="loading" role="status">
    <span className="loading-dot" aria-hidden="true"></span>
    <span className="loading-dot" aria-hidden="true"></span>
    <span className="loading-dot" aria-hidden="true"></span>
    <span className="visually-hidden">Loading</span>
  </div>
);

export default Loading;

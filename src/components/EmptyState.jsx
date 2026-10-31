import React from 'react';

// A friendly message for when there's nothing to show, with room for a hint or a link onwards
const EmptyState = ({ icon, title, children }) => (
  <div className="empty-state">
    <i className={`fa-solid ${icon} empty-state-icon`} aria-hidden="true"></i>
    <p className="empty-state-title">{title}</p>
    {children}
  </div>
);

export default EmptyState;

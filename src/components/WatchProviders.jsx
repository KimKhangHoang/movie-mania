import React from 'react';
import { withoutVariants } from '../utils/watchProviders';

// TMDB's names for the ways to watch a movie, in the order they're shown
const WATCH_OPTIONS = [
  { key: 'flatrate', label: 'Stream' },
  { key: 'free', label: 'Free' },
  { key: 'ads', label: 'Free with ads' },
  { key: 'rent', label: 'Rent' },
  { key: 'buy', label: 'Buy' },
];

// Where a movie can be watched in Australia. The services are for reference, so they aren't links.
// The JustWatch link credits the source of this data, as TMDB's terms require.
const WatchProviders = ({ providers }) => {
  const options = WATCH_OPTIONS.filter(({ key }) => providers?.[key]?.length > 0);

  return (
    <section className="page detail-section">
      <div className="watch-header">
        <h2 className="section-title">Where to watch in Australia</h2>
        <a href="https://www.justwatch.com/au" target="_blank" rel="noreferrer" className="watch-source">
          via JustWatch
          <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </div>

      {options.length > 0 ? (
        <div className="watch-options">
          {options.map(({ key, label }) => (
            <div key={key} className="watch-option">
              <h3 className="watch-option-title">{label}</h3>
              <ul className="provider-list">
                {withoutVariants(providers[key]).map((provider) => (
                  <li key={provider.provider_id} className="provider">
                    {provider.logo_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                        className="provider-logo"
                        alt=""
                        loading="lazy"
                      />
                    )}
                    {provider.provider_name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="watch-empty">No streaming, rental or purchase options listed.</p>
      )}
    </section>
  );
};

export default WatchProviders;

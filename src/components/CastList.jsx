import React from 'react';

// The main actors in a movie, in a row that scrolls sideways.
// tabIndex lets keyboard users focus the row and scroll it with the arrow keys, since nothing inside it can take focus.
const CastList = ({ cast }) => (
  <ul className="cast-list" aria-label="Cast" tabIndex={0}>
    {cast.map((person) => (
      <li key={person.credit_id} className="cast-member">
        {person.profile_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
            className="cast-photo"
            alt=""
            loading="lazy"
          />
        ) : (
          // not everyone has a photo on TMDB, so show a placeholder instead of a broken image
          <div className="cast-photo poster-placeholder" aria-hidden="true">
            <i className="fa-solid fa-user"></i>
          </div>
        )}
        <p className="cast-name">{person.name}</p>
        {person.character && <p className="cast-character">{person.character}</p>}
      </li>
    ))}
  </ul>
);

export default CastList;

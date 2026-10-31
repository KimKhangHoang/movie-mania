// Turns TMDB's "2008-07-16" into "16 July 2008", or null when there's no date.
// The date is read in UTC so it shows the same day in every time zone.
export const formatReleaseDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
    : null;

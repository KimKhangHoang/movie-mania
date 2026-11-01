// today's date as YYYY-MM-DD, for finding movies that haven't been released yet
const today = () => new Date().toISOString().slice(0, 10);

// The movie lists people can browse on the home page, in the order their tabs appear.
// Most use TMDB's discover endpoint with a different sort order, which also lets them filter by genre.
// TMDB can't filter trending movies by genre, so that list has no genre filter.
export const BROWSE_LISTS = {
  popular: {
    label: 'Popular',
    title: 'Popular movies',
    path: 'discover/movie',
    params: () => ({ sort_by: 'popularity.desc' }),
    hasGenres: true,
  },
  trending: {
    label: 'Trending',
    title: 'Trending this week',
    path: 'trending/movie/week',
    params: () => ({}),
    hasGenres: false,
  },
  top_rated: {
    label: 'Top rated',
    title: 'Top rated movies',
    path: 'discover/movie',
    // a minimum number of votes stops obscure movies with a handful of perfect ratings topping the list,
    // set lower within a genre so smaller genres still have movies to show
    params: (genreId) => ({ sort_by: 'vote_average.desc', 'vote_count.gte': genreId ? 500 : 2000 }),
    hasGenres: true,
  },
  upcoming: {
    label: 'Upcoming',
    title: 'Upcoming movies',
    path: 'discover/movie',
    params: () => ({ sort_by: 'popularity.desc', 'primary_release_date.gte': today() }),
    hasGenres: true,
  },
};

export const DEFAULT_LIST = 'popular';

// the home page URL for a list and an optional genre, e.g. "/?list=top_rated&genre=18"
export const browseUrl = (listKey, genreId) => {
  const params = new URLSearchParams();
  if (listKey !== DEFAULT_LIST) params.set('list', listKey);
  if (genreId) params.set('genre', genreId);
  const search = params.toString();
  return search ? `/?${search}` : '/';
};

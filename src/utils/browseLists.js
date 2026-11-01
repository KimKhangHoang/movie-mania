// today's date as YYYY-MM-DD, for finding movies that haven't been released yet
const today = () => new Date().toISOString().slice(0, 10);

// The movie lists people can browse on the home page, in the order their tabs appear.
// Most use TMDB's discover endpoint with a different sort order.
export const BROWSE_LISTS = {
  popular: {
    label: 'Popular',
    title: 'Popular movies',
    path: 'discover/movie',
    params: () => ({ sort_by: 'popularity.desc' }),
  },
  trending: {
    label: 'Trending',
    title: 'Trending this week',
    path: 'trending/movie/week',
    params: () => ({}),
  },
  top_rated: {
    label: 'Top rated',
    title: 'Top rated movies',
    path: 'discover/movie',
    // a minimum number of votes stops obscure movies with a handful of perfect ratings topping the list
    params: () => ({ sort_by: 'vote_average.desc', 'vote_count.gte': 2000 }),
  },
  upcoming: {
    label: 'Upcoming',
    title: 'Upcoming movies',
    path: 'discover/movie',
    params: () => ({ sort_by: 'popularity.desc', 'primary_release_date.gte': today() }),
  },
};

export const DEFAULT_LIST = 'popular';

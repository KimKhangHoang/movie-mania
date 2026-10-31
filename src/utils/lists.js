// Whether a movie is already in a saved list (lists are matched by TMDB id)
export const isInList = (list, movie) => list.some((item) => item.id === movie.id);

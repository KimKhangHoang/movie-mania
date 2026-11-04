import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchGenres, fetchMovieList } from './api';

vi.mock('axios');

describe('fetchMovieList', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('sends the list settings, page and genre to the proxy', async () => {
    axios.get.mockResolvedValue({ data: { results: [], total_pages: 3 } });

    await fetchMovieList('top_rated', 2, '18');

    expect(axios.get).toHaveBeenCalledWith('/api/tmdb', {
      params: {
        path: 'discover/movie',
        sort_by: 'vote_average.desc',
        'vote_count.gte': 500,
        page: 2,
        with_genres: '18',
      },
    });
  });

  it('caps the page count at the 500 pages TMDB will serve', async () => {
    axios.get.mockResolvedValue({ data: { results: [], total_pages: 9000 } });

    const { totalPages } = await fetchMovieList('popular');

    expect(totalPages).toBe(500);
  });
});

describe('fetchGenres', () => {
  it('retries after a failure, then reuses the successful result', async () => {
    const genres = [{ id: 18, name: 'Drama' }];
    axios.get.mockReset();
    axios.get.mockRejectedValueOnce(new Error('network down'));
    axios.get.mockResolvedValue({ data: { genres } });

    await expect(fetchGenres()).rejects.toThrow('network down');
    expect(await fetchGenres()).toEqual(genres);
    expect(await fetchGenres()).toEqual(genres);

    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});

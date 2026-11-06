import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { fetchGenres, fetchMovieList, fetchMovieQuery } from './components/api';
import { countEvent, countPageView } from './utils/analytics';

// the tests use made-up movies instead of calling TMDB, and check what would be counted without sending it
vi.mock('./components/api');
vi.mock('./utils/analytics');

const movie = (id, title) => ({ id, title, release_date: '2010-07-16', poster_path: null });
const moviePage = (movies, totalPages = 1) => ({ movies, totalPages });

describe('MovieMania', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    window.history.pushState({}, '', '/');
    fetchGenres.mockResolvedValue([{ id: 18, name: 'Drama' }]);
    fetchMovieList.mockResolvedValue(moviePage([movie(1, 'Inception')]));
  });

  it('keeps wish list changes across visits and lets you remove movies', async () => {
    const user = userEvent.setup();
    const firstVisit = render(<App />);

    const wishButton = await screen.findByRole('button', { name: 'Wish list, Inception' });
    await user.click(wishButton);
    expect(wishButton).toHaveAttribute('aria-pressed', 'true');
    firstVisit.unmount();

    render(<App />);
    await user.click(screen.getByRole('link', { name: /^Wish list 1\s*movie$/ }));
    expect(screen.getByRole('heading', { level: 2, name: 'Inception' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Wish list, Inception' }));
    expect(screen.getByText('Your wish list is empty')).toBeInTheDocument();
  });

  it('searches once after typing pauses, and returns to the list when cleared', async () => {
    const user = userEvent.setup();
    fetchMovieQuery.mockResolvedValue(moviePage([movie(2, 'Dune')]));
    render(<App />);
    await screen.findByRole('heading', { level: 2, name: 'Inception' });

    const searchBox = screen.getByRole('searchbox', { name: 'Search movies' });
    await user.type(searchBox, 'dune');

    expect(await screen.findByRole('heading', { level: 2, name: 'Dune' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Results for “dune”' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Movie lists' })).not.toBeInTheDocument();
    expect(fetchMovieQuery).toHaveBeenCalledTimes(1);
    expect(fetchMovieQuery).toHaveBeenCalledWith('dune', 1);

    await user.clear(searchBox);

    expect(await screen.findByRole('heading', { level: 2, name: 'Inception' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Movie lists' })).toBeInTheDocument();
  });

  it('switches lists and filters by genre through the URL', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('link', { name: 'Drama' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Popular Drama movies' })).toBeInTheDocument();
    expect(window.location.search).toBe('?genre=18');
    expect(fetchMovieList).toHaveBeenLastCalledWith('popular', 1, '18');

    // the genre carries over to a list that can use it
    await user.click(screen.getByRole('link', { name: 'Top rated' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Top rated Drama movies' })).toBeInTheDocument();
    expect(fetchMovieList).toHaveBeenLastCalledWith('top_rated', 1, '18');

    // trending can't filter by genre, so the filter disappears
    await user.click(screen.getByRole('link', { name: 'Trending' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Trending this week' })).toBeInTheDocument();
    expect(fetchMovieList).toHaveBeenLastCalledWith('trending', 1, null);
    expect(screen.queryByRole('navigation', { name: 'Filter by genre' })).not.toBeInTheDocument();
  });

  it('adds the next page on Load more, skipping movies already shown', async () => {
    const user = userEvent.setup();
    fetchMovieList.mockResolvedValueOnce(moviePage([movie(1, 'Inception'), movie(2, 'Dune')], 2));
    fetchMovieList.mockResolvedValueOnce(moviePage([movie(2, 'Dune'), movie(3, 'Heat')], 2));
    render(<App />);

    await user.click(await screen.findByRole('button', { name: 'Load more' }));
    await screen.findByRole('heading', { level: 2, name: 'Heat' });

    expect(fetchMovieList).toHaveBeenLastCalledWith('popular', 2, null);
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument(); // that was the last page
  });

  it('counts a search once, without what was typed or another page view', async () => {
    const user = userEvent.setup();
    fetchMovieQuery.mockResolvedValue(moviePage([movie(2, 'Dune')]));
    render(<App />);
    await screen.findByRole('heading', { level: 2, name: 'Inception' });
    expect(countPageView.mock.calls).toEqual([['/', 'Movies']]);

    await user.type(screen.getByRole('searchbox', { name: 'Search movies' }), 'dune');
    await screen.findByRole('heading', { level: 2, name: 'Dune' });

    expect(countEvent.mock.calls).toEqual([['search']]);
    expect(countPageView.mock.calls).toEqual([['/', 'Movies']]);
  });

  it('counts a search once when Enter is pressed before the pause', async () => {
    const user = userEvent.setup();
    fetchMovieQuery.mockResolvedValue(moviePage([movie(2, 'Dune')]));
    render(<App />);
    await screen.findByRole('heading', { level: 2, name: 'Inception' });

    await user.type(screen.getByRole('searchbox', { name: 'Search movies' }), 'dune{Enter}');
    await screen.findByRole('heading', { level: 2, name: 'Dune' });
    await new Promise((done) => setTimeout(done, 500)); // longer than the search delay, so a second count would have happened

    expect(countEvent.mock.calls).toEqual([['search']]);
  });

  it("doesn't count clearing a search, or opening a link to one", async () => {
    const user = userEvent.setup();
    fetchMovieQuery.mockResolvedValue(moviePage([movie(2, 'Dune')]));
    window.history.pushState({}, '', '/?q=dune');
    render(<App />);

    const searchBox = screen.getByRole('searchbox', { name: 'Search movies' });
    await screen.findByRole('heading', { level: 2, name: 'Dune' });
    await user.clear(searchBox);
    await screen.findByRole('heading', { level: 2, name: 'Inception' });

    expect(countEvent).not.toHaveBeenCalled();
    expect(countPageView.mock.calls).toEqual([['/', 'Movies']]);
  });

  it('counts movies being added to a list, but not removed', async () => {
    const user = userEvent.setup();
    render(<App />);

    const wishButton = await screen.findByRole('button', { name: 'Wish list, Inception' });
    await user.click(wishButton);
    await user.click(wishButton);
    await user.click(screen.getByRole('button', { name: 'Watched, Inception' }));

    expect(countEvent.mock.calls).toEqual([['add-to-wish-list'], ['mark-as-watched']]);
  });

  it('credits TMDB on every page, as its terms require', async () => {
    const user = userEvent.setup();
    render(<App />);
    const notice = 'This product uses the TMDB API but is not endorsed or certified by TMDB.';

    expect(screen.getByText(notice)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /TMDB/ })).toHaveAttribute('href', 'https://www.themoviedb.org');

    await user.click(screen.getByRole('link', { name: /^Wish list/ }));

    expect(screen.getByText(notice)).toBeInTheDocument();
  });

  it('shows an error when movies fail to load', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {}); // the app logs the failure, which isn't useful in test output
    fetchMovieList.mockRejectedValue(new Error('network down'));
    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load movies. Please try again.");
    await waitFor(() => expect(consoleError).toHaveBeenCalled());
    consoleError.mockRestore();
  });
});

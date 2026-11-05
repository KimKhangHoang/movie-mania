import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { fetchMovieDetails } from '../components/api';

// the tests use made-up movies instead of calling TMDB
vi.mock('../components/api');

const actor = (number, overrides) => ({
  credit_id: `credit-${number}`,
  name: `Actor ${number}`,
  character: `Character ${number}`,
  profile_path: `/actor-${number}.jpg`,
  ...overrides,
});

const related = (id, title) => ({ id, title, release_date: '2010-07-16', poster_path: null });

const movieDetails = (id, title, overrides) => ({
  id,
  title,
  release_date: '2010-07-16',
  runtime: 148,
  vote_count: 100,
  vote_average: 8.4,
  genres: [],
  poster_path: null,
  backdrop_path: null,
  ...overrides,
});

// a response the test can finish whenever it likes, to control the order responses arrive in
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

describe('Movie detail page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    window.history.pushState({}, '', '/movie/1');
    vi.stubGlobal('scrollTo', vi.fn()); // jsdom doesn't lay out a page, so it can't scroll
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows only the top-billed cast, with a placeholder for missing photos', async () => {
    const cast = Array.from({ length: 20 }, (_, index) => actor(index + 1));
    cast[1] = actor(2, { profile_path: null });
    fetchMovieDetails.mockResolvedValue(movieDetails(1, 'Inception', { credits: { cast } }));
    render(<App />);

    const castList = await screen.findByRole('list', { name: 'Cast' });
    const members = within(castList).getAllByRole('listitem');

    expect(members).toHaveLength(12);
    expect(members[0]).toHaveTextContent('Actor 1');
    expect(members[0]).toHaveTextContent('Character 1');
    expect(members[0].querySelector('img')).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w185/actor-1.jpg');
    expect(members[1].querySelector('img')).toBeNull();
    expect(screen.queryByText('Actor 13')).not.toBeInTheDocument();
  });

  it('leaves out the sections TMDB has nothing for', async () => {
    fetchMovieDetails.mockResolvedValue(
      movieDetails(1, 'Inception', { credits: { cast: [] }, recommendations: { results: [] } }),
    );
    render(<App />);

    await screen.findByRole('heading', { level: 1, name: 'Inception' });

    expect(screen.queryByRole('heading', { name: 'Cast' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'More like this' })).not.toBeInTheDocument();
  });

  it('shows the ways to watch in Australia, with the required JustWatch credit', async () => {
    const provider = (provider_id, provider_name) => ({ provider_id, provider_name, logo_path: `/${provider_id}.png` });
    const results = {
      US: { link: 'https://tmdb.example/us', flatrate: [provider(9, 'Only in the US')] },
      AU: {
        link: 'https://tmdb.example/au',
        flatrate: [provider(1, 'Netflix'), provider(2, 'Netflix Standard with Ads')],
        ads: [], // a way to watch with no services shouldn't leave an empty heading
        rent: [provider(3, 'YouTube')],
      },
    };
    fetchMovieDetails.mockResolvedValue(movieDetails(1, 'Inception', { 'watch/providers': { results } }));
    render(<App />);

    const heading = await screen.findByRole('heading', { level: 2, name: 'Where to watch in Australia' });
    const section = within(heading.closest('section'));

    expect(section.getAllByRole('heading', { level: 3 }).map((title) => title.textContent)).toEqual(['Stream', 'Rent']);
    expect(section.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Netflix', 'YouTube']);
    expect(section.getByRole('link', { name: /See how to watch on TMDB/ })).toHaveAttribute(
      'href',
      'https://tmdb.example/au',
    );
    expect(section.getByRole('link', { name: /JustWatch/ })).toBeInTheDocument();
  });

  it('says when there is nowhere to watch in Australia, and still credits JustWatch', async () => {
    const results = { US: { link: 'https://tmdb.example/us', flatrate: [] } };
    fetchMovieDetails.mockResolvedValue(movieDetails(1, 'Inception', { 'watch/providers': { results } }));
    render(<App />);

    expect(await screen.findByText(/no streaming, rental or purchase options/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /JustWatch/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /See how to watch on TMDB/ })).not.toBeInTheDocument();
  });

  it('lets you save a related movie and shows its title under the section heading', async () => {
    const user = userEvent.setup();
    const results = Array.from({ length: 20 }, (_, index) => related(index + 100, `Related ${index + 1}`));
    fetchMovieDetails.mockResolvedValue(movieDetails(1, 'Inception', { recommendations: { results } }));
    render(<App />);

    await screen.findByRole('heading', { level: 2, name: 'More like this' });

    expect(screen.getAllByRole('article')).toHaveLength(11); // the movie itself, plus 10 related movies
    expect(screen.getByRole('heading', { level: 3, name: 'Related 1' })).toBeInTheDocument();

    const wishButton = screen.getByRole('button', { name: 'Wish list, Related 1' });
    await user.click(wishButton);

    expect(wishButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('link', { name: /^Wish list 1\s*movie$/ })).toBeInTheDocument();
  });

  it('loads a related movie from the top of the page', async () => {
    const user = userEvent.setup();
    fetchMovieDetails.mockImplementation(async (id) =>
      id === '1'
        ? movieDetails(1, 'Inception', { recommendations: { results: [related(2, 'Dune')] } })
        : movieDetails(2, 'Dune'),
    );
    render(<App />);

    await user.click(await screen.findByRole('link', { name: /Dune/ }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Dune' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: 'Inception' })).not.toBeInTheDocument();
    expect(document.title).toBe('Dune | MovieMania');
    expect(window.scrollTo).toHaveBeenCalledTimes(2); // once for each movie opened
  });

  it('ignores a slower response for the movie you just left', async () => {
    const user = userEvent.setup();
    const slowFirstMovie = deferred();
    const secondMovie = deferred();
    fetchMovieDetails.mockImplementation((id) => (id === '1' ? slowFirstMovie.promise : secondMovie.promise));
    fetchMovieDetails.mockResolvedValueOnce(
      movieDetails(1, 'Inception', { recommendations: { results: [related(2, 'Dune')] } }),
    );
    render(<App />);

    // open Dune, then go back while its response is still on the way
    await user.click(await screen.findByRole('link', { name: /Dune/ }));
    window.history.back();
    await vi.waitFor(() => expect(window.location.pathname).toBe('/movie/1'));
    await vi.waitFor(() => expect(fetchMovieDetails).toHaveBeenCalledTimes(3));

    slowFirstMovie.resolve(movieDetails(1, 'Inception'));
    expect(await screen.findByRole('heading', { level: 1, name: 'Inception' })).toBeInTheDocument();

    // Dune's response arrives last, but it must not replace the movie now being shown
    await act(async () => secondMovie.resolve(movieDetails(2, 'Dune')));

    expect(screen.getByRole('heading', { level: 1, name: 'Inception' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: 'Dune' })).not.toBeInTheDocument();
  });

  it('clears an earlier error when another movie loads', async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {}); // the app logs the failure, which isn't useful in test output
    fetchMovieDetails.mockResolvedValueOnce(
      movieDetails(1, 'Inception', { recommendations: { results: [related(2, 'Dune')] } }),
    );
    fetchMovieDetails.mockRejectedValueOnce(new Error('network down'));
    fetchMovieDetails.mockResolvedValueOnce(movieDetails(1, 'Inception'));
    render(<App />);

    await user.click(await screen.findByRole('link', { name: /Dune/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load this movie.");

    window.history.back();

    expect(await screen.findByRole('heading', { level: 1, name: 'Inception' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    consoleError.mockRestore();
  });
});

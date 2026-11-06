import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { countEvent, countPageView } from './analytics';

const LIVE_HOSTNAME = 'kimkhanghoang-moviemania.vercel.app';

// The parameters of the most recent request to GoatCounter
const lastCount = () => new URL(navigator.sendBeacon.mock.lastCall[0]);

describe('analytics', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { sendBeacon: vi.fn(() => true), webdriver: false });
    // What the page's address would be during a search on the live site
    vi.stubGlobal('location', { hostname: LIVE_HOSTNAME, search: '?q=secret-search' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a page view to GoatCounter', () => {
    countPageView('/movie/27205', 'Inception');

    const url = lastCount();
    expect(url.origin + url.pathname).toBe('https://moviemania.goatcounter.com/count');
    expect(url.searchParams.get('p')).toBe('/movie/27205');
    expect(url.searchParams.get('t')).toBe('Inception');
    expect(url.searchParams.has('e')).toBe(false);
  });

  it('never sends the search from the address', () => {
    countPageView('/', 'Movies');
    expect(lastCount().href).not.toContain('secret-search');
    expect(lastCount().searchParams.has('q')).toBe(false);

    countEvent('search');
    expect(lastCount().href).not.toContain('secret-search');
    expect(lastCount().searchParams.has('q')).toBe(false);
  });

  it('only sends the referrer with the first page view', async () => {
    const referrer = vi.spyOn(document, 'referrer', 'get').mockReturnValue('https://example.com/');
    vi.resetModules(); // The referrer is read when the module loads
    const { countPageView: countOnNewVisit } = await import('./analytics');

    countOnNewVisit('/', 'Movies');
    expect(lastCount().searchParams.get('r')).toBe('https://example.com/');

    countOnNewVisit('/wish-list', 'Wish list');
    expect(lastCount().searchParams.get('r')).toBe('');
    referrer.mockRestore();
  });

  it('sends an event as just its name', () => {
    countEvent('search');

    expect(lastCount().searchParams.get('p')).toBe('search');
    expect(lastCount().searchParams.get('e')).toBe('true');
    expect(lastCount().searchParams.has('t')).toBe(false);
  });

  it.each(['localhost', 'movie-mania-git-feature-branch.vercel.app'])('does not count visits to %s', (hostname) => {
    vi.stubGlobal('location', { hostname });

    countPageView('/', 'Movies');
    countEvent('search');

    expect(navigator.sendBeacon).not.toHaveBeenCalled();
  });

  it('does not count automated browsers', () => {
    vi.stubGlobal('navigator', { sendBeacon: vi.fn(), webdriver: true });

    countPageView('/', 'Movies');

    expect(navigator.sendBeacon).not.toHaveBeenCalled();
  });
});

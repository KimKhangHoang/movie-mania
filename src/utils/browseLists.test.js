import { afterEach, describe, expect, it, vi } from 'vitest';
import { BROWSE_LISTS, browseUrl } from './browseLists';

describe('browseUrl', () => {
  it('keeps the default list out of the URL', () => {
    expect(browseUrl('popular')).toBe('/');
    expect(browseUrl('popular', '18')).toBe('/?genre=18');
  });

  it('adds the list and genre to the URL', () => {
    expect(browseUrl('trending')).toBe('/?list=trending');
    expect(browseUrl('top_rated', '18')).toBe('/?list=top_rated&genre=18');
  });
});

describe('BROWSE_LISTS', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('asks for fewer votes on top rated within a genre, so small genres still have movies', () => {
    expect(BROWSE_LISTS.top_rated.params(null)['vote_count.gte']).toBe(2000);
    expect(BROWSE_LISTS.top_rated.params('18')['vote_count.gte']).toBe(500);
  });

  it('only includes movies from today onwards in upcoming', () => {
    vi.useFakeTimers({ now: new Date('2026-11-04T12:00:00Z') });

    expect(BROWSE_LISTS.upcoming.params()['primary_release_date.gte']).toBe('2026-11-04');
  });
});

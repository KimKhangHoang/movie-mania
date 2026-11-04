// @vitest-environment node
// Kept outside api/ because Vercel turns every file in that folder into a serverless function.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../api/tmdb.js';

const callProxy = (query) => GET(new Request(`http://localhost/api/tmdb?${query}`));

describe('TMDB proxy', () => {
  let tmdbFetch;

  beforeEach(() => {
    // a fake key and a fake TMDB, so these tests never use the real key or the network
    vi.stubEnv('TMDB_API_KEY', 'test-key');
    tmdbFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"results":[]}'));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('forwards allowed requests to TMDB with the key added', async () => {
    const response = await callProxy('path=search/movie&query=dune&page=2');

    const url = new URL(tmdbFetch.mock.calls[0][0]);
    expect(url.pathname).toBe('/3/search/movie');
    expect(url.searchParams.get('query')).toBe('dune');
    expect(url.searchParams.get('page')).toBe('2');
    expect(url.searchParams.get('api_key')).toBe('test-key');
    expect(url.searchParams.has('path')).toBe(false);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ results: [] });
  });

  it.each(['', 'account', 'movie/abc', 'movie/550/credits', 'movie/550/../../account', 'discover/movie/extra'])(
    'rejects the path "%s" without calling TMDB',
    async (path) => {
      const response = await callProxy(`path=${encodeURIComponent(path)}`);

      expect(response.status).toBe(400);
      expect(tmdbFetch).not.toHaveBeenCalled();
    },
  );

  it("always sends the server's key, even if the request supplies its own", async () => {
    await callProxy('path=discover/movie&api_key=someone-elses-key');

    const url = new URL(tmdbFetch.mock.calls[0][0]);
    expect(url.searchParams.getAll('api_key')).toEqual(['test-key']);
  });

  it('caches successful responses but not failed ones', async () => {
    const success = await callProxy('path=discover/movie');
    expect(success.headers.get('Cache-Control')).toContain('s-maxage');

    tmdbFetch.mockResolvedValue(new Response('{"status_message":"Not found"}', { status: 404 }));
    const failure = await callProxy('path=movie/999');
    expect(failure.status).toBe(404);
    expect(failure.headers.has('Cache-Control')).toBe(false);
  });

  it('returns a 502 without the key when TMDB is unreachable', async () => {
    tmdbFetch.mockRejectedValue(new Error('network down'));

    const response = await callProxy('path=discover/movie');

    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain('test-key');
  });

  it('returns a 500 when the server has no key', async () => {
    vi.stubEnv('TMDB_API_KEY', '');

    const response = await callProxy('path=discover/movie');

    expect(response.status).toBe(500);
    expect(tmdbFetch).not.toHaveBeenCalled();
  });
});

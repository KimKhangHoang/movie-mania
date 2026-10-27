// Server-side proxy for TMDB, so the API key never reaches the browser.
// The client calls /api/tmdb?path=<TMDB path>&<TMDB params>.
// Only the TMDB endpoints this app uses are allowed through, so the proxy can't be used as an open relay.

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const ALLOWED_PATHS = [/^movie\/popular$/, /^movie\/\d+$/, /^search\/movie$/];

export async function GET(request) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Server is missing TMDB_API_KEY' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') ?? '';
  if (!ALLOWED_PATHS.some((pattern) => pattern.test(path))) {
    return Response.json({ error: 'Unsupported TMDB path' }, { status: 400 });
  }

  // Forward the remaining query parameters to TMDB, with the key added
  searchParams.delete('path');
  searchParams.set('api_key', apiKey);

  try {
    const tmdbResponse = await fetch(`${TMDB_BASE_URL}/${path}?${searchParams}`);
    const headers = { 'Content-Type': 'application/json' };
    if (tmdbResponse.ok) {
      // Let Vercel's CDN cache successful responses to reduce calls to TMDB
      headers['Cache-Control'] = 'public, s-maxage=600, stale-while-revalidate=86400';
    }
    return new Response(await tmdbResponse.text(), { status: tmdbResponse.status, headers });
  } catch {
    return Response.json({ error: 'Failed to reach TMDB' }, { status: 502 });
  }
}

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { GET as tmdbProxy } from './api/tmdb.js';

// Runs the same /api/tmdb function locally that Vercel runs in production, so no Vercel CLI is needed
function tmdbProxyLocal() {
  const handle = async (req, res) => {
    const response = await tmdbProxy(new Request(new URL(req.originalUrl, 'http://localhost')));
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(await response.text());
  };

  return {
    name: 'tmdb-proxy-local',
    configureServer(server) {
      server.middlewares.use('/api/tmdb', handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/tmdb', handle);
    },
  };
}

export default defineConfig(({ mode }) => {
  // Give the local proxy the key from .env. It isn't VITE_-prefixed, so it never ends up in the client bundle.
  process.env.TMDB_API_KEY ??= loadEnv(mode, process.cwd(), '').TMDB_API_KEY;

  return {
    plugins: [react(), tmdbProxyLocal()],
  };
});

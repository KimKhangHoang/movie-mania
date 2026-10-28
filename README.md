# Movie App

This repository contains the source code for a web application that allows users to browse, manage, and track movies.

**Live demo:** [movie-mania-roan-three.vercel.app](https://movie-mania-roan-three.vercel.app)

## Features

- Browse popular movies
- Search for movies by title
- View movies' properties and trailers
- Add movies to wish list or watched movies
- Remove movies from wish list or watched movies
- User-friendly and responsive interface

## Technologies Used

- HTML
- CSS
- JavaScript
- React
- Vite
- Bootstrap
- Axios for API calls
- Vercel Functions for the API proxy
- [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)

## How the TMDB API key is kept private

The browser never talks to TMDB directly.
It calls `/api/tmdb`, a serverless function in [api/tmdb.js](api/tmdb.js) that adds the API key on the server and forwards the request.
The function only allows the TMDB endpoints this app uses, and successful responses are cached on Vercel's CDN.

In local development, [vite.config.js](vite.config.js) runs the same function inside the Vite dev server, so no extra tooling is needed.

## Getting Started

Requires Node.js 24.

1. Get a free API key from [TMDB](https://www.themoviedb.org/settings/api).
2. Copy `.env.example` to `.env` and set `TMDB_API_KEY`.
3. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Other scripts:

- `npm run build` builds the production site into `dist/`
- `npm run preview` serves the production build locally, including the API proxy
- `npm run lint` checks the code with Oxlint
- `npm run format` formats the code with Prettier

## Deployment

The app is deployed on [Vercel](https://vercel.com).
Import the repository into Vercel, which detects Vite automatically, and add `TMDB_API_KEY` as an environment variable in the project settings.
[vercel.json](vercel.json) sends all non-API routes to the app, so links to pages like `/movie/27205` work when opened directly.

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

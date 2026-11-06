# MovieMania

[![CI](https://github.com/KimKhangHoang/movie-mania/actions/workflows/ci.yml/badge.svg)](https://github.com/KimKhangHoang/movie-mania/actions/workflows/ci.yml)
[![Visits](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmoviemania.goatcounter.com%2Fcounter%2FTOTAL.json&query=%24.count&label=visits&color=f5b942)](https://moviemania.goatcounter.com)
[![Searches](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmoviemania.goatcounter.com%2Fcounter%2Fsearch.json&query=%24.count&label=searches&color=f5b942)](https://moviemania.goatcounter.com)
[![Added to wish list](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmoviemania.goatcounter.com%2Fcounter%2Fadd-to-wish-list.json&query=%24.count&label=added%20to%20wish%20list&color=f5b942)](https://moviemania.goatcounter.com)
[![Marked as watched](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmoviemania.goatcounter.com%2Fcounter%2Fmark-as-watched.json&query=%24.count&label=marked%20as%20watched&color=f5b942)](https://moviemania.goatcounter.com)

A web app for browsing movies, watching trailers, and keeping track of what you want to see and what you've already watched.

**Live demo:** [kimkhanghoang-moviemania.vercel.app](https://kimkhanghoang-moviemania.vercel.app)

## Features

- Browse popular, trending, top rated and upcoming movies, filtered by genre
- Search by title, with shareable links for searches and filtered lists
- View each movie's details, rating, genres, trailer, cast and related movies
- See where each movie can be streamed, rented or bought in Australia
- Save movies to a wish list or mark them as watched, from any page
- Lists are saved in the browser, so they persist across visits
- Dark, responsive design that works on phones and desktops
- Keyboard and screen reader friendly

## Technologies Used

- HTML
- CSS
- JavaScript
- React
- Vite
- Axios for API calls
- Vercel Functions for the API proxy
- Vitest and React Testing Library for tests
- [GoatCounter](https://www.goatcounter.com/) for visit counts
- [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)

## How the TMDB API key is kept private

The browser never talks to TMDB directly.
It calls `/api/tmdb`, a serverless function in [api/tmdb.js](api/tmdb.js) that adds the API key on the server and forwards the request.
The function only allows the TMDB endpoints this app uses, and successful responses are cached on Vercel's CDN.

In local development, [vite.config.js](vite.config.js) runs the same function inside the Vite dev server, so no extra tooling is needed.

## Usage Stats

Visits, searches and movies added to each list are counted with [GoatCounter](https://www.goatcounter.com/), which doesn't store IP addresses or other personal information.
For searches, only the fact that one happened is recorded, never what was typed.
To keep it that way, [analytics.js](src/utils/analytics.js) calls GoatCounter's endpoint directly with only the values it needs, instead of loading its script, which would also send the URL's query string.
Only the live site is counted, not local development or preview deployments.

The badges above update every few hours, and the full stats are public [here](https://moviemania.goatcounter.com).

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
- `npm test` runs the tests, using made-up data so no API key is needed

GitHub Actions runs the lint, tests and build on every pull request and push to `main`.

## Deployment

The app is deployed on [Vercel](https://vercel.com).
Import the repository into Vercel, which detects Vite automatically, and add `TMDB_API_KEY` as an environment variable in the project settings.
[vercel.json](vercel.json) sends all non-API routes to the app, so links to pages like `/movie/27205` work when opened directly.

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

Streaming, rental and purchase data is provided by [JustWatch](https://www.justwatch.com/au).

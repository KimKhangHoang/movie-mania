// Visit counting with GoatCounter, which doesn't store IP addresses or other personal information.
// This calls its /count endpoint directly, because its script always sends the URL's query string and the page title,
// and here those can contain what someone searched for. Only the values below are ever sent.
const COUNT_URL = 'https://moviemania.goatcounter.com/count';
const LIVE_HOSTNAME = 'kimkhanghoang-moviemania.vercel.app';

let referrer = document.referrer; // Where the visitor came from, which only applies to their first page view

// Only count real visits to the live site, not local development, Vercel previews or automated browsers
const shouldCount = () => window.location.hostname === LIVE_HOSTNAME && !navigator.webdriver;

const send = (params) => {
  if (!shouldCount()) return;

  // The random value stops browsers from reusing a cached response, which wouldn't be counted
  const query = new URLSearchParams({ ...params, rnd: Math.random().toString(36).slice(2, 7) });
  navigator.sendBeacon(`${COUNT_URL}?${query}`);
};

export const countPageView = (path, title) => {
  send({ p: path, t: title, r: referrer, s: window.screen.width });
  referrer = '';
};

// An event records only that something happened, e.g. a search, and never what was typed
export const countEvent = (name) => send({ p: name, e: 'true' });

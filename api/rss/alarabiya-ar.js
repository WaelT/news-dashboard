import { proxyFetch } from '../_proxy.js';

export default async function handler(req, res) {
  // Al Arabiya's own RSS blocks non-browser TLS fingerprints (403 for Node fetch),
  // so source their articles via Google News instead.
  await proxyFetch(
    'https://news.google.com/rss/search?q=site:alarabiya.net&hl=ar&gl=SA&ceid=SA:ar',
    res
  );
}

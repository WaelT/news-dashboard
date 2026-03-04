import { proxyFetch } from '../_proxy.js';

export default async function handler(req, res) {
  await proxyFetch(
    'https://news.google.com/rss/search?q=iran+war+strikes&hl=en-US&gl=US&ceid=US:en',
    res,
  );
}

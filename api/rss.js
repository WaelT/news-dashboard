/**
 * Consolidated RSS proxy — one serverless function for all feeds
 * (Vercel Hobby caps deployments at 12 functions; one file per feed
 * blew past that). vercel.json rewrites /rss/:feed → /api/rss?feed=:feed.
 */
import { proxyFetch } from './_proxy.js';

const FEEDS = {
  bbc: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
  'bbc-ar': 'https://feeds.bbci.co.uk/arabic/rss.xml',
  'bbc-breaking': 'https://feeds.bbci.co.uk/news/world/rss.xml',
  aljazeera: 'https://www.aljazeera.com/xml/rss/all.xml',
  'aljazeera-ar': 'https://www.aljazeera.net/rss',
  'skynews-ar': 'https://www.skynewsarabia.com/rss.xml',
  'rt-ar': 'https://arabic.rt.com/rss/',
  'france24-ar': 'https://www.france24.com/ar/rss',
  ap: 'https://news.google.com/rss/search?q=iran+conflict+middle+east&hl=en-US&gl=US&ceid=US:en',
  reuters: 'https://news.google.com/rss/search?q=iran+war+strikes&hl=en-US&gl=US&ceid=US:en',
  'breaking-ar': 'https://news.google.com/rss/search?q=%D8%B9%D8%A7%D8%AC%D9%84+%D8%A5%D9%8A%D8%B1%D8%A7%D9%86&hl=ar&gl=SA&ceid=SA:ar',
  'google-ar': 'https://news.google.com/rss/search?q=%D8%A5%D9%8A%D8%B1%D8%A7%D9%86+%D8%AD%D8%B1%D8%A8+%D8%B6%D8%B1%D8%A8%D8%A7%D8%AA&hl=ar&gl=SA&ceid=SA:ar',
  // Al Arabiya's own RSS blocks server-side TLS fingerprints — sourced via Google News
  'alarabiya-ar': 'https://news.google.com/rss/search?q=site:alarabiya.net&hl=ar&gl=SA&ceid=SA:ar',
};

export default async function handler(req, res) {
  const url = FEEDS[req.query?.feed];
  if (!url) {
    res.status(404).json({ error: `Unknown feed: ${req.query?.feed}` });
    return;
  }
  await proxyFetch(url, res);
}

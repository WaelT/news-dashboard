import { proxyFetch } from '../_proxy.js';

export default async function handler(req, res) {
  await proxyFetch('https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', res);
}

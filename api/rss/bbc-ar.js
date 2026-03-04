import { proxyFetch } from '../_proxy.js';

export default async function handler(req, res) {
  await proxyFetch('https://feeds.bbci.co.uk/arabic/rss.xml', res);
}

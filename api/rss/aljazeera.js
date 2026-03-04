import { proxyFetch } from '../_proxy.js';

export default async function handler(req, res) {
  await proxyFetch('https://www.aljazeera.com/xml/rss/all.xml', res);
}

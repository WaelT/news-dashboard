import { proxyFetch } from '../_proxy.js';

export default async function handler(req, res) {
  await proxyFetch('https://www.reutersagency.com/feed/reuterscomservice/', res);
}

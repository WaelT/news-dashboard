import { proxyFetch } from '../_proxy.js';

export default async function handler(req, res) {
  await proxyFetch('https://rsshub.app/apnews/topics/apf-topnews', res);
}

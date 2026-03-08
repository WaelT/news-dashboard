import { proxyFetch } from '../_proxy.js';

export default async function handler(req, res) {
  await proxyFetch(
    'https://news.google.com/rss/search?q=%D8%B9%D8%A7%D8%AC%D9%84+%D8%A5%D9%8A%D8%B1%D8%A7%D9%86&hl=ar&gl=SA&ceid=SA:ar',
    res,
  );
}

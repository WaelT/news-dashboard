export default async function handler(req, res) {
  // req.query.path = ['v8', 'finance', 'chart', 'ES=F']
  // req.query also contains range, interval, etc.
  const { path, ...params } = req.query;
  const upstream = Array.isArray(path) ? path.join('/') : (path || '');

  // Rebuild query string from non-path params
  const qs = new URLSearchParams(params).toString();
  const url = `https://query1.finance.yahoo.com/${upstream}${qs ? '?' + qs : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({ error: `Yahoo Finance HTTP ${response.status}`, url });
      return;
    }

    const data = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}

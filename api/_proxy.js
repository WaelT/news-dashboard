/**
 * Shared proxy helper for Vercel serverless functions.
 * Fetches a URL and forwards the response with appropriate headers.
 */
export async function proxyFetch(url, res, contentType = 'application/xml') {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({ error: `Upstream HTTP ${response.status}` });
      return;
    }

    const body = await response.text();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}

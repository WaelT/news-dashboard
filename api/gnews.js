/**
 * GNews proxy — keeps the API key server-side instead of shipping it
 * in the client bundle. Reads GNEWS_API_KEY or VITE_GNEWS_API_KEY
 * (the latter so the existing Vercel env var keeps working).
 */
export default async function handler(req, res) {
  const key = process.env.GNEWS_API_KEY || process.env.VITE_GNEWS_API_KEY;
  if (!key) {
    res.status(200).json({ articles: [] });
    return;
  }

  const lang = req.query?.lang === 'ar' ? 'ar' : 'en';

  try {
    const url = `https://gnews.io/api/v4/search?q=iran+war+conflict&lang=${lang}&max=10&token=${key}`;
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: `GNews HTTP ${response.status}`, articles: [] });
      return;
    }
    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ articles: data.articles || [] });
  } catch (err) {
    res.status(502).json({ error: err.message, articles: [] });
  }
}

const TRACKER_URL =
  'https://www.aljazeera.com/news/2026/3/1/us-israel-attacks-on-iran-death-toll-and-injuries-live-tracker';

const COUNTRY_MAP = {
  'iran': 'iran',
  'israel': 'israel',
  'us soldiers': 'usa',
  'united states': 'usa',
  'u.s.': 'usa',
  'lebanon': 'lebanon',
  'yemen': 'yemen',
  'iraq': 'iraq',
  'united arab emirates': 'uae',
  'uae': 'uae',
  'kuwait': 'kuwait',
  'bahrain': 'bahrain',
  'qatar': 'qatar',
  'syria': 'syria',
  'palestine': 'palestine',
  'gaza': 'palestine',
  'saudi arabia': 'saudi',
  'oman': 'oman',
  'jordan': 'jordan',
};

function parseNum(str) {
  if (!str) return 0;
  const s = str.toLowerCase().trim();
  if (s === 'hundreds') return 500;
  if (s === 'thousands') return 2000;
  const n = parseInt(s.replace(/,/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

function parseCasualties(text) {
  const casualties = {};

  // Structured: "Country – killed: X, injured: Y"
  const pattern =
    /(?:^|[.\n])\s*((?:[A-Z][a-z]+\.?\s*){1,4})\s*[\u2013\u2014\u2013\u2014–—-]\s*killed:\s*([\d,]+)\s*[,.]?\s*injured:\s*([\d,]+|hundreds|thousands)/g;

  let match;
  while ((match = pattern.exec(text)) !== null) {
    const rawName = match[1].trim().toLowerCase();
    const key = COUNTRY_MAP[rawName];
    if (key) {
      casualties[key] = { killed: parseNum(match[2]), wounded: parseNum(match[3]) };
    }
  }

  // Loose match for remaining countries
  for (const [name, key] of Object.entries(COUNTRY_MAP)) {
    if (casualties[key]) continue;
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(
      escaped + '[\\s\\S]{0,50}?killed:\\s*([\\d,]+)[\\s\\S]{0,30}?injured:\\s*([\\d,]+|hundreds|thousands)',
      'i',
    );
    const m = re.exec(text);
    if (m) {
      casualties[key] = { killed: parseNum(m[1]), wounded: parseNum(m[2]) };
    }
  }

  return casualties;
}

export default async function handler(req, res) {
  try {
    const response = await fetch(TRACKER_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,*/*',
      },
    });

    if (!response.ok) {
      res.status(502).json({ error: `Al Jazeera HTTP ${response.status}` });
      return;
    }

    const html = await response.text();
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const casualties = parseCasualties(text);

    if (Object.keys(casualties).length === 0) {
      res.status(502).json({ error: 'No casualty data extracted' });
      return;
    }

    const output = {
      updatedAt: new Date().toISOString(),
      source: 'Al Jazeera Death Toll Tracker',
      casualties,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(output);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}

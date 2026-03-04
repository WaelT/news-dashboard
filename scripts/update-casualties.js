#!/usr/bin/env node

/**
 * Fetches casualty data from Al Jazeera death toll tracker,
 * parses numbers, and writes public/casualties.json.
 *
 * Usage: node scripts/update-casualties.js
 * Requires: Node 18+ (native fetch)
 */

import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '..', 'public', 'casualties.json');

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

// Map page text → our internal country key
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

const TRACKER_URL =
  'https://www.aljazeera.com/news/2026/3/1/us-israel-attacks-on-iran-death-toll-and-injuries-live-tracker';

/**
 * Parse the Al Jazeera tracker format:
 *   "Country – killed: X, injured: Y"
 * Captures only short country names (up to 4 words) right before the dash.
 */
function parseTrackerFormat(text) {
  const casualties = {};

  // Match "killed: N" and "injured: N" pairs, then look back for country name
  const pattern =
    /(?:^|[.\n])\s*((?:[A-Z][a-z]+\.?\s*){1,4})\s*[\u2013\u2014–—-]\s*killed:\s*([\d,]+)\s*[,.]?\s*injured:\s*([\d,]+|hundreds|thousands)/g;

  let match;
  while ((match = pattern.exec(text)) !== null) {
    const rawName = match[1].trim().toLowerCase();
    const killed = parseNum(match[2]);
    const wounded = parseNum(match[3]);

    const key = COUNTRY_MAP[rawName];
    if (key) {
      casualties[key] = { killed, wounded };
      console.log(`  ${key}: ${killed} killed, ${wounded} wounded`);
    } else {
      console.log(`  (unmatched: "${rawName}" → ${killed}/${wounded})`);
    }
  }

  // Second pass: try looser pattern — find "killed: N" after country name anywhere
  for (const [name, key] of Object.entries(COUNTRY_MAP)) {
    if (casualties[key]) continue;
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Allow up to 50 chars of noise between country name and "killed:"
    const re = new RegExp(
      escaped + '[\\s\\S]{0,50}?killed:\\s*([\\d,]+)[\\s\\S]{0,30}?injured:\\s*([\\d,]+|hundreds|thousands)',
      'i',
    );
    const m = re.exec(text);
    if (m) {
      casualties[key] = { killed: parseNum(m[1]), wounded: parseNum(m[2]) };
      console.log(`  ${key}: ${casualties[key].killed} killed, ${casualties[key].wounded} wounded (loose match)`);
    }
  }

  return casualties;
}

/**
 * Fallback: search for "N killed" / "N wounded" near country mentions.
 */
function parseProximityFormat(text) {
  const casualties = {};
  const plainText = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

  for (const [name, key] of Object.entries(COUNTRY_MAP)) {
    const regex = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let m;
    while ((m = regex.exec(plainText)) !== null) {
      const start = Math.max(0, m.index - 300);
      const end = Math.min(plainText.length, m.index + 300);
      const window = plainText.substring(start, end).toLowerCase();

      let killed = 0;
      let wounded = 0;

      const kMatch = /(\d[\d,]*)\s*(?:people\s+)?(?:killed|dead|deaths)/i.exec(window);
      if (kMatch) killed = parseNum(kMatch[1]);

      const wMatch = /(\d[\d,]*)\s*(?:people\s+)?(?:wounded|injured)/i.exec(window);
      if (wMatch) wounded = parseNum(wMatch[1]);

      if ((killed > 0 || wounded > 0) && (!casualties[key] || killed > (casualties[key].killed || 0))) {
        casualties[key] = {
          killed: killed || (casualties[key]?.killed ?? 0),
          wounded: wounded || (casualties[key]?.wounded ?? 0),
        };
      }
    }
  }

  return casualties;
}

function parseNum(str) {
  if (!str) return 0;
  const s = str.toLowerCase().trim();
  if (s === 'hundreds') return 500;
  if (s === 'thousands') return 2000;
  const n = parseInt(s.replace(/,/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

async function fetchPage(url) {
  console.log(`  Fetching: ${url}`);
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

function loadExisting() {
  try {
    return JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'));
  } catch {
    return null;
  }
}

async function main() {
  console.log('Updating casualty data...\n');

  let casualties = {};
  let source = '';

  // Try Al Jazeera death toll tracker (structured format)
  console.log('[Al Jazeera Tracker]');
  try {
    const html = await fetchPage(TRACKER_URL);
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

    // Try structured "Country – killed: X, injured: Y" format first
    casualties = parseTrackerFormat(text);

    if (Object.keys(casualties).length === 0) {
      console.log('  Structured format not found, trying proximity parsing...');
      casualties = parseProximityFormat(html);
    }

    if (Object.keys(casualties).length > 0) {
      source = 'Al Jazeera Death Toll Tracker';
    }
  } catch (err) {
    console.warn(`  Tracker fetch failed: ${err.message}`);
  }

  // Fallback: try other Al Jazeera pages
  if (Object.keys(casualties).length === 0) {
    console.log('\n[Al Jazeera Fallback]');
    const fallbackUrls = [
      'https://www.aljazeera.com/where/iran/',
      'https://www.aljazeera.com/tag/iran/',
    ];
    for (const url of fallbackUrls) {
      try {
        const html = await fetchPage(url);
        const data = parseProximityFormat(html);
        if (Object.keys(data).length > 0) {
          casualties = data;
          source = 'Al Jazeera';
          break;
        }
      } catch (err) {
        console.warn(`  Fallback failed (${url}): ${err.message}`);
      }
    }
  }

  if (Object.keys(casualties).length > 0) {
    const output = {
      updatedAt: new Date().toISOString(),
      source,
      casualties,
    };

    writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n');
    console.log(`\nWrote ${OUTPUT_PATH}`);
    console.log(`Source: ${source}`);
    console.log(`Countries: ${Object.keys(casualties).join(', ')}`);
  } else {
    const existing = loadExisting();
    if (existing) {
      console.log('\nNo new data extracted. Keeping existing casualties.json.');
    } else {
      console.log('\nNo data extracted. Dashboard will use hardcoded defaults.');
    }
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

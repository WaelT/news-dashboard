#!/usr/bin/env node
/**
 * Scrapes latest casualty figures from Wikipedia "2026 Iran war"
 * casualties-by-country table.
 *
 * Updates both public/casualties.json and DEFAULT_CASUALTIES in ImpactTracker.jsx
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Map Wikipedia country names to our keys
const COUNTRY_MAP = {
  'iran': 'iran',
  'israel': 'israel',
  'united states': 'usa',
  'bahrain': 'bahrain',
  'iraq': 'iraq',
  'jordan': 'jordan',
  'kuwait': 'kuwait',
  'lebanon': 'lebanon',
  'oman': 'oman',
  'qatar': 'qatar',
  'saudi arabia': 'saudi',
  'united arab emirates': 'uae',
  'yemen': 'yemen',
  'syria': 'syria',
  'palestine': 'palestine',
  'state of palestine': 'palestine',
  'palestine (west bank)': 'palestine',
  'west bank': 'palestine',
  'turkey': 'turkey',
  'france': 'france',
  'philippines': 'philippines',
  'azerbaijan': 'azerbaijan',
  // The dedicated casualties article lists armed forces as their own rows
  'united states military': 'usa',
  'french military': 'france',
};

// Wikipedia keeps splitting the main article up. The table now lives here; the
// main article's section only links to it.
const CASUALTIES_PAGE = 'Casualties of the 2026 Iran war';

function extractFirstNum(text) {
  if (!text) return 0;
  // Prefer data-sort-value if present (Wikipedia's canonical numeric value)
  const sortMatch = text.match(/data-sort-value\s*=\s*"?(\d+)/);
  if (sortMatch) return parseInt(sortMatch[1], 10);
  // Handle ranges like "1,145-4,145" — take the first number
  const cleaned = text.replace(/,/g, '');
  const m = cleaned.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

async function findCasualtiesSectionIndex() {
  const url = 'https://en.wikipedia.org/w/api.php?action=parse&page=2026+Iran+war&prop=sections&format=json';
  const res = await fetch(url, { headers: { 'User-Agent': 'NewsDashboard/1.0' } });
  if (!res.ok) throw new Error(`Wikipedia sections API ${res.status}`);
  const data = await res.json();
  const sections = data?.parse?.sections || [];
  // Section has been renamed several times: "Casualties by country",
  // "Casualties by citizenship", "Casualties and damages". Prefer the specific
  // names, then fall back to anything mentioning casualties.
  const named = (s, ...needles) => s.line && needles.some(n => s.line.toLowerCase().includes(n));
  const match =
    sections.find(s => named(s, 'casualties by country', 'casualties by citizenship')) ||
    sections.find(s => named(s, 'casualties'));
  if (!match) return null;
  console.log(`Found section "${match.line}" at index ${match.index}`);
  return match.index;
}

/** First wikitable that looks like the by-country table (has Killed + an Iran row). */
function findCasualtiesTable(text) {
  let from = 0;
  for (;;) {
    const start = text.indexOf('{|', from);
    if (start === -1) return null;
    const end = text.indexOf('|}', start);
    if (end === -1) return null;
    const table = text.substring(start, end);
    if (/!\s*Killed/i.test(table) && /\n\|+\s*(\{\{[Ff]lag\|)?\[*Iran\b/.test(table)) return table;
    from = end + 2;
  }
}

async function scrapeWikipedia() {
  // First try the main article section
  const sectionIndex = await findCasualtiesSectionIndex();
  let text = '';
  if (sectionIndex !== null) {
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=2026+Iran+war&section=${sectionIndex}&prop=wikitext&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'NewsDashboard/1.0' } });
    if (!res.ok) throw new Error(`Wikipedia API ${res.status}`);
    const data = await res.json();
    text = data?.parse?.wikitext?.['*'] || '';
  }

  let tableText = findCasualtiesTable(text);

  // If the section has no table, it links out to the dedicated casualties article
  // via {{Excerpt|...}}, {{Main|...}}, or similar — follow the link
  if (!tableText) {
    const targets = [...text.matchAll(/\{\{(?:Excerpt|Main|Further|See also)\|([^}]+)\}\}/gi)]
      .flatMap(m => m[1].split('|'))
      .map(t => t.split('#')[0].trim());
    const targetPage = targets.find(t => /^casualties\b/i.test(t)) || CASUALTIES_PAGE;
    console.log(`Section has no table, fetching from: ${targetPage}`);
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(targetPage)}&prop=wikitext&format=json&redirects=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'NewsDashboard/1.0' } });
    if (!res.ok) throw new Error(`Wikipedia API ${res.status} for ${targetPage}`);
    const data = await res.json();
    tableText = findCasualtiesTable(data?.parse?.wikitext?.['*'] || '');
  }

  if (!tableText) throw new Error('Casualties table not found');

  // Split into rows by |-
  const rows = tableText.split(/\n\|-\s*\n/);

  const casualties = {};

  for (const row of rows) {
    // The table uses plain-text country names (e.g. "|Iran", "|Lebanon"),
    // NOT {{Flag|CountryName}} templates. Skip header rows that start with "!"
    // Split row into cells by | at start of line
    const cells = row.split(/\n\|/).map(c => c.trim());

    // cells[0] might contain leading text or the country name
    // The first cell after splitting by \n| is the country name
    // Skip rows where cells start with "!" (header/total rows)
    if (cells.length < 3) continue;

    // The first cell is the country name, possibly as {{Flag|Name}} or plain text
    let rawCountry = cells[0];
    // If the row starts with ! it's a header row (e.g. "Total") — skip it
    if (rawCountry.startsWith('!') || row.trimStart().startsWith('!')) continue;

    // Strip leading pipe character(s) from the country name
    rawCountry = rawCountry.replace(/^\|+/, '');
    // Handle {{Flag|CountryName}} or {{Flag|CountryName|name=...}} templates
    const flagMatch = rawCountry.match(/\{\{[Ff]lag\|([^|}]+)/);
    if (flagMatch) {
      rawCountry = flagMatch[1].trim();
    }
    // Clean up: remove any residual wiki markup like [[link|display]]
    rawCountry = rawCountry.replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, '$2').trim();
    // Remove any remaining template syntax
    rawCountry = rawCountry.replace(/\{\{[^}]*\}\}/g, '').trim();
    const countryName = rawCountry.toLowerCase();
    const key = COUNTRY_MAP[countryName];
    if (!key) {
      if (countryName && countryName !== '' && !countryName.startsWith('{')) {
        console.log(`Unknown country: ${countryName}`);
      }
      continue;
    }

    // cells[1] = killed, cells[2] = injured, cells[3] = missing
    // Some cells have data-sort-value or {{Efn}} annotations
    let killedCell = cells[1] || '';
    let injuredCell = cells[2] || '';

    // For Iran, use data-sort-value from killed cell if available (most reliable)
    // Do NOT use HRANA sub-detail regex as it can match sub-incidents (e.g. "180 civilians killed in Minab")
    if (key === 'iran' && killedCell) {
      const sortMatch = killedCell.match(/data-sort-value\s*=\s*"?(\d+)/);
      if (sortMatch) {
        killedCell = sortMatch[1];
      }
    }

    // A country can appear on more than one row (e.g. "French military" and
    // France under UNIFIL) — add them up rather than letting the last one win
    const prev = casualties[key] || { killed: 0, wounded: 0 };
    casualties[key] = {
      killed: prev.killed + extractFirstNum(killedCell),
      wounded: prev.wounded + extractFirstNum(injuredCell),
    };
  }

  return casualties;
}

function updateFiles(casualties) {
  // Ensure all keys exist
  const ALL_KEYS = ['iran', 'israel', 'usa', 'lebanon', 'yemen', 'iraq', 'uae', 'kuwait', 'bahrain', 'qatar', 'saudi', 'jordan', 'oman', 'syria', 'palestine', 'turkey', 'france', 'philippines', 'azerbaijan'];
  for (const key of ALL_KEYS) {
    if (!casualties[key]) casualties[key] = { killed: 0, wounded: 0 };
  }

  // 1. Update public/casualties.json
  const jsonPath = resolve(ROOT, 'public/casualties.json');
  const jsonData = {
    updatedAt: new Date().toISOString(),
    source: 'Wikipedia, Al Jazeera, HRANA, Reuters',
    casualties,
  };
  writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2) + '\n');
  console.log('Updated public/casualties.json');

  // 2. Update DEFAULT_CASUALTIES in ImpactTracker.jsx
  // First read existing values — casualties only go up, never decrease
  const trackerPath = resolve(ROOT, 'src/components/ImpactTracker.jsx');
  let code = readFileSync(trackerPath, 'utf-8');
  const existingMatch = code.match(/const DEFAULT_CASUALTIES = \{([\s\S]*?)\};/);
  if (existingMatch) {
    const existing = {};
    for (const m of existingMatch[1].matchAll(/(\w+):\s*\{\s*killed:\s*(\d+),\s*wounded:\s*(\d+)\s*\}/g)) {
      existing[m[1]] = { killed: parseInt(m[2]), wounded: parseInt(m[3]) };
    }
    for (const key of ALL_KEYS) {
      if (existing[key] && casualties[key]) {
        casualties[key].killed = Math.max(casualties[key].killed, existing[key].killed);
        casualties[key].wounded = Math.max(casualties[key].wounded, existing[key].wounded);
      }
    }
    console.log('Merged with existing (took max of each)');
  }

  const entries = ALL_KEYS
    .map((key) => {
      const { killed, wounded } = casualties[key];
      return `  ${key}: { killed: ${killed}, wounded: ${wounded} },`;
    })
    .join('\n');

  const newBlock = `const DEFAULT_CASUALTIES = {\n${entries}\n};`;

  code = code.replace(
    /const DEFAULT_CASUALTIES = \{[\s\S]*?\};/,
    newBlock
  );

  // Stamp the "as of" date shown in the panel header
  const asOf = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).toUpperCase();
  code = code.replace(/const DATA_AS_OF = '[^']*';/, `const DATA_AS_OF = '${asOf}';`);

  writeFileSync(trackerPath, code);
  console.log('Updated ImpactTracker.jsx DEFAULT_CASUALTIES');
}

async function main() {
  console.log('Fetching casualty data from Wikipedia...');

  let casualties;
  try {
    casualties = await scrapeWikipedia();
    console.log('Parsed:', JSON.stringify(casualties, null, 2));
  } catch (err) {
    console.error('Wikipedia scrape failed:', err.message);
    process.exit(1);
  }

  // Sanity check — Iran killed should be at least 1000+
  if (!casualties.iran || casualties.iran.killed < 500) {
    console.error(`ERROR: Iran killed is ${casualties.iran?.killed} — parsing likely failed. Aborting.`);
    process.exit(1);
  }

  updateFiles(casualties);
  console.log('Done!');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

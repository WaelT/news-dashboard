#!/usr/bin/env node
/**
 * Scrapes daily missile/drone launch data from Wikipedia "2026 Iran war"
 * and updates src/data/launchData.js with the latest figures.
 *
 * Looks for a table with columns: Date, Missiles, Drones/UAVs, Intercepted, Targets
 * Falls back to existing data if scrape fails or returns no rows.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LAUNCH_DATA_PATH = resolve(ROOT, 'src/data/launchData.js');

const WIKI_API = 'https://en.wikipedia.org/w/api.php?action=parse&page=2026+Iran+war&prop=wikitext&format=json';

// Normalize target country names from Wikipedia
const TARGET_NORMALIZE = {
  'israel': 'Israel',
  'uae': 'UAE',
  'united arab emirates': 'UAE',
  'qatar': 'Qatar',
  'kuwait': 'Kuwait',
  'bahrain': 'Bahrain',
  'saudi arabia': 'Saudi Arabia',
  'jordan': 'Jordan',
  'iraq': 'Iraq',
  'oman': 'Oman',
};

function extractNum(text) {
  if (!text) return 0;
  const cleaned = text.replace(/,/g, '').replace(/\[.*?\]/g, '');
  const m = cleaned.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function parseDate(text) {
  if (!text) return null;
  const cleaned = text.replace(/\[.*?\]/g, '').trim();
  // Try ISO-style: 2026-03-05
  const isoMatch = cleaned.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return isoMatch[0];
  // Try "March 5, 2026" or "5 March 2026"
  const d = new Date(cleaned);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return null;
}

function parseTargets(text) {
  if (!text) return [];
  // Remove wiki markup
  const cleaned = text
    .replace(/\{\{Flag\|([^}]+)\}\}/gi, '$1')
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
    .replace(/\[.*?\]/g, '');
  return cleaned
    .split(/[,;]+/)
    .map((t) => {
      const key = t.trim().toLowerCase();
      return TARGET_NORMALIZE[key] || null;
    })
    .filter(Boolean);
}

async function scrapeWikipedia() {
  const res = await fetch(WIKI_API, { headers: { 'User-Agent': 'NewsDashboard/1.0' } });
  if (!res.ok) throw new Error(`Wikipedia API ${res.status}`);
  const data = await res.json();
  const wikitext = data?.parse?.wikitext?.['*'] || '';

  // Find the missile/drone launches table — look for headers mentioning missiles and drones
  const tablePatterns = [
    /missile.*drone.*launch/i,
    /daily.*launch/i,
    /drone.*missile.*attack/i,
    /launch.*data/i,
    /missile.*attack/i,
  ];

  let tableStart = -1;
  for (const pat of tablePatterns) {
    const match = wikitext.match(pat);
    if (match) {
      tableStart = match.index;
      break;
    }
  }

  if (tableStart === -1) {
    throw new Error('Launch data table not found in Wikipedia article');
  }

  // Find the wikitable start before or after this header
  const wikiTableStart = wikitext.indexOf('{|', Math.max(0, tableStart - 500));
  if (wikiTableStart === -1) throw new Error('Wiki table markup not found');
  const tableEnd = wikitext.indexOf('|}', wikiTableStart);
  if (tableEnd === -1) throw new Error('Table end not found');

  const tableText = wikitext.substring(wikiTableStart, tableEnd);
  const rows = tableText.split(/\n\|-\s*\n/);

  const launches = [];

  for (const row of rows) {
    const cells = row.split(/\n\|/).map((c) => c.trim());
    if (cells.length < 4) continue;

    const date = parseDate(cells[0]) || parseDate(cells[1]);
    if (!date) continue;

    // Try to extract missiles, drones, intercepted from subsequent cells
    let missiles = 0, drones = 0, intercepted = 0;
    let targets = [];

    // Scan cells for numeric data
    const numericCells = cells.slice(1).filter((c) => /\d/.test(c));
    if (numericCells.length >= 2) {
      missiles = extractNum(numericCells[0]);
      drones = extractNum(numericCells[1]);
      intercepted = numericCells.length >= 3 ? extractNum(numericCells[2]) : 0;
    }

    // Last cell or cell with country names = targets
    for (const cell of cells.slice(1)) {
      const parsed = parseTargets(cell);
      if (parsed.length > 0) {
        targets = parsed;
      }
    }

    if (missiles > 0 || drones > 0) {
      launches.push({ date, missiles, drones, intercepted, targets });
    }
  }

  return launches.sort((a, b) => a.date.localeCompare(b.date));
}

function buildFileContent(launches) {
  const entries = launches.map((d) => {
    const targets = d.targets.map((t) => `'${t}'`).join(', ');
    return `  { date: '${d.date}', missiles: ${d.missiles}, drones: ${d.drones}, intercepted: ${d.intercepted}, targets: [${targets}] },`;
  });

  return `export const dailyLaunches = [\n${entries.join('\n')}\n];\n\nexport default dailyLaunches;\n`;
}

async function main() {
  console.log('Fetching launch data from Wikipedia...');

  let launches;
  try {
    launches = await scrapeWikipedia();
    console.log(`Parsed ${launches.length} days of launch data`);
    for (const d of launches) {
      console.log(`  ${d.date}: ${d.missiles} missiles, ${d.drones} drones, ${d.intercepted} intercepted → [${d.targets.join(', ')}]`);
    }
  } catch (err) {
    console.error('Wikipedia scrape failed:', err.message);
    console.error('Keeping existing data.');
    process.exit(1);
  }

  if (launches.length === 0) {
    console.error('ERROR: No launch data rows parsed. Aborting to keep existing data.');
    process.exit(1);
  }

  const content = buildFileContent(launches);
  writeFileSync(LAUNCH_DATA_PATH, content);
  console.log(`Updated ${LAUNCH_DATA_PATH}`);
  console.log('Done!');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

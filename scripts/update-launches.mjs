#!/usr/bin/env node
/**
 * Scrapes daily missile/drone launch data from Wikipedia "2026 Iran war".
 *
 * The Wikipedia article does NOT have a structured launch table.
 * Data is embedded in prose within daily sections (=== 28 February ===, etc.).
 * This script extracts what it can from the prose, but the data is inherently
 * incomplete — Wikipedia only mentions cumulative totals and scattered figures.
 *
 * Strategy:
 *   1. Parse each daily section for missile/drone/intercept numbers
 *   2. Extract target countries mentioned in each section
 *   3. Merge scraped data with existing hardcoded data (prefer existing values
 *      for days that already have data, only add new days)
 *
 * If scraping fails or produces bad data, existing data is preserved.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LAUNCH_DATA_PATH = resolve(ROOT, 'src/data/launchData.js');

const WIKI_API = 'https://en.wikipedia.org/w/api.php?action=parse&page=2026+Iran+war&prop=wikitext&format=json';

const TARGET_COUNTRIES = [
  'Israel', 'UAE', 'United Arab Emirates', 'Qatar', 'Kuwait',
  'Bahrain', 'Saudi Arabia', 'Jordan', 'Iraq', 'Oman', 'Cyprus',
];

const TARGET_NORMALIZE = {
  'united arab emirates': 'UAE',
};

function normalizeTarget(name) {
  const lower = name.toLowerCase();
  return TARGET_NORMALIZE[lower] || name;
}

function extractNum(text) {
  return parseInt(text.replace(/,/g, ''), 10) || 0;
}

function parseDateHeader(header) {
  // "28 February" or "1 March" → "2026-02-28" or "2026-03-01"
  const months = { january: '01', february: '02', march: '03', april: '04', may: '05', june: '06' };
  const m = header.trim().match(/^(\d{1,2})\s+(\w+)$/i);
  if (!m) return null;
  const day = m[1].padStart(2, '0');
  const month = months[m[2].toLowerCase()];
  if (!month) return null;
  return `2026-${month}-${day}`;
}

function parseExistingData() {
  try {
    const content = readFileSync(LAUNCH_DATA_PATH, 'utf-8');
    const entries = [];
    const entryPattern = /\{\s*date:\s*'([^']+)',\s*missiles:\s*(\d+),\s*drones:\s*(\d+),\s*intercepted:\s*(\d+),\s*targets:\s*\[([^\]]*)\]\s*\}/g;
    let match;
    while ((match = entryPattern.exec(content)) !== null) {
      const targets = match[5]
        .split(',')
        .map(t => t.trim().replace(/'/g, ''))
        .filter(Boolean);
      entries.push({
        date: match[1],
        missiles: parseInt(match[2], 10),
        drones: parseInt(match[3], 10),
        intercepted: parseInt(match[4], 10),
        targets,
      });
    }
    return entries;
  } catch {
    return [];
  }
}

function extractSectionTargets(section) {
  const targets = new Set();
  for (const country of TARGET_COUNTRIES) {
    // Match country name not inside wiki markup for unrelated things
    if (section.includes(country)) {
      targets.add(normalizeTarget(country));
    }
  }
  // Also check for [[country]] wiki links
  const linkPattern = /\[\[([^\]|]+)/g;
  let m;
  while ((m = linkPattern.exec(section)) !== null) {
    const name = m[1].trim();
    if (TARGET_COUNTRIES.some(c => c.toLowerCase() === name.toLowerCase())) {
      targets.add(normalizeTarget(name));
    }
  }
  return [...targets];
}

function extractLaunchNumbers(section) {
  // Look for patterns like "X missiles", "X drones", "X ballistic missiles", "intercepted X"
  let missiles = 0, drones = 0, intercepted = 0;

  // Missile counts
  const missilePatterns = [
    /(\d[\d,]*)\s*(?:ballistic\s+)?missiles?/gi,
    /(\d[\d,]*)\s*ballistic/gi,
  ];
  for (const pat of missilePatterns) {
    let m;
    while ((m = pat.exec(section)) !== null) {
      const n = extractNum(m[1]);
      if (n > missiles && n < 10000) missiles = n;
    }
  }

  // Drone counts
  const dronePatterns = [
    /(\d[\d,]*)\s*(?:drones?|UAVs?)/gi,
  ];
  for (const pat of dronePatterns) {
    let m;
    while ((m = pat.exec(section)) !== null) {
      const n = extractNum(m[1]);
      if (n > drones && n < 50000) drones = n;
    }
  }

  // Intercept counts
  const interceptPatterns = [
    /intercept\w*\s+(\d[\d,]*)/gi,
    /(\d[\d,]*)\s*(?:were\s+)?intercept\w*/gi,
  ];
  for (const pat of interceptPatterns) {
    let m;
    while ((m = pat.exec(section)) !== null) {
      const n = extractNum(m[1]);
      if (n > intercepted && n < 50000) intercepted = n;
    }
  }

  return { missiles, drones, intercepted };
}

async function scrapeWikipedia() {
  const res = await fetch(WIKI_API, { headers: { 'User-Agent': 'NewsDashboard/1.0' } });
  if (!res.ok) throw new Error(`Wikipedia API ${res.status}`);
  const data = await res.json();
  const wikitext = data?.parse?.wikitext?.['*'] || '';

  // Split by daily section headers: === 28 February ===
  const daySections = [];
  const dayPattern = /===\s*(\d{1,2}\s+(?:February|March|April|May))\s*===/gi;
  let match;
  const matches = [];
  while ((match = dayPattern.exec(wikitext)) !== null) {
    matches.push({ header: match[1], index: match.index + match[0].length });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : wikitext.indexOf('== ', start);
    const section = wikitext.substring(start, end > start ? end : start + 5000);
    const date = parseDateHeader(matches[i].header);
    if (!date) continue;

    const targets = extractSectionTargets(section);
    const nums = extractLaunchNumbers(section);

    daySections.push({
      date,
      ...nums,
      targets,
    });
  }

  return daySections;
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

  const existing = parseExistingData();
  console.log(`Existing data: ${existing.length} days`);
  const existingDates = new Set(existing.map(d => d.date));

  let scraped;
  try {
    scraped = await scrapeWikipedia();
    console.log(`Scraped ${scraped.length} daily sections from Wikipedia`);
    for (const d of scraped) {
      console.log(`  ${d.date}: ${d.missiles} missiles, ${d.drones} drones, ${d.intercepted} intercepted → [${d.targets.join(', ')}]`);
    }
  } catch (err) {
    console.error('Wikipedia scrape failed:', err.message);
    console.error('Keeping existing data.');
    process.exit(0); // Exit cleanly — no changes
  }

  // Merge: keep existing data, only add new days that have meaningful data
  let added = 0;
  const merged = [...existing];
  for (const day of scraped) {
    if (existingDates.has(day.date)) continue;
    // Only add if there's actual launch data (not just targets from prose)
    if (day.missiles === 0 && day.drones === 0) continue;
    merged.push(day);
    added++;
    console.log(`NEW: ${day.date} — ${day.missiles} missiles, ${day.drones} drones`);
  }

  // Note: we do NOT overwrite targets for existing days because the scraper
  // picks up any country mentioned in a section, not just actual launch targets.
  // Existing curated targets are more accurate.

  merged.sort((a, b) => a.date.localeCompare(b.date));

  if (added === 0) {
    console.log('No new days to add. File unchanged.');
    process.exit(0);
  }

  const content = buildFileContent(merged);
  writeFileSync(LAUNCH_DATA_PATH, content);
  console.log(`Updated ${LAUNCH_DATA_PATH} — added ${added} new day(s)`);
  console.log('Done!');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

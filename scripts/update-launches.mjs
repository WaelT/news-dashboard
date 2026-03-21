#!/usr/bin/env node
/**
 * Scrapes latest missile/drone launch data from Wikipedia "2026 Iran war"
 * "Attacks by ballistic missiles and drones/UAVs" table.
 *
 * Updates countryBreakdown in src/data/launchData.js
 * Daily launches remain manually curated (no structured daily data on Wikipedia).
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Map Wikipedia country names to our keys
const COUNTRY_MAP = {
  'united arab emirates': 'UAE',
  'saudi arabia': 'Saudi Arabia',
  'qatar': 'Qatar',
  'bahrain': 'Bahrain',
  'oman': 'Oman',
  'kuwait': 'Kuwait',
  'jordan': 'Jordan',
  'iraq': 'Iraq',
  'israel': 'Israel',
};

function extractNum(text) {
  if (!text) return 0;
  const cleaned = text.replace(/,/g, '').replace(/\+/g, '');
  // Handle data-sort-value
  const sortMatch = cleaned.match(/data-sort-value\s*=\s*"?(\d+)/);
  if (sortMatch) return parseInt(sortMatch[1], 10);
  const m = cleaned.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

async function findSectionIndex() {
  const url = 'https://en.wikipedia.org/w/api.php?action=parse&page=2026+Iran+war&prop=sections&format=json';
  const res = await fetch(url, { headers: { 'User-Agent': 'NewsDashboard/1.0' } });
  if (!res.ok) throw new Error(`Wikipedia sections API ${res.status}`);
  const data = await res.json();
  const sections = data?.parse?.sections || [];
  const match = sections.find(s => s.line && s.line.toLowerCase().includes('ballistic missiles'));
  if (!match) throw new Error('Could not find missile/drone section in article');
  console.log(`Found section "${match.line}" at index ${match.index}`);
  return match.index;
}

async function scrapeLaunches() {
  const sectionIndex = await findSectionIndex();
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=2026+Iran+war&section=${sectionIndex}&prop=wikitext&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'NewsDashboard/1.0' } });
  if (!res.ok) throw new Error(`Wikipedia API ${res.status}`);
  const data = await res.json();
  const text = data?.parse?.wikitext?.['*'] || '';

  if (!text.includes('Ballistic missiles') && !text.includes('ballistic missiles')) {
    throw new Error('Missile/drone table not found in section');
  }

  const rows = text.split(/\n\|-\s*\n?/);

  const missiles = [];
  const drones = [];

  for (const row of rows) {
    const cells = row.split(/\n\|/).map(c => c.trim());
    if (cells.length < 3) continue;

    let rawCountry = cells[0].replace(/^\|/, '');
    // Skip header/total rows
    if (rawCountry.startsWith('!') || row.trimStart().startsWith('!')) continue;

    // Handle [[Link|Display]] or [[Link]]
    rawCountry = rawCountry.replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, '$2').trim();
    // Handle {{Flag|Name}} templates
    const flagMatch = rawCountry.match(/\{\{[Ff]lag\|([^|}]+)/);
    if (flagMatch) rawCountry = flagMatch[1].trim();
    // Remove remaining templates
    rawCountry = rawCountry.replace(/\{\{[^}]*\}\}/g, '').trim();

    const countryKey = COUNTRY_MAP[rawCountry.toLowerCase()];
    if (!countryKey) {
      if (rawCountry && !rawCountry.startsWith('{') && rawCountry !== '' && rawCountry !== '+') {
        console.log(`Skipping country: ${rawCountry}`);
      }
      continue;
    }

    const missileCount = extractNum(cells[1]);
    const droneCount = extractNum(cells[2]);

    if (missileCount > 0) missiles.push({ country: countryKey, count: missileCount });
    if (droneCount > 0) drones.push({ country: countryKey, count: droneCount });
  }

  // Sort descending by count
  missiles.sort((a, b) => b.count - a.count);
  drones.sort((a, b) => b.count - a.count);

  return { missiles, drones };
}

function updateLaunchData(breakdown) {
  const filePath = resolve(ROOT, 'src/data/launchData.js');
  let code = readFileSync(filePath, 'utf-8');

  // Read existing values — only increase, never decrease
  const existingMissiles = {};
  const existingDrones = {};

  const missileMatch = code.match(/missiles:\s*\[([\s\S]*?)\]/);
  if (missileMatch) {
    for (const m of missileMatch[1].matchAll(/country:\s*'([^']+)',\s*count:\s*(\d+)/g)) {
      existingMissiles[m[1]] = parseInt(m[2], 10);
    }
  }
  const droneMatch = code.match(/drones:\s*\[([\s\S]*?)\]/);
  if (droneMatch) {
    for (const m of droneMatch[1].matchAll(/country:\s*'([^']+)',\s*count:\s*(\d+)/g)) {
      existingDrones[m[1]] = parseInt(m[2], 10);
    }
  }

  // Merge: take max
  for (const entry of breakdown.missiles) {
    entry.count = Math.max(entry.count, existingMissiles[entry.country] || 0);
  }
  // Add any existing countries not in scraped data
  for (const [country, count] of Object.entries(existingMissiles)) {
    if (!breakdown.missiles.find(e => e.country === country)) {
      breakdown.missiles.push({ country, count });
    }
  }

  for (const entry of breakdown.drones) {
    entry.count = Math.max(entry.count, existingDrones[entry.country] || 0);
  }
  for (const [country, count] of Object.entries(existingDrones)) {
    if (!breakdown.drones.find(e => e.country === country)) {
      breakdown.drones.push({ country, count });
    }
  }

  // Re-sort
  breakdown.missiles.sort((a, b) => b.count - a.count);
  breakdown.drones.sort((a, b) => b.count - a.count);

  // Build replacement strings
  const fmtArr = (arr) => arr.map(e => `    { country: '${e.country}', count: ${e.count} },`).join('\n');

  const newBlock = `export const countryBreakdown = {\n  missiles: [\n${fmtArr(breakdown.missiles)}\n  ],\n  drones: [\n${fmtArr(breakdown.drones)}\n  ],\n};`;

  code = code.replace(
    /export const countryBreakdown = \{[\s\S]*?\};/,
    newBlock
  );

  writeFileSync(filePath, code);
  console.log('Updated src/data/launchData.js countryBreakdown');
}

async function main() {
  console.log('Fetching missile/drone data from Wikipedia...');

  let breakdown;
  try {
    breakdown = await scrapeLaunches();
    console.log('Missiles by country:', JSON.stringify(breakdown.missiles, null, 2));
    console.log('Drones by country:', JSON.stringify(breakdown.drones, null, 2));
  } catch (err) {
    console.error('Wikipedia scrape failed:', err.message);
    process.exit(1);
  }

  // Sanity check
  const totalMissiles = breakdown.missiles.reduce((s, e) => s + e.count, 0);
  const totalDrones = breakdown.drones.reduce((s, e) => s + e.count, 0);
  if (totalMissiles < 100) {
    console.error(`ERROR: Total missiles is ${totalMissiles} — parsing likely failed. Aborting.`);
    process.exit(1);
  }
  console.log(`Totals: ${totalMissiles} missiles, ${totalDrones} drones`);

  updateLaunchData(breakdown);
  console.log('Done!');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

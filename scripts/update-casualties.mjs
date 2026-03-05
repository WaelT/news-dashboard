#!/usr/bin/env node
/**
 * Scrapes latest casualty figures from Wikipedia "2026 Iran war" infobox.
 * Falls back to Al Jazeera death toll tracker for supplementary data.
 *
 * Updates both public/casualties.json and DEFAULT_CASUALTIES in ImpactTracker.jsx
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function extractNum(text) {
  if (!text) return 0;
  const m = text.replace(/,/g, '').match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

// --- Wikipedia scraper ---

async function scrapeWikipedia() {
  const url = 'https://en.wikipedia.org/w/api.php?action=parse&page=2026+Iran+war&prop=wikitext&format=json';
  const res = await fetch(url, { headers: { 'User-Agent': 'NewsDashboard/1.0' } });
  if (!res.ok) throw new Error(`Wikipedia API ${res.status}`);
  const data = await res.json();
  const text = data?.parse?.wikitext?.['*'] || '';

  const casualties = {};

  // Extract casualties1 (Israel/US/Coalition)
  const cas1Match = text.match(/casualties1\s*=[\s\S]*?(?=\|\s*casualties2)/);
  const cas1 = cas1Match?.[0] || '';

  // Extract casualties2 (Iran/proxies)
  const cas2Match = text.match(/casualties2\s*=[\s\S]*?(?=\|\s*casualties3)/);
  const cas2 = cas2Match?.[0] || '';

  // Extract casualties3 (non-belligerents)
  const cas3Match = text.match(/casualties3\s*=[\s\S]*?(?=\n\s*\}\})/);
  const cas3 = cas3Match?.[0] || '';

  // --- Parse casualties1: Israel, USA, Kurdistan ---

  // Israel: "12 people killed" and "1,274 injured"
  const israelBlock = cas1.match(/flagu\|Israel\}\}[\s\S]*?(?=\*\s*\{\{flagu|$)/)?.[0] || '';
  const israelKilled = israelBlock.match(/(\d[\d,]*)\s*(?:people\s+)?killed/i);
  const israelInjured = israelBlock.match(/([\d,]+)\s*injured/i);
  casualties.israel = {
    killed: extractNum(israelKilled?.[1]),
    wounded: extractNum(israelInjured?.[1]),
  };

  // USA: "6 military personnel killed" and "18 injured" + "2 DOD personnel injured"
  const usaBlock = cas1.match(/flagu\|United States\}\}[\s\S]*?(?=\*\s*\{\{flagu|----|\*\s*'''Per Iran|$)/)?.[0] || '';
  const usaKilled = usaBlock.match(/(\d+)\s*military personnel killed/i);
  const usaInjuredMatches = [...usaBlock.matchAll(/([\d,]+)\s*(?:DOD personnel\s+)?injured/gi)];
  let usaWounded = 0;
  for (const m of usaInjuredMatches) usaWounded += extractNum(m[1]);
  casualties.usa = {
    killed: extractNum(usaKilled?.[1]),
    wounded: usaWounded,
  };

  // Kuwait military from cas1 (naval personnel)
  const kuwaitMilBlock = cas1.match(/flagu\|Kuwait\}\}[\s\S]*?(?=\*\s*\{\{flagu|----|\*\s*'''|$)/)?.[0] || '';
  const kuwaitMilKilled = kuwaitMilBlock.match(/(\d+)\s*naval personnel killed/i);
  const kuwaitMilKilledNum = extractNum(kuwaitMilKilled?.[1]);

  // --- Parse casualties2: Iran, PMF/Iraq, Lebanon ---

  // Iran - try HRANA figures first (most detailed), then government, then Red Crescent
  const hranaBlock = cas2.match(/Human Rights Activists[\s\S]*?(?=----|\{\{Endplainlist|$)/i)?.[0] || '';
  const hranaKilled = hranaBlock.match(/([\d,]+)\s*civilians?\s*killed/i);
  const hranaWounded = hranaBlock.match(/([\d,]+)\s*injured/i);

  if (hranaKilled) {
    casualties.iran = {
      killed: extractNum(hranaKilled[1]),
      wounded: extractNum(hranaWounded?.[1]),
    };
  } else {
    // Fallback: first "X people killed" in cas2
    const iranKilled = cas2.match(/([\d,]+)\s*people killed/i);
    casualties.iran = {
      killed: extractNum(iranKilled?.[1]),
      wounded: 0,
    };
  }

  // PMF/Iraq: "20+ fighters killed, dozens injured"
  const pmfBlock = cas2.match(/Popular Mobilization Forces[\s\S]*?(?=----|\{\{Endplainlist|$)/i)?.[0] || '';
  const pmfKilled = pmfBlock.match(/([\d,]+)\+?\s*fighters?\s*killed/i);
  const pmfInjured = pmfBlock.match(/([\d,]+)\s*injured/i);
  casualties.iraq = {
    killed: extractNum(pmfKilled?.[1]),
    wounded: pmfInjured ? extractNum(pmfInjured[1]) : (pmfBlock.match(/dozens/i) ? 36 : 0),
  };

  // Lebanon: "72 people killed, 437 injured"
  const lebBlock = cas2.match(/flagu\|Lebanon\}\}[\s\S]*?(?=----|\{\{Endplainlist|$)/)?.[0] || '';
  const lebKilled = lebBlock.match(/([\d,]+)\s*people killed/i);
  const lebInjured = lebBlock.match(/([\d,]+)\s*injured/i);
  casualties.lebanon = {
    killed: extractNum(lebKilled?.[1]),
    wounded: extractNum(lebInjured?.[1]),
  };

  // --- Parse casualties3: UAE, Bahrain, Kuwait, Oman, Qatar, Jordan ---

  // Helper: extract from "flagdeco|Country}} N killed... N injured" pattern
  function parseCas3Country(country) {
    const re = new RegExp(`flagdeco\\|${country}\\}\\}[\\s\\S]*?(?=\\|\\s*\\{\\{flagdeco|$)`, 'i');
    const block = cas3.match(re)?.[0] || '';
    const killed = block.match(/([\d,]+)\s*(?:people|person|civilians?)?\s*killed/i);
    const injured = block.match(/([\d,]+)\s*(?:people\s+|others?\s+)?injured/i);
    return { killed: extractNum(killed?.[1]), wounded: extractNum(injured?.[1]) };
  }

  casualties.uae = parseCas3Country('UAE');
  casualties.bahrain = parseCas3Country('Bahrain');
  casualties.oman = parseCas3Country('Oman');

  const qatarData = parseCas3Country('Qatar');
  casualties.qatar = { killed: 0, wounded: qatarData.wounded || qatarData.killed };

  const jordanData = parseCas3Country('Jordan');
  casualties.jordan = { killed: 0, wounded: jordanData.wounded || jordanData.killed };

  // Kuwait: merge military (from cas1) + civilian (from cas3)
  const kuwaitCiv = parseCas3Country('Kuwait');
  casualties.kuwait = {
    killed: kuwaitCiv.killed + kuwaitMilKilledNum,
    wounded: kuwaitCiv.wounded,
  };

  return casualties;
}

// --- Al Jazeera tracker scraper (supplementary) ---

async function scrapeAlJazeera() {
  try {
    const url = 'https://www.aljazeera.com/news/2026/3/1/us-israel-attacks-on-iran-death-toll-and-injuries-live-tracker';
    const res = await fetch(url, { headers: { 'User-Agent': 'NewsDashboard/1.0' } });
    if (!res.ok) return {};
    const html = await res.text();

    // Al Jazeera tracker typically has structured data blocks
    // Only extract if we can find very specific patterns
    const casualties = {};

    // Look for table/structured data patterns like "Iran ... 1,045 ... killed"
    const iranKilled = html.match(/Iran[\s\S]{0,200}?<[^>]*>([\d,]+)<[^>]*>[\s\S]{0,50}?killed/i);
    const iranWounded = html.match(/Iran[\s\S]{0,200}?<[^>]*>([\d,]+)<[^>]*>[\s\S]{0,50}?(?:wounded|injured)/i);
    if (iranKilled) casualties.iran = { killed: extractNum(iranKilled[1]), wounded: extractNum(iranWounded?.[1]) };

    return casualties;
  } catch {
    return {};
  }
}

// --- Merge & write ---

function mergeData(wiki, aj) {
  const KEYS = ['iran', 'israel', 'usa', 'lebanon', 'yemen', 'iraq', 'uae', 'kuwait', 'bahrain', 'qatar', 'jordan', 'oman', 'syria', 'palestine'];

  const merged = {};
  for (const key of KEYS) {
    merged[key] = { killed: 0, wounded: 0 };
  }

  // Wikipedia is primary
  for (const [key, vals] of Object.entries(wiki)) {
    if (merged[key]) {
      if (vals.killed) merged[key].killed = vals.killed;
      if (vals.wounded) merged[key].wounded = vals.wounded;
    }
  }

  // Al Jazeera fills gaps only
  for (const [key, vals] of Object.entries(aj)) {
    if (merged[key]) {
      if (!merged[key].killed && vals.killed) merged[key].killed = vals.killed;
      if (!merged[key].wounded && vals.wounded) merged[key].wounded = vals.wounded;
    }
  }

  return merged;
}

function updateFiles(casualties) {
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
  const trackerPath = resolve(ROOT, 'src/components/ImpactTracker.jsx');
  let code = readFileSync(trackerPath, 'utf-8');

  const entries = Object.entries(casualties)
    .map(([key, { killed, wounded }]) => `  ${key}: { killed: ${killed}, wounded: ${wounded} },`)
    .join('\n');

  const newBlock = `const DEFAULT_CASUALTIES = {\n${entries}\n};`;

  code = code.replace(
    /const DEFAULT_CASUALTIES = \{[\s\S]*?\};/,
    newBlock
  );

  writeFileSync(trackerPath, code);
  console.log('Updated ImpactTracker.jsx DEFAULT_CASUALTIES');
}

// --- Main ---

async function main() {
  console.log('Fetching casualty data...');

  let wiki = {};
  let aj = {};

  try {
    wiki = await scrapeWikipedia();
    console.log('Wikipedia:', JSON.stringify(wiki, null, 2));
  } catch (err) {
    console.error('Wikipedia scrape failed:', err.message);
  }

  try {
    aj = await scrapeAlJazeera();
    console.log('Al Jazeera:', JSON.stringify(aj, null, 2));
  } catch (err) {
    console.error('Al Jazeera scrape failed:', err.message);
  }

  const merged = mergeData(wiki, aj);
  console.log('Merged:', JSON.stringify(merged, null, 2));

  // Sanity check
  if (merged.iran.killed === 0) {
    console.error('ERROR: Iran killed is 0 — scraping likely failed. Aborting.');
    process.exit(1);
  }

  updateFiles(merged);
  console.log('Done!');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

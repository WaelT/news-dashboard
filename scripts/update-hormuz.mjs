#!/usr/bin/env node
/**
 * Scrapes Strait of Hormuz situation data from Wikipedia
 * "2026 Strait of Hormuz crisis" and updates fields in src/data/hormuzData.js.
 *
 * Auto-updated fields:
 *  - crisis.seafarersKilled   (infobox deaths)
 *  - crisis.vesselsAttacked   ("List of ships attacked by Iran" table row count)
 *  - crisis.vesselsStranded / seafarersStranded (latest IMO figures in prose)
 *  - crisis.trumpUltimatum / iranThreat (two most recent dated events, as status lines)
 *  - updated                  (stamped only when something changed)
 *
 * Fields like transitsPerDay / oilFlowMbd / insuranceSurge stay manually curated —
 * Wikipedia has no reliable structured source for them.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PAGE = '2026 Strait of Hormuz crisis';

const MONTHS = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};
const MONTH_ABBR = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

async function fetchWikitext() {
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(PAGE)}&prop=wikitext&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'NewsDashboard/1.0' } });
  if (!res.ok) throw new Error(`Wikipedia API ${res.status}`);
  const data = await res.json();
  const text = data?.parse?.wikitext?.['*'];
  if (!text || text.length < 5000) throw new Error('Article wikitext missing or too short');
  return text;
}

// Strip wiki markup from a prose fragment so it reads as plain text
function cleanWikitext(s) {
  let out = s
    .replace(/<ref[^>/]*\/>/g, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '')
    .replace(/\{\{nbsp\}\}/gi, ' ')
    .replace(/\{\{USS\|([^|}]+)[^}]*\}\}/gi, 'USS $1')
    .replace(/\{\{ship\|([^|}]+)\|([^|}]+)[^}]*\}\}/gi, '$1 $2')
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1')
    .replace(/'{2,}/g, '');
  // Remove any remaining templates (innermost-first, a few passes for nesting)
  for (let i = 0; i < 3; i++) out = out.replace(/\{\{[^{}]*\}\}/g, '');
  return out.replace(/\s+/g, ' ').trim();
}

function scrape(text) {
  const result = {};

  // Infobox: "| deaths = 15 seafarers"
  const deaths = text.match(/\|\s*deaths\s*=\s*([\d,]+)\s*seafarers/i);
  if (deaths) result.seafarersKilled = parseInt(deaths[1].replace(/,/g, ''), 10);

  // "List of ships attacked by Iran" table — count dated rows
  const iranTblStart = text.indexOf('List of ships attacked by Iran');
  if (iranTblStart !== -1) {
    const tblStart = text.indexOf('{|', iranTblStart);
    const tblEnd = text.indexOf('|}', tblStart);
    if (tblStart !== -1 && tblEnd !== -1) {
      const rows = text.slice(tblStart, tblEnd).match(/\{\{dts\|/gi);
      if (rows && rows.length > 0) result.vesselsAttacked = rows.length;
    }
  }

  // Latest stranded figures, e.g. "20,000 mariners and 2,000 ships remained stranded"
  const strandedMatches = [...text.matchAll(
    /([\d,]+)\s*(?:mariners|seafarers|crew members)\s+and\s+([\d,]+)\s*(?:ships|vessels)[^.\n]*?stranded/gi
  )];
  if (strandedMatches.length) {
    const last = strandedMatches[strandedMatches.length - 1];
    result.seafarersStranded = parseInt(last[1].replace(/,/g, ''), 10);
    result.vesselsStranded = parseInt(last[2].replace(/,/g, ''), 10);
  }

  // Most recent dated events: "On 12 July, the IRGC Navy declared ..."
  const events = [];
  for (const m of text.matchAll(
    /(?:^|\. |\n)(?:Early on |Late on |On )(\d{1,2})(?:\{\{nbsp\}\}| )(January|February|March|April|May|June|July|August|September|October|November|December)(?: 2026)?,? ([^\n]{30,400}?)(?=\.\s|\.<ref|<ref|\n)/g
  )) {
    const day = parseInt(m[1], 10);
    const month = MONTHS[m[2]];
    const txt = cleanWikitext(m[3]);
    if (txt.length < 30) continue;
    events.push({ day, month, ord: month * 100 + day, txt });
  }
  events.sort((a, b) => b.ord - a.ord);
  // Dedupe by date, keep the two most recent distinct-day events
  const latest = [];
  for (const e of events) {
    if (latest.some((l) => l.ord === e.ord)) continue;
    latest.push(e);
    if (latest.length === 2) break;
  }
  if (latest[0]) {
    result.statusLine = `LATEST (${latest[0].day} ${MONTH_ABBR[latest[0].month]}): ${latest[0].txt}`;
  }
  if (latest[1]) {
    result.prevLine = `${latest[1].day} ${MONTH_ABBR[latest[1].month]}: ${latest[1].txt}`;
  }

  return result;
}

// Escape a plain string for embedding in a single-quoted JS literal
function jsStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function updateFile(scraped) {
  const filePath = resolve(ROOT, 'src/data/hormuzData.js');
  const original = readFileSync(filePath, 'utf-8');
  let code = original;

  // Numeric fields — never decrease (counts only grow as incidents accumulate)
  const numericFields = {
    seafarersKilled: scraped.seafarersKilled,
    vesselsAttacked: scraped.vesselsAttacked,
  };
  for (const [field, value] of Object.entries(numericFields)) {
    if (value == null) continue;
    const re = new RegExp(`(${field}:\\s*)(\\d+)`);
    const m = code.match(re);
    if (!m) { console.log(`WARN: field ${field} not found in hormuzData.js`); continue; }
    const existing = parseInt(m[2], 10);
    if (value >= existing) {
      code = code.replace(re, `$1${value}`);
      console.log(`${field}: ${existing} -> ${value}`);
    }
  }

  // Stranded figures can go up or down (ships leave as blockade eases)
  const stranded = {
    seafarersStranded: scraped.seafarersStranded,
    vesselsStranded: scraped.vesselsStranded,
  };
  for (const [field, value] of Object.entries(stranded)) {
    if (value == null) continue;
    const re = new RegExp(`(${field}:\\s*)(\\d+)`);
    if (!re.test(code)) { console.log(`WARN: field ${field} not found in hormuzData.js`); continue; }
    code = code.replace(re, `$1${value}`);
    console.log(`${field}: -> ${value}`);
  }

  // Status narrative lines (rendered in the alert banner of the Hormuz panel)
  const strFields = {
    trumpUltimatum: scraped.statusLine,
    iranThreat: scraped.prevLine,
  };
  for (const [field, value] of Object.entries(strFields)) {
    if (!value) continue;
    // Replace the ENTIRE single-line property value (greedy to the last quote
    // on the line) — a lazy quoted-string match can stop early on escape
    // sequences inside the value and leave orphaned text behind.
    const re = new RegExp(`^(\\s*${field}:\\s*)'.*'(?=,?\\s*$)`, 'm');
    if (!re.test(code)) { console.log(`WARN: field ${field} not found in hormuzData.js`); continue; }
    code = code.replace(re, `$1'${jsStr(value)}'`);
    console.log(`${field}: -> ${value.slice(0, 100)}...`);
  }

  if (code === original) {
    console.log('No changes — hormuzData.js already up to date.');
    return;
  }

  // Stamp the updated date only when something actually changed
  const today = new Date().toISOString().slice(0, 10);
  code = code.replace(/(updated:\s*')[^']*(')/, `$1${today}$2`);

  writeFileSync(filePath, code);
  console.log('Updated src/data/hormuzData.js');
}

async function main() {
  console.log(`Fetching "${PAGE}" from Wikipedia...`);
  const text = await fetchWikitext();
  const scraped = scrape(text);
  console.log('Scraped:', JSON.stringify(scraped, null, 2).slice(0, 1500));

  // Sanity checks — abort rather than write garbage
  const numericHits = ['seafarersKilled', 'vesselsAttacked', 'vesselsStranded']
    .filter((k) => scraped[k] != null).length;
  if (numericHits === 0 || !scraped.statusLine) {
    console.error(`ERROR: too little data scraped (${numericHits} numeric fields, statusLine=${!!scraped.statusLine}) — page layout likely changed. Aborting.`);
    process.exit(1);
  }
  if (scraped.vesselsAttacked != null && (scraped.vesselsAttacked < 10 || scraped.vesselsAttacked > 2000)) {
    console.error(`ERROR: vesselsAttacked=${scraped.vesselsAttacked} outside sane range. Aborting.`);
    process.exit(1);
  }

  updateFile(scraped);
  console.log('Done!');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

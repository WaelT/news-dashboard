#!/usr/bin/env node
/**
 * Scrapes economic impact data from Wikipedia "Economic impact of the 2026 Iran war"
 * and updates ECON_DATA in MarketImpact.jsx.
 *
 * Extracts key figures: oil prices, gas prices, stock market drops, shipping disruptions,
 * trade losses, GDP impacts, etc.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function cleanNum(text) {
  if (!text) return null;
  return text.replace(/,/g, '').trim();
}

async function scrapeWikipedia() {
  const url = 'https://en.wikipedia.org/w/api.php?action=parse&page=Economic+impact+of+the+2026+Iran+war&prop=wikitext&format=json';
  const res = await fetch(url, { headers: { 'User-Agent': 'NewsDashboard/1.0' } });
  if (!res.ok) throw new Error(`Wikipedia API ${res.status}`);
  const data = await res.json();
  const text = data?.parse?.wikitext?.['*'] || '';

  const items = [];

  // --- Energy markets ---

  // Brent crude price
  const brentMatch = text.match(/Brent crude oil prices surging ([\d–]+)% to around \$([\d–]+) per barrel/i);
  if (brentMatch) {
    items.push({ label: 'Brent Crude Surge', value: `+${brentMatch[1]}%`, sub: `~$${brentMatch[2]}/barrel`, color: '#ff6600' });
  }

  // Hormuz disruption
  const hormuzMatch = text.match(/disrupted (?:approximately )?(\d+)% of global oil supplies/i);
  if (hormuzMatch) {
    items.push({ label: 'Hormuz Disruption', value: `${hormuzMatch[1]}%`, sub: 'global oil blocked', color: '#ff6600' });
  }

  // Oil price forecast
  const oilForecast = text.match(/prices could reach \$(\d+) per barrel/i);
  if (oilForecast) {
    items.push({ label: 'Oil Price Forecast', value: `$${oilForecast[1]}`, sub: 'if disruptions persist', color: '#ffcc00' });
  }

  // Global inflation impact
  const inflationMatch = text.match(/adding ([\d.]+)% to global inflation/i);
  if (inflationMatch) {
    items.push({ label: 'Global Inflation', value: `+${inflationMatch[1]}%`, sub: 'projected increase', color: '#ff6600' });
  }

  // EU gas prices
  const gasMatch = text.match(/European natural gas prices (nearly doubled|rose [\d]+%|surged)/i);
  const gasPriceMatch = text.match(/€(\d+)\/MWh/);
  if (gasMatch || gasPriceMatch) {
    const sub = gasPriceMatch ? `€${gasPriceMatch[1]}/MWh` : 'after Qatar strikes';
    items.push({ label: 'EU Gas Prices', value: gasMatch ? 'x2' : `€${gasPriceMatch[1]}`, sub, color: '#ff6600' });
  }

  // US gasoline
  const gasoline = text.match(/gasoline prices rise ([\d–]+) cents per gallon/i);
  if (gasoline) {
    items.push({ label: 'US Gas Price Rise', value: `+${gasoline[1]}¢`, sub: '/gallon daily', color: '#3b82f6' });
  }

  // --- Aviation ---

  // Flight cancellations
  const flightMatch = text.match(/([\d,]+) daily flight cancellations/i);
  if (flightMatch) {
    items.push({ label: 'Flights Cancelled', value: `${flightMatch[1]}`, sub: '/day grounded', color: '#0088cc' });
  }

  // --- Financial markets ---

  // Dow Jones
  const dowMatch = text.match(/Dow Jones falling over (\d+) points/i);
  if (dowMatch) {
    items.push({ label: 'Dow Jones Drop', value: `-${dowMatch[1]}pts`, sub: 'single day', color: '#ff0040' });
  }

  // S&P 500
  const spMatch = text.match(/S&P 500 dropping ([\d.]+)%/i);
  if (spMatch) {
    items.push({ label: 'S&P 500 Drop', value: `-${spMatch[1]}%`, sub: 'single day', color: '#ff0040' });
  }

  // KOSPI
  const kospiMatch = text.match(/KOSPI.*?dropping (?:up to )?([\d]+)%/i);
  if (kospiMatch) {
    items.push({ label: 'KOSPI Crash', value: `-${kospiMatch[1]}%`, sub: 'circuit breaker triggered', color: '#ff0040' });
  }

  // KSE 100 (Pakistan)
  const kseMatch = text.match(/KSE 100.*?decline.*?(\d[\d.]+)%/i) || text.match(/KSE 100.*?(\d[\d.]+)%/i);
  if (kseMatch) {
    items.push({ label: 'KSE 100 Crash', value: `-${kseMatch[1]}%`, sub: 'largest-ever decline', color: '#ff0040' });
  }

  // Thai stock
  const thaiMatch = text.match(/Thai.*?(\d+)% decline/i);
  if (thaiMatch) {
    items.push({ label: 'Thai SET Drop', value: `-${thaiMatch[1]}%`, sub: 'circuit breaker', color: '#ff0040' });
  }

  // --- Regional impacts ---

  // Eurozone growth
  const euGrowth = text.match(/eurozone growth.*?reduced by ([\d.]+)%/i);
  if (euGrowth) {
    items.push({ label: 'Eurozone Growth', value: `-${euGrowth[1]}%`, sub: 'GDP reduction', color: '#d4a017' });
  }

  // EU inflation
  const euInflation = text.match(/inflation up ([\d.]+)%/i);
  if (euInflation) {
    items.push({ label: 'EU Inflation Rise', value: `+${euInflation[1]}%`, sub: 'projected', color: '#d4a017' });
  }

  return items;
}

function updateFile(items) {
  if (!items.length) {
    console.error('No items scraped. Aborting.');
    process.exit(1);
  }

  const filePath = resolve(ROOT, 'src/components/MarketImpact.jsx');
  let code = readFileSync(filePath, 'utf-8');

  // Build the new ECON_DATA array
  const entries = items.map((item) => {
    return `  { label: '${item.label}', value: '${item.value}', sub: '${item.sub}', color: '${item.color}' },`;
  }).join('\n');

  const newBlock = `const ECON_DATA = [\n${entries}\n];`;

  if (!/const ECON_DATA = \[[\s\S]*?\];/.test(code)) {
    console.error('ERROR: Could not find ECON_DATA block in MarketImpact.jsx');
    process.exit(1);
  }

  const replaced = code.replace(
    /const ECON_DATA = \[[\s\S]*?\];/,
    newBlock
  );

  if (replaced === code) {
    console.log('ECON_DATA unchanged — no update needed.');
    return;
  }

  writeFileSync(filePath, replaced);
  console.log('Updated MarketImpact.jsx ECON_DATA');
}

async function main() {
  console.log('Fetching economic impact data from Wikipedia...');

  let items;
  try {
    items = await scrapeWikipedia();
    console.log(`Parsed ${items.length} data points:`);
    for (const item of items) {
      console.log(`  ${item.label}: ${item.value} (${item.sub})`);
    }
  } catch (err) {
    console.error('Scrape failed:', err.message);
    process.exit(1);
  }

  if (items.length < 3) {
    console.error(`ERROR: Only ${items.length} items scraped — too few, likely a parsing failure. Aborting.`);
    process.exit(1);
  }

  updateFile(items);
  console.log('Done!');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

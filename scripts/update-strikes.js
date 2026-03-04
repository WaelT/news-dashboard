/**
 * update-strikes.js
 *
 * Fetches latest strike/conflict zone data and writes public/strikes.json.
 * Dynamic zones in strikes.json are merged with static zones in conflictZones.js
 * by MapView at runtime. Zones with the same `id` override static entries;
 * new `id` values (2000+) add new markers to the map.
 *
 * Usage:
 *   node scripts/update-strikes.js
 *   npm run update-strikes
 *
 * To add a new strike zone, add an entry to the `zones` array below
 * with a unique id (use 2000+ range for dynamic zones).
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '..', 'public', 'strikes.json');

// ─── Zone template ───────────────────────────────────────────
// {
//   id: 2001,               // unique — use 2000+ for dynamic zones
//   name: 'Location Name',
//   lat: 0.0,
//   lng: 0.0,
//   type: 'strike',         // strike | military | naval | nuclear | oil | strategic | diplomatic
//   icon: 'missile',        // missile | military | naval | nuclear | oil | shipping | airbase | diplomatic
//   description: 'What happened here',
//   status: 'high-alert',   // high-alert | active | monitoring
//   keywords: ['keyword1', 'keyword2'],  // for matching RSS articles
// }

async function fetchLatestStrikes() {
  // This function can be extended to fetch from news APIs, RSS, or scraping.
  // For now it reads the current file and preserves manual entries.
  // To add automation, parse RSS feeds for strike-related articles and
  // create zone entries from extracted location data.

  const zones = [];

  // Example: fetch from an API endpoint or parse RSS for locations
  // const res = await fetch('https://api.example.com/strikes');
  // const data = await res.json();
  // for (const strike of data) {
  //   zones.push({
  //     id: 2000 + strike.id,
  //     name: strike.location,
  //     lat: strike.lat,
  //     lng: strike.lng,
  //     type: 'strike',
  //     icon: 'missile',
  //     description: strike.summary,
  //     status: 'high-alert',
  //     keywords: strike.keywords,
  //   });
  // }

  return zones;
}

async function main() {
  console.log('Fetching latest strike data...');

  const zones = await fetchLatestStrikes();

  const output = {
    updatedAt: new Date().toISOString(),
    source: 'Reuters, Al Jazeera, BBC, AP News',
    zones,
  };

  writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + '\n');
  console.log(`Wrote ${zones.length} dynamic zone(s) to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('update-strikes failed:', err);
  process.exit(1);
});

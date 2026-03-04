#!/usr/bin/env node

/**
 * Fetches market data and writes public/markets.json.
 * Uses free APIs where available, falls back to hardcoded seed data.
 * No external dependencies — uses Node.js native fetch.
 *
 * Usage: node scripts/update-markets.js
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '..', 'public', 'markets.json');

// Seed data used as fallback
const SEED = [
  { id: 'sp500', label: 'S&P 500', icon: '📈', price: 5580.00, change: -2.15, unit: '' },
  { id: 'nasdaq', label: 'Nasdaq', icon: '💻', price: 19450.00, change: -2.80, unit: '' },
  { id: 'dowjones', label: 'Dow Jones', icon: '🏛️', price: 41200.00, change: -1.65, unit: '' },
  { id: 'nikkei', label: 'Nikkei 225', icon: '📊', price: 56279.00, change: -3.06, unit: '' },
  { id: 'brent', label: 'Brent Oil', icon: '🛢️', price: 81.40, change: 11.2, unit: '$/bbl' },
  { id: 'btc', label: 'Bitcoin', icon: '₿', price: 68000.00, change: -4.50, unit: 'USD' },
  { id: 'gold', label: 'Gold', icon: '🥇', price: 5075.00, change: 18.0, unit: '$/oz' },
  { id: 'silver', label: 'Silver', icon: '🥈', price: 38.50, change: 24.0, unit: '$/oz' },
];

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.json();
}

async function main() {
  console.log('Fetching market data...');
  const markets = [...SEED];

  // Try fetching BTC from CoinGecko (free, no key)
  try {
    const data = await fetchJSON(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
    );
    if (data?.bitcoin) {
      const btc = markets.find((m) => m.id === 'btc');
      if (btc) {
        btc.price = data.bitcoin.usd;
        btc.change = parseFloat((data.bitcoin.usd_24h_change || 0).toFixed(2));
      }
    }
    console.log('  BTC: OK');
  } catch (e) {
    console.log(`  BTC: fallback (${e.message})`);
  }

  const output = {
    updatedAt: new Date().toISOString(),
    markets,
  };

  writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + '\n');
  console.log(`Written to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});

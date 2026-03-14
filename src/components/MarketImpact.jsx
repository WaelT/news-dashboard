import { useState, useEffect, useCallback, useRef } from 'react';

const SYMBOLS = [
  { id: 'sp500', symbol: 'ES=F', label: 'SPY' },
  { id: 'nasdaq', symbol: 'NQ=F', label: 'QQQ' },
  { id: 'dowjones', symbol: 'YM=F', label: 'DIA' },
  { id: 'nikkei', symbol: '^N225', label: 'N225' },
  { id: 'brent', symbol: 'BZ=F', label: 'OIL' },
  { id: 'btc', symbol: 'BTC-USD', label: 'BTC' },
  { id: 'gold', symbol: 'GC=F', label: 'GOLD' },
  { id: 'silver', symbol: 'SI=F', label: 'SLV' },
];

const FALLBACK = {
  sp500: { price: 5680.00, change: -2.60 },
  nasdaq: { price: 21900.00, change: -3.10 },
  dowjones: { price: 47400.00, change: -2.50 },
  nikkei: { price: 52200.00, change: -6.10 },
  brent: { price: 100.46, change: 43.0 },
  btc: { price: 62500.00, change: -10.50 },
  gold: { price: 5250.00, change: 7.0 },
  silver: { price: 99.00, change: 11.0 },
};

const REFRESH_MS = 60_000;

async function fetchYahoo(symbol) {
  const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=5m`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error('No data');

  const meta = result.meta;
  const price = meta.regularMarketPrice;
  const prevClose = meta.chartPreviousClose || meta.previousClose;
  const change = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;

  return { price, change: parseFloat(change.toFixed(2)) };
}

function formatPrice(price) {
  if (price >= 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const ECON_DATA = [
  { label: 'Brent Crude Surge', value: '+10–13%', sub: '~$80–82/barrel', color: '#ff6600' },
  { label: 'Hormuz Disruption', value: '20%', sub: 'global oil blocked', color: '#ff6600' },
  { label: 'Oil Price Forecast', value: '$100', sub: 'if disruptions persist', color: '#ffcc00' },
  { label: 'Global Inflation', value: '+0.8%', sub: 'projected increase', color: '#ff6600' },
  { label: 'EU Gas Prices', value: '€48', sub: '€48/MWh', color: '#ff6600' },
  { label: 'US Gas Price Rise', value: '+5–10¢', sub: '/gallon daily', color: '#3b82f6' },
  { label: 'Flights Cancelled', value: '4,000', sub: '/day grounded', color: '#0088cc' },
  { label: 'Dow Jones Drop', value: '-400pts', sub: 'single day', color: '#ff0040' },
  { label: 'S&P 500 Drop', value: '-0.7%', sub: 'single day', color: '#ff0040' },
  { label: 'KOSPI Crash', value: '-12%', sub: 'circuit breaker triggered', color: '#ff0040' },
  { label: 'KSE 100 Crash', value: '-9.57%', sub: 'largest-ever decline', color: '#ff0040' },
  { label: 'Thai SET Drop', value: '-8%', sub: 'circuit breaker', color: '#ff0040' },
  { label: 'Eurozone Growth', value: '-0.1%', sub: 'GDP reduction', color: '#d4a017' },
  { label: 'EU Inflation Rise', value: '+0.5%', sub: 'projected', color: '#d4a017' },
];

function EconomicImpact() {
  return (
    <div className="px-3 py-1.5">
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {ECON_DATA.map((item) => (
          <div key={item.label} className="py-1 border-b border-ops-border/30">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold font-mono" style={{ color: item.color }}>{item.value}</span>
              <span className="text-[10px] text-ops-muted truncate">{item.sub}</span>
            </div>
            <span className="text-[11px] text-ops-text">{item.label}</span>
          </div>
        ))}
      </div>
      <p className="text-ops-muted text-[8px] mt-1.5 pt-1 border-t border-ops-border/30">
        Sources: Al Jazeera, Oxford Economics, Yahoo Finance, Bloomberg, GCC Central Banks
      </p>
    </div>
  );
}

export default function MarketImpact() {
  const [markets, setMarkets] = useState(() =>
    SYMBOLS.map((s) => ({ ...s, ...FALLBACK[s.id], live: false }))
  );
  const timerRef = useRef(null);

  const fetchAll = useCallback(async () => {
    const results = await Promise.allSettled(
      SYMBOLS.map((s) => fetchYahoo(s.symbol).then((data) => ({ id: s.id, ...data, live: true })))
    );

    setMarkets((prev) =>
      prev.map((m) => {
        const result = results.find(
          (r) => r.status === 'fulfilled' && r.value.id === m.id
        );
        if (result) return { ...m, ...result.value };
        return m;
      })
    );
  }, []);

  useEffect(() => {
    fetchAll();
    timerRef.current = setInterval(fetchAll, REFRESH_MS);
    return () => clearInterval(timerRef.current);
  }, [fetchAll]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 border-b border-ops-border flex items-center justify-between">
        <span className="text-[#00b4d8] text-xs font-bold tracking-widest">MARKETS</span>
        {markets.some((m) => m.live) && (
          <span className="flex items-center gap-1">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-green-500 text-[9px] font-bold">LIVE</span>
          </span>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-2">
          {markets.map((m) => {
            const up = m.change >= 0;
            const color = up ? '#22c55e' : '#ff0040';
            return (
              <div key={m.id} className="flex items-baseline gap-2 py-1 border-b border-ops-border/30">
                <span className="text-[11px] font-mono" style={{ color }}>{up ? '▲' : '▼'}</span>
                <span className="text-[11px] font-bold text-ops-muted font-mono">{m.label}</span>
                <span className="text-[12px] font-bold font-mono text-ops-text">{formatPrice(m.price)}</span>
                <span className="text-[11px] font-bold font-mono ml-auto" style={{ color }}>
                  {up ? '+' : ''}{m.change.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Economic Impact */}
        <div className="px-3 py-1.5 border-t border-ops-border flex items-center justify-between">
          <span className="text-[#ff6600] text-[10px] font-bold tracking-widest">ECONOMIC IMPACT</span>
          <span className="text-ops-muted text-[8px]">EST. COSTS</span>
        </div>
        <EconomicImpact />
      </div>
    </div>
  );
}

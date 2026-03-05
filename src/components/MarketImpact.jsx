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
  sp500: { price: 5580.00, change: -2.15 },
  nasdaq: { price: 19450.00, change: -2.80 },
  dowjones: { price: 41200.00, change: -1.65 },
  nikkei: { price: 56279.00, change: -3.06 },
  brent: { price: 81.40, change: 11.2 },
  btc: { price: 68000.00, change: -4.50 },
  gold: { price: 5075.00, change: 18.0 },
  silver: { price: 38.50, change: 24.0 },
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
  { label: 'US Military Ops', value: '$65B', sub: 'direct cost', color: '#3b82f6' },
  { label: 'US Total Impact', value: '$210B', sub: 'inc. economic losses', color: '#3b82f6' },
  { label: 'Israel Weekly Cost', value: '$2.9B', sub: '/week (Finance Min.)', color: '#0088cc' },
  { label: 'Iran Infrastructure', value: '$17.8B', sub: 'damage est.', color: '#ff0040' },
  { label: 'Oil Tanker Rates', value: '$424K', sub: '/day (all-time high)', color: '#ffcc00' },
  { label: 'Hormuz Disruption', value: '20%', sub: 'global oil blocked', color: '#ff6600' },
  { label: 'KOSPI Crash', value: '-12%', sub: 'worst since 9/11', color: '#ff0040' },
  { label: 'EU Gas Prices', value: '+38%', sub: 'after Qatar strikes', color: '#ff6600' },
  { label: 'UAE GDP Impact', value: '-$18B', sub: 'trade disruption', color: '#d4a017' },
  { label: 'Saudi Aramco Loss', value: '-$42B', sub: 'market cap drop', color: '#d4a017' },
  { label: 'Qatar LNG Halt', value: '$9.2B', sub: 'export losses', color: '#d4a017' },
  { label: 'Kuwait Port Closure', value: '$3.1B', sub: 'trade blocked', color: '#d4a017' },
  { label: 'Bahrain Base Cost', value: '$1.4B', sub: 'defense surge', color: '#d4a017' },
  { label: 'Oman Shipping', value: '-61%', sub: 'strait traffic drop', color: '#d4a017' },
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

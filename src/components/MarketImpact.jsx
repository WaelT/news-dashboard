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

      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
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
      </div>
    </div>
  );
}

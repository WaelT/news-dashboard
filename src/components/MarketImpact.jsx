import { useState, useEffect, useCallback, useRef } from 'react';

const SYMBOLS = [
  { id: 'sp500', symbol: 'ES=F', label: 'S&P 500', icon: '📈', unit: '' },
  { id: 'nasdaq', symbol: 'NQ=F', label: 'Nasdaq', icon: '💻', unit: '' },
  { id: 'dowjones', symbol: 'YM=F', label: 'Dow Jones', icon: '🏛️', unit: '' },
  { id: 'nikkei', symbol: '^N225', label: 'Nikkei 225', icon: '📊', unit: '' },
  { id: 'brent', symbol: 'BZ=F', label: 'Brent Oil', icon: '🛢️', unit: '$/bbl' },
  { id: 'btc', symbol: 'BTC-USD', label: 'Bitcoin', icon: '₿', unit: 'USD' },
  { id: 'gold', symbol: 'GC=F', label: 'Gold', icon: '🥇', unit: '$/oz' },
  { id: 'silver', symbol: 'SI=F', label: 'Silver', icon: '🥈', unit: '$/oz' },
];

const FALLBACK = {
  sp500: { price: 5580.00, change: -2.15, chart: [] },
  nasdaq: { price: 19450.00, change: -2.80, chart: [] },
  dowjones: { price: 41200.00, change: -1.65, chart: [] },
  nikkei: { price: 56279.00, change: -3.06, chart: [] },
  brent: { price: 81.40, change: 11.2, chart: [] },
  btc: { price: 68000.00, change: -4.50, chart: [] },
  gold: { price: 5075.00, change: 18.0, chart: [] },
  silver: { price: 38.50, change: 24.0, chart: [] },
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
  const closes = result.indicators?.quote?.[0]?.close || [];
  const chart = closes.filter((v) => v != null);

  return { price, change: parseFloat(change.toFixed(2)), chart };
}

function Sparkline({ data, change, id }) {
  const color = change >= 0 ? '#22c55e' : '#ff0040';

  if (!data || data.length < 2) {
    return <div className="w-full h-full bg-ops-bg/20 rounded" />;
  }

  const w = 200, h = 48;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = w / (data.length - 1);

  const path = data.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return i === 0 ? `M${x},${y}` : `L${x},${y}`;
  }).join(' ');

  const lastX = (data.length - 1) * stepX;
  const fillPath = `${path} L${lastX},${h} L0,${h} Z`;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#grad-${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatPrice(price) {
  if (price >= 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function MarketImpact() {
  const [markets, setMarkets] = useState(() =>
    SYMBOLS.map((s) => ({ ...s, ...FALLBACK[s.id], live: false }))
  );
  const [lastUpdate, setLastUpdate] = useState(null);
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
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    fetchAll();
    timerRef.current = setInterval(fetchAll, REFRESH_MS);
    return () => clearInterval(timerRef.current);
  }, [fetchAll]);

  const timeLabel = lastUpdate
    ? lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    : '—';

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 border-b border-ops-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#00b4d8] text-xs font-bold tracking-widest">MARKET IMPACT</span>
          {markets.some((m) => m.live) && (
            <span className="flex items-center gap-1">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-green-500 text-[9px] font-bold">LIVE</span>
            </span>
          )}
        </div>
        <span className="text-ops-muted text-[9px] font-mono">{timeLabel}</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-2 h-full" style={{ gridTemplateRows: 'repeat(4, 1fr)' }}>
          {markets.map((m) => {
            const color = m.change >= 0 ? '#22c55e' : '#ff0040';
            return (
              <div
                key={m.id}
                className="bg-ops-bg/40 border border-ops-border/50 rounded-lg px-3 py-2 flex flex-col min-h-0"
              >
                {/* Header: label + change */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{m.icon}</span>
                    <span className="text-[11px] font-bold text-ops-muted">{m.label}</span>
                  </div>
                  <span className="text-xs font-bold font-mono" style={{ color }}>
                    {m.change >= 0 ? '▲' : '▼'} {Math.abs(m.change).toFixed(2)}%
                  </span>
                </div>

                {/* Sparkline chart */}
                <div className="flex-1 min-h-[32px]">
                  <Sparkline data={m.chart} change={m.change} id={m.id} />
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-lg font-bold font-mono text-ops-text leading-none">
                    {formatPrice(m.price)}
                  </span>
                  {m.unit && (
                    <span className="text-[9px] text-ops-muted">{m.unit}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

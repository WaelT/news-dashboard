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
  sp500: { price: 6716.09, change: 0.25 },
  nasdaq: { price: 22374.00, change: -0.02 },
  dowjones: { price: 46993.26, change: 0.10 },
  nikkei: { price: 53700.39, change: 0.00 },
  brent: { price: 111.10, change: 55.0 },
  btc: { price: 75991.00, change: 0.25 },
  gold: { price: 5004.00, change: -0.40 },
  silver: { price: 80.90, change: 2.49 },
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
  { label: 'US Military Cost', value: '$36B+', sub: '~$1.2B/day (30 days)', color: '#ff0040' },
  { label: 'Total War Cost Est.', value: '$70B', sub: 'Penn Wharton central', color: '#ff0040' },
  { label: 'Broader US Impact', value: '$220B', sub: 'incl. economic losses', color: '#ff0040' },
  { label: 'Pentagon Request', value: '$200B', sub: 'emergency supplemental to Congress', color: '#ff0040' },
  { label: 'Trump Approval', value: '36%', sub: 'threatens Kharg Island + power plants if no deal', color: '#ff0040' },
  { label: 'Brent Crude', value: '$111', sub: '/barrel (+55%); record monthly gain since 1988', color: '#ff6600' },
  { label: 'Hormuz Disruption', value: '96%', sub: '~5 ships/day; IRGC toll booth; 33 Larak transits', color: '#ff0040' },
  { label: 'Bab al-Mandab', value: 'THREATENED', sub: 'Houthis: closure "viable option"; 15% global trade', color: '#ff0040' },
  { label: 'Qatar LNG', value: 'HALTED', sub: '17% capacity destroyed (Ras Laffan)', color: '#ff0040' },
  { label: 'South Pars Strike', value: 'HIT', sub: 'world\'s largest gas field; Iraq gas halted', color: '#ff0040' },
  { label: 'Kuwait Airport', value: 'HIT', sub: 'fuel depot fire; 10 soldiers wounded in drone attack', color: '#ff0040' },
  { label: 'Iraq PMF', value: 'IN IRAN', sub: 'convoy enters Khorramshahr; first foreign ground support', color: '#ff0040' },
  { label: 'Iran Navy', value: '92% destroyed', sub: '10,000+ targets struck; launch rates down 90%', color: '#0088cc' },
  { label: 'Pentagon Plans', value: 'GROUND OPS', sub: 'readying "weeks of ground operations" in Iran', color: '#ff0040' },
  { label: 'Goldman Sachs', value: '$147+', sub: 'Brent may exceed 2008 all-time high', color: '#ff6600' },
  { label: 'US Gas Price', value: '$3.72', sub: '/gal (+$0.80 in 4 weeks)', color: '#ff6600' },
  { label: 'Global Inflation', value: '+0.8%', sub: 'IEA: largest supply disruption in oil market history', color: '#d4a017' },
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
              <div key={m.id} className="flex items-center gap-2 py-1 border-b border-ops-border/30">
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

import { useState, useEffect, useCallback, useRef } from 'react';
import { globalImpact } from '../data/globalImpact';

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
  sp500: { price: 6802.40, change: 0.35 },
  nasdaq: { price: 22618.00, change: 0.42 },
  dowjones: { price: 47210.18, change: 0.18 },
  nikkei: { price: 54115.20, change: 0.21 },
  brent: { price: 101.50, change: 0.99 },
  btc: { price: 78420.00, change: 0.85 },
  gold: { price: 4862.00, change: -0.55 },
  silver: { price: 78.40, change: -0.90 },
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
  { label: 'EU Gas Prices', value: '€60', sub: '€60/MWh', color: '#ff6600' },
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
    <div className="px-3 py-2">
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {ECON_DATA.map((item) => (
          <div key={item.label} className="py-1.5 border-b border-ops-border/30">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold font-mono" style={{ color: item.color }}>{item.value}</span>
              <span className="text-[11px] text-ops-muted truncate">{item.sub}</span>
            </div>
            <span className="text-xs text-ops-text">{item.label}</span>
          </div>
        ))}
      </div>
      <p className="text-ops-muted text-[9px] mt-2 pt-1.5 border-t border-ops-border/30">
        Sources: Al Jazeera, Oxford Economics, Yahoo Finance, Bloomberg, GCC Central Banks
      </p>
    </div>
  );
}

function GlobalImpactPanel() {
  const { gdpImpact, disruptions, oil } = globalImpact;
  const maxPct = Math.max(...gdpImpact.map((g) => Math.abs(g.pct)));

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
      {/* Oil price range */}
      <div className="bg-ops-border/20 rounded px-3 py-2.5 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-ops-muted font-bold tracking-wider">BRENT CRUDE</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-ops-muted">${oil.preWar}</span>
            <span className="text-xs text-ops-muted">→</span>
            <span className="text-base font-bold font-mono text-[#ff6600]">${oil.current}</span>
            <span className="text-xs text-ops-muted">→</span>
            <span className="text-[13px] font-bold font-mono text-ops-red">${oil.forecast}?</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-ops-muted">PEAK</div>
          <div className="text-base font-bold font-mono text-[#ff6600]">${oil.peak}</div>
        </div>
      </div>

      {/* Disruptions */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-ops-border/20 rounded px-3 py-2">
          <div className="text-[10px] text-ops-muted font-bold">FLIGHTS CANCELLED</div>
          <div className="text-sm font-bold font-mono text-ops-red">{disruptions.flightsCancelled}</div>
        </div>
        <div className="bg-ops-border/20 rounded px-3 py-2">
          <div className="text-[10px] text-ops-muted font-bold">SHIPPING DELAY</div>
          <div className="text-sm font-bold font-mono text-[#ff6600]">{disruptions.shippingDelay}</div>
        </div>
      </div>

      {/* GDP impact by region */}
      <div className="text-[11px] text-ops-muted font-bold tracking-wider">GDP IMPACT BY REGION</div>
      {gdpImpact.map((g) => {
        const barPct = (Math.abs(g.pct) / maxPct) * 100;
        return (
          <div key={g.region} className="py-1.5 border-b border-ops-border/30">
            <div className="flex items-center gap-2 mb-1">
              <img src={`https://flagcdn.com/20x15/${g.flag}.png`} alt="" className="w-5 h-3.5 rounded-sm" />
              <span className="text-[13px] font-bold text-ops-text w-12">{g.region}</span>
              <div className="flex-1 h-3 bg-ops-border/20 rounded overflow-hidden">
                <div className="h-full rounded transition-all duration-500" style={{ width: `${barPct}%`, background: 'linear-gradient(90deg, #ef4060, #cc0033)' }} />
              </div>
              <span className="text-xs font-bold font-mono text-ops-red w-14 text-right">{g.pct}%</span>
            </div>
            <div className="flex items-center justify-between pl-7">
              <span className="text-[10px] text-ops-muted">{g.note}</span>
              {g.costBn > 0 && <span className="text-[10px] text-ops-muted">${g.costBn}B</span>}
            </div>
          </div>
        );
      })}
      <p className="text-[10px] text-ops-muted pt-2 border-t border-ops-border/30">Sources: IEA, Goldman Sachs, IMF, Oxford Economics</p>
    </div>
  );
}

export default function MarketImpact() {
  const [activeTab, setActiveTab] = useState('markets');
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
      <div className="panel-header px-3 py-2 flex items-center justify-between">
        <span className="text-[#00b4d8] text-[11px] font-bold tracking-widest mr-2">MARKETS</span>
        <div className="flex ml-auto items-center gap-2">
          {[['markets', 'LIVE'], ['global', 'GLOBAL']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-2 py-1 text-[9px] font-bold tracking-widest transition-all duration-150 border-b-2 ${
                activeTab === key ? 'text-[#00b4d8] border-[#00b4d8]' : 'text-ops-muted border-transparent hover:text-ops-text'
              }`}>{label}</button>
          ))}
          {activeTab === 'markets' && markets.some((m) => m.live) && (
            <span className="flex items-center gap-1">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-green-500 text-[9px] font-bold">LIVE</span>
            </span>
          )}
        </div>
      </div>

      {activeTab === 'global' ? <GlobalImpactPanel /> : <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-2">
          {markets.map((m) => {
            const up = m.change >= 0;
            const color = up ? '#22c55e' : '#ff0040';
            return (
              <div key={m.id} className="flex items-center gap-2 py-1.5 border-b border-ops-border/30 hover:bg-ops-border/10 rounded transition-colors duration-150">
                <span className="text-xs font-mono" style={{ color }}>{up ? '▲' : '▼'}</span>
                <span className="text-xs font-bold text-ops-muted font-mono">{m.label}</span>
                <span className="text-[13px] font-bold font-mono text-ops-text">{formatPrice(m.price)}</span>
                <span className="text-xs font-bold font-mono ml-auto" style={{ color }}>
                  {up ? '+' : ''}{m.change.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Economic Impact */}
        <div className="panel-header px-3 py-2 flex items-center justify-between">
          <span className="text-[#ff6600] text-[11px] font-bold tracking-widest">ECONOMIC IMPACT</span>
          <span className="text-ops-muted text-[9px]">EST. COSTS</span>
        </div>
        <EconomicImpact />
      </div>}
    </div>
  );
}

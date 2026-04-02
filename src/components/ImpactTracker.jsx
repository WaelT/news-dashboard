import { useMemo, useState } from 'react';
import casualtyTimeline from '../data/casualtyTimeline';
import CountryDetailModal from './CountryDetailModal';
// Note: casualties data is updated via GitHub Action (scripts/update-casualties.mjs)

const PARTY_META = [
  { key: 'iran', cc: 'ir', label: 'Iran', color: '#ff0040' },
  { key: 'israel', cc: 'il', label: 'Israel', color: '#0088cc' },
  { key: 'usa', cc: 'us', label: 'USA', color: '#3b82f6' },
  { key: 'lebanon', cc: 'lb', label: 'Lebanon', color: '#ff6600' },
  { key: 'yemen', cc: 'ye', label: 'Yemen', color: '#d4a017' },
  { key: 'iraq', cc: 'iq', label: 'Iraq', color: '#8ac926' },
  { key: 'uae', cc: 'ae', label: 'UAE', color: '#e5e5e5' },
  { key: 'kuwait', cc: 'kw', label: 'Kuwait', color: '#00a676' },
  { key: 'bahrain', cc: 'bh', label: 'Bahrain', color: '#ef4444' },
  { key: 'qatar', cc: 'qa', label: 'Qatar', color: '#8b1a3a' },
  { key: 'saudi', cc: 'sa', label: 'Saudi Arabia', color: '#22c55e' },
  { key: 'syria', cc: 'sy', label: 'Syria', color: '#c084fc' },
  { key: 'palestine', cc: 'ps', label: 'Palestine', color: '#22c55e' },
];

function flagUrl(cc) {
  return `https://flagcdn.com/20x15/${cc}.png`;
}

const DEFAULT_CASUALTIES = {
  iran: { killed: 3486, wounded: 26500 },
  israel: { killed: 30, wounded: 6548 },
  usa: { killed: 15, wounded: 348 },
  lebanon: { killed: 1318, wounded: 3935 },
  yemen: { killed: 0, wounded: 0 },
  iraq: { killed: 108, wounded: 216 },
  uae: { killed: 12, wounded: 169 },
  kuwait: { killed: 9, wounded: 109 },
  bahrain: { killed: 3, wounded: 38 },
  qatar: { killed: 4, wounded: 16 },
  saudi: { killed: 2, wounded: 16 },
  jordan: { killed: 0, wounded: 19 },
  oman: { killed: 3, wounded: 5 },
  syria: { killed: 4, wounded: 0 },
  palestine: { killed: 10, wounded: 0 },
  turkey: { killed: 3, wounded: 0 },
  france: { killed: 1, wounded: 0 },
  philippines: { killed: 1, wounded: 0 },
  azerbaijan: { killed: 0, wounded: 4 },
};

function formatNum(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

const TREND_LINES = [
  { key: 'iran', label: 'Iran', color: '#ff0040' },
  { key: 'lebanon', label: 'Lebanon', color: '#ff6600' },
  { key: 'israel', label: 'Israel', color: '#0088cc' },
  { key: 'usa', label: 'USA', color: '#3b82f6' },
];

function TrendChart() {
  const W = 600;
  const H = 350;
  const PAD = { top: 14, right: 14, bottom: 30, left: 50 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const data = casualtyTimeline;
  const maxY = Math.max(...data.map((d) => d.iran), 1);
  const yTicks = [0, Math.round(maxY / 4), Math.round(maxY / 2), Math.round((maxY * 3) / 4), maxY];

  const x = (i) => PAD.left + (i / (data.length - 1)) * chartW;
  const y = (v) => PAD.top + chartH - (v / maxY) * chartH;

  const makePath = (key) =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d[key] || 0).toFixed(1)}`).join(' ');

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return `MAR ${d.getDate()}`;
  };

  return (
    <div className="flex-1 min-h-0 overflow-hidden px-3 py-2 flex flex-col">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full flex-1" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines & Y labels */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} y1={y(tick)} x2={W - PAD.right} y2={y(tick)} stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
            <text x={PAD.left - 6} y={y(tick) + 4} textAnchor="end" fill="#9ca3af" fontSize="11" fontWeight="bold" fontFamily="monospace">
              {formatNum(tick)}
            </text>
          </g>
        ))}
        {/* X labels — every 2nd date */}
        {data.map((d, i) =>
          i % 2 === 0 ? (
            <text key={d.date} x={x(i)} y={H - 6} textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="bold" fontFamily="monospace">
              {formatDate(d.date)}
            </text>
          ) : null,
        )}
        {/* Lines */}
        {TREND_LINES.map((line) => (
          <path key={line.key} d={makePath(line.key)} fill="none" stroke={line.color} strokeWidth="2.5" strokeLinejoin="round" />
        ))}
        {/* End-of-line value labels */}
        {TREND_LINES.map((line) => {
          const lastVal = data[data.length - 1][line.key] || 0;
          if (lastVal === 0) return null;
          return (
            <text key={`label-${line.key}`} x={x(data.length - 1) + 6} y={y(lastVal) + 4} fill={line.color} fontSize="10" fontWeight="bold" fontFamily="monospace">
              {formatNum(lastVal)}
            </text>
          );
        })}
      </svg>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 flex-wrap justify-center">
        {TREND_LINES.map((line) => (
          <div key={line.key} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: line.color }} />
            <span className="text-[10px] font-mono font-bold text-ops-muted">{line.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ImpactTracker() {
  const [activeTab, setActiveTab] = useState('country');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const casualties = DEFAULT_CASUALTIES;

  const parties = useMemo(
    () =>
      PARTY_META
        .map((p) => ({
          ...p,
          killed: casualties[p.key]?.killed || 0,
          wounded: casualties[p.key]?.wounded || 0,
          total: (casualties[p.key]?.killed || 0) + (casualties[p.key]?.wounded || 0),
        }))
        .filter((p) => p.total > 0)
        .sort((a, b) => b.total - a.total),
    [casualties],
  );

  const maxValue = useMemo(
    () => Math.max(...parties.map((p) => Math.max(p.killed, p.wounded)), 1),
    [parties],
  );

  const totalKilled = parties.reduce((s, p) => s + p.killed, 0);
  const totalWounded = parties.reduce((s, p) => s + p.wounded, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="panel-header px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-ops-red text-[11px] font-bold tracking-widest mr-2">CASUALTIES</span>
          <button
            onClick={() => setActiveTab('country')}
            className={`px-2.5 py-1 text-[9px] font-bold tracking-widest transition-all duration-150 border-b-2 ${activeTab === 'country' ? 'text-ops-red border-ops-red' : 'text-ops-muted border-transparent hover:text-ops-text'}`}
          >
            BY COUNTRY
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`px-2.5 py-1 text-[9px] font-bold tracking-widest transition-all duration-150 border-b-2 ${activeTab === 'trend' ? 'text-ops-red border-ops-red' : 'text-ops-muted border-transparent hover:text-ops-text'}`}
          >
            TREND
          </button>
        </div>
        <span className="text-ops-muted text-[9px]">APR 2, 2026</span>
      </div>

      {/* Totals bar */}
      <div className="px-3 py-2 border-b border-ops-border/50 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4060]" />
          <span className="text-[9px] text-ops-muted font-bold">KILLED</span>
          <span className="text-sm font-bold font-mono text-[#ff0040]">{formatNum(totalKilled)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6600]" />
          <span className="text-[8px] text-ops-muted font-bold">WOUNDED</span>
          <span className="text-sm font-bold font-mono text-[#ff6600]">{formatNum(totalWounded)}</span>
        </div>
      </div>

      {activeTab === 'country' ? (
        /* Bar chart */
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-2">
          {parties.map((p) => {
            const killedPct = (p.killed / maxValue) * 100;
            const woundedPct = (p.wounded / maxValue) * 100;
            return (
              <div key={p.key} className="cursor-pointer hover:bg-ops-border/10 rounded px-1 -mx-1 transition-colors" onClick={() => setSelectedCountry(p.key)}>
                {/* Country label */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <img src={flagUrl(p.cc)} alt={p.label} className="w-5 h-3.5 object-cover rounded-sm border border-white/10" />
                    <span className="text-xs font-bold" style={{ color: p.color }}>{p.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-ops-muted">{p.total.toLocaleString()}</span>
                </div>
                {/* Killed bar */}
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="flex-1 h-3.5 bg-ops-border/20 rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-700 flex items-center"
                      style={{ width: `${killedPct}%`, background: 'linear-gradient(90deg, #ef4060, #cc0033)' }}
                    >
                      {killedPct > 18 && <img src={flagUrl(p.cc)} alt="" className="w-3 h-2 ml-1 rounded-sm opacity-50" />}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#ef4060] w-12 text-right">
                    {p.killed > 0 ? formatNum(p.killed) : '-'}
                  </span>
                </div>
                {/* Wounded bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3.5 bg-ops-border/20 rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-700"
                      style={{ width: `${woundedPct}%`, background: 'linear-gradient(90deg, #ff6600, #cc5200)' }}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#ff6600] w-12 text-right">
                    {p.wounded > 0 ? formatNum(p.wounded) : '-'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <TrendChart />
      )}

      {/* Source */}
      <div className="px-3 py-1 border-t border-ops-border/50">
        <p className="text-ops-muted text-[7px]">
          Sources: Wikipedia, Al Jazeera, HRANA, Reuters.
        </p>
      </div>

      <CountryDetailModal
        country={selectedCountry}
        isOpen={!!selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />
    </div>
  );
}

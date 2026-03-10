import { useMemo } from 'react';
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
  iran: { killed: 180, wounded: 12000 },
  israel: { killed: 18, wounded: 2142 },
  usa: { killed: 9, wounded: 20 },
  lebanon: { killed: 486, wounded: 1313 },
  yemen: { killed: 0, wounded: 0 },
  iraq: { killed: 21, wounded: 24 },
  uae: { killed: 10, wounded: 112 },
  kuwait: { killed: 8, wounded: 99 },
  bahrain: { killed: 3, wounded: 38 },
  qatar: { killed: 0, wounded: 16 },
  saudi: { killed: 2, wounded: 12 },
  jordan: { killed: 0, wounded: 5 },
  oman: { killed: 1, wounded: 5 },
  syria: { killed: 0, wounded: 0 },
  palestine: { killed: 0, wounded: 0 },
};

function formatNum(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function ImpactTracker() {
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
      <div className="px-3 py-1.5 border-b border-ops-border flex items-center justify-between">
        <span className="text-ops-red text-[10px] font-bold tracking-widest">CASUALTIES</span>
        <span className="text-ops-muted text-[8px]">MAR 8, 2026</span>
      </div>

      {/* Totals bar */}
      <div className="px-3 py-1.5 border-b border-ops-border/50 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff0040]" />
          <span className="text-[8px] text-ops-muted font-bold">KILLED</span>
          <span className="text-sm font-bold font-mono text-[#ff0040]">{formatNum(totalKilled)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6600]" />
          <span className="text-[8px] text-ops-muted font-bold">WOUNDED</span>
          <span className="text-sm font-bold font-mono text-[#ff6600]">{formatNum(totalWounded)}</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-2">
        {parties.map((p) => {
          const killedPct = (p.killed / maxValue) * 100;
          const woundedPct = (p.wounded / maxValue) * 100;
          return (
            <div key={p.key}>
              {/* Country label */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold" style={{ color: p.color }}>{p.label}</span>
                  <img src={flagUrl(p.cc)} alt={p.label} className="w-4 h-3 object-cover rounded-sm" />
                </div>
                <span className="text-[11px] font-mono text-ops-muted">{p.total.toLocaleString()}</span>
              </div>
              {/* Killed bar */}
              <div className="flex items-center gap-2 mb-0.5">
                <div className="flex-1 h-3 bg-ops-border/20 rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-all duration-500"
                    style={{ width: `${killedPct}%`, background: '#cc0033' }}
                  />
                </div>
                <span className="text-[11px] font-mono font-bold text-[#ff0040] w-12 text-right">
                  {p.killed > 0 ? formatNum(p.killed) : '-'}
                </span>
              </div>
              {/* Wounded bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-ops-border/20 rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-all duration-500"
                    style={{ width: `${woundedPct}%`, background: '#cc5200' }}
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

      {/* Source */}
      <div className="px-3 py-1 border-t border-ops-border/50">
        <p className="text-ops-muted text-[7px]">
          Sources: Wikipedia, Al Jazeera, HRANA, Reuters.
        </p>
      </div>
    </div>
  );
}

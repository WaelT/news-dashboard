import { useMemo } from 'react';
import launchData, { countryBreakdown } from '../data/launchData';

const TARGET_CC = {
  Israel: 'il',
  UAE: 'ae',
  Qatar: 'qa',
  Kuwait: 'kw',
  Bahrain: 'bh',
  'Saudi Arabia': 'sa',
  Jordan: 'jo',
  Iraq: 'iq',
};

const COUNTRY_COLORS = {
  UAE: '#a855f7',
  Israel: '#0088cc',
  Kuwait: '#00a676',
  Bahrain: '#ef4444',
  Qatar: '#8b1a3a',
  'Saudi Arabia': '#22c55e',
  Jordan: '#d4a017',
  Iraq: '#8ac926',
};

function StackedBar({ data, label, color }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const segments = data.map((item) => ({
    ...item,
    pct: (item.count / total) * 100,
  }));

  return (
    <div className="group/bar">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[9px] font-bold tracking-widest" style={{ color }}>{label}</span>
        <span className="text-[10px] font-mono font-bold ml-auto" style={{ color }}>{formatNum(total)}</span>
      </div>
      <div className="flex h-5 rounded-sm gap-px cursor-pointer">
        {segments.map((s) => {
          const cc = TARGET_CC[s.country];
          return (
            <div
              key={s.country}
              className="h-full overflow-hidden flex items-center justify-center rounded-sm"
              style={{
                width: `${s.pct}%`,
                background: COUNTRY_COLORS[s.country] || '#666',
                minWidth: s.pct > 1 ? 3 : 0,
              }}
            >
              {s.pct >= 12 && cc && (
                <img src={flagUrl(cc)} alt={s.country} className="w-4 h-3 object-cover rounded-sm border border-black/30 mr-1" />
              )}
              {s.pct >= 12 && (
                <span className="text-[9px] font-mono font-bold text-black/80">{s.pct.toFixed(0)}%</span>
              )}
            </div>
          );
        })}
      </div>
      {/* Inline breakdown on hover */}
      <div className="hidden group-hover/bar:grid grid-cols-2 gap-x-3 gap-y-1 mt-1.5">
        {segments.map((s) => {
          const cc = TARGET_CC[s.country];
          return (
            <div key={s.country} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: COUNTRY_COLORS[s.country] || '#666' }} />
              {cc && <img src={flagUrl(cc)} alt={s.country} className="w-4 h-3 object-cover rounded-sm shrink-0" />}
              <span className="text-[11px] text-ops-text font-bold truncate">{s.country}</span>
              <span className="text-[11px] font-mono font-bold ml-auto shrink-0" style={{ color }}>{s.pct.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function flagUrl(cc) {
  return `https://flagcdn.com/20x15/${cc}.png`;
}

function formatNum(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

export default function MissileDroneTracker() {
  const days = useMemo(() => [...launchData].reverse(), []);

  const totals = useMemo(() => {
    const missiles = launchData.reduce((s, d) => s + d.missiles, 0);
    const drones = launchData.reduce((s, d) => s + d.drones, 0);
    const intercepted = launchData.reduce((s, d) => s + d.intercepted, 0);
    const total = missiles + drones;
    const rate = total > 0 ? ((intercepted / total) * 100).toFixed(1) : 0;
    return { missiles, drones, intercepted, total, rate };
  }, []);

  const maxDaily = useMemo(
    () => Math.max(...launchData.map((d) => d.missiles + d.drones), 1),
    [],
  );

  const dateRange = launchData.length > 0
    ? `${formatDate(launchData[0].date)} – ${formatDate(launchData[launchData.length - 1].date)}`
    : '';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-1.5 border-b border-ops-border flex items-center justify-between">
        <span className="text-ops-red text-[11px] font-bold tracking-widest">IRAN MISSILES & DRONES</span>
        <span className="text-ops-muted text-[9px]">{dateRange}</span>
      </div>

      {/* Totals bar */}
      <div className="px-3 py-1.5 border-b border-ops-border/50 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#cc0033]" />
          <span className="text-[9px] text-ops-muted font-bold">MISSILES</span>
          <span className="text-base font-bold font-mono text-[#ff0040]">{formatNum(totals.missiles)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#cc5200]" />
          <span className="text-[9px] text-ops-muted font-bold">DRONES</span>
          <span className="text-base font-bold font-mono text-[#ff6600]">{formatNum(totals.drones)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]" />
          <span className="text-[9px] text-ops-muted font-bold">INTERCEPT</span>
          <span className="text-base font-bold font-mono text-[#00ff41]">{totals.rate}%</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Daily bar chart */}
        <div className="px-3 py-2 space-y-1.5">
          {days.map((day) => {
            const total = day.missiles + day.drones;
            const missilePct = (day.missiles / maxDaily) * 100;
            const dronePct = (day.drones / maxDaily) * 100;
            const interceptRate = total > 0 ? Math.round((day.intercepted / total) * 100) : 0;
            return (
              <div key={day.date} className="group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[11px] font-mono text-ops-muted w-12 shrink-0">
                    {formatDate(day.date).replace(/, /g, ' ')}
                  </span>
                  <div className="flex-1 h-5 flex rounded-sm overflow-hidden bg-ops-border/20">
                    <div
                      className="h-full transition-all duration-500"
                      style={{ width: `${missilePct}%`, background: '#cc0033' }}
                    />
                    <div
                      className="h-full transition-all duration-500"
                      style={{ width: `${dronePct}%`, background: '#cc5200' }}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-ops-text w-8 text-right shrink-0">
                    {formatNum(total)}
                  </span>
                </div>
                {/* Inline breakdown on hover */}
                <div className="hidden group-hover:flex items-center gap-3 pl-14 py-0.5 text-[10px] font-mono">
                  <span><span className="text-[#ff0040] font-bold">{day.missiles}</span> <span className="text-ops-muted">missiles</span></span>
                  <span><span className="text-[#ff6600] font-bold">{day.drones}</span> <span className="text-ops-muted">drones</span></span>
                  <span><span className="text-[#00ff41] font-bold">{interceptRate}%</span> <span className="text-ops-muted">int.</span></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Country breakdown pie charts */}
        <div className="px-3 py-2 border-t border-ops-border/30 space-y-3">
          <StackedBar data={countryBreakdown.missiles} label="MISSILES BY TARGET" color="#ff0040" />
          <StackedBar data={countryBreakdown.drones} label="DRONES BY TARGET" color="#ff6600" />
        </div>
      </div>
    </div>
  );
}

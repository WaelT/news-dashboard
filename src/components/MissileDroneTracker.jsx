import { useMemo } from 'react';
import launchData from '../data/launchData';

const TARGET_CC = {
  Israel: 'il',
  UAE: 'ae',
  Qatar: 'qa',
  Kuwait: 'kw',
  Bahrain: 'bh',
  'Saudi Arabia': 'sa',
};

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

  const targetedCountries = useMemo(() => {
    const set = new Set();
    for (const day of launchData) {
      for (const t of day.targets) set.add(t);
    }
    return [...set];
  }, []);

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
            return (
              <div key={day.date} className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-ops-muted w-12 shrink-0">
                  {formatDate(day.date).replace(/, /g, ' ')}
                </span>
                <div className="flex-1 h-5 flex rounded-sm overflow-hidden bg-ops-border/20">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${missilePct}%`, background: '#cc0033' }}
                    title={`${day.missiles} missiles`}
                  />
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${dronePct}%`, background: '#cc5200' }}
                    title={`${day.drones} drones`}
                  />
                </div>
                <span className="text-[11px] font-mono font-bold text-ops-text w-8 text-right shrink-0">
                  {formatNum(total)}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Targeted countries — pinned to bottom */}
      <div className="px-3 py-1.5 border-t border-ops-border/50">
        <div className="text-[9px] text-ops-muted font-bold tracking-widest mb-1">TARGETED COUNTRIES</div>
        <div className="flex items-center gap-3 flex-wrap">
          {targetedCountries.map((name) => (
            <div key={name} className="flex items-center gap-1">
              {TARGET_CC[name] && (
                <img src={flagUrl(TARGET_CC[name])} alt={name} className="w-4 h-3 object-cover rounded-sm" />
              )}
              <span className="text-[11px] font-mono text-ops-text">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import launchData, { countryBreakdown } from '../data/launchData';
import { infrastructureDamage } from '../data/infrastructureDamage';
import { warCostComparison } from '../data/warCostComparison';

const WAR_START = '2026-02-28';

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
              {cc && <img src={flagUrl(cc)} alt={s.country} className="w-5 h-3.5 object-cover rounded-sm shrink-0" />}
              <span className="text-[13px] text-white font-bold truncate">{s.country}</span>
              <span className="text-[13px] font-mono font-bold ml-auto shrink-0" style={{ color }}>{s.count.toLocaleString()}</span>
              <span className="text-[11px] font-mono text-gray-400 shrink-0">({s.pct.toFixed(1)}%)</span>
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

// Days since war started
function warDay(dateStr) {
  const start = new Date(WAR_START + 'T00:00:00');
  const d = new Date(dateStr + 'T00:00:00');
  return Math.floor((d - start) / 86400000) + 1;
}

// Group daily data into war weeks (7-day chunks from Feb 28)
function groupByWarWeek(data) {
  const weeks = [];
  let currentWeek = null;

  for (const day of data) {
    const dayNum = warDay(day.date);
    const weekNum = Math.ceil(dayNum / 7);

    if (!currentWeek || currentWeek.weekNum !== weekNum) {
      if (currentWeek) weeks.push(currentWeek);
      currentWeek = { weekNum, startDate: day.date, endDate: day.date, missiles: 0, drones: 0, intercepted: 0, days: [] };
    }

    currentWeek.endDate = day.date;
    currentWeek.missiles += day.missiles;
    currentWeek.drones += day.drones;
    currentWeek.intercepted += day.intercepted;
    currentWeek.days.push(day);
  }

  if (currentWeek) weeks.push(currentWeek);
  return weeks;
}

// Gauge chart for interception rate
function InterceptionGauge({ data }) {
  const totalLaunched = data.reduce((s, d) => s + d.missiles + d.drones, 0);
  const totalIntercepted = data.reduce((s, d) => s + d.intercepted, 0);
  const currentRate = totalLaunched > 0 ? (totalIntercepted / totalLaunched) * 100 : 0;

  // Last 3 days average
  const recent = data.slice(-3);
  const recentLaunched = recent.reduce((s, d) => s + d.missiles + d.drones, 0);
  const recentIntercepted = recent.reduce((s, d) => s + d.intercepted, 0);
  const recentRate = recentLaunched > 0 ? (recentIntercepted / recentLaunched) * 100 : 0;

  // Worst day
  const dayRates = data.map((d) => {
    const t = d.missiles + d.drones;
    return { date: d.date, rate: t > 0 ? (d.intercepted / t) * 100 : 0 };
  });
  const worst = dayRates.reduce((a, b) => (a.rate < b.rate ? a : b));
  const best = dayRates.reduce((a, b) => (a.rate > b.rate ? a : b));

  const W = 200;
  const H = 120;
  const cx = W / 2;
  const cy = 90;
  const r = 70;
  const startAngle = Math.PI;
  const endAngle = 0;

  function rateToAngle(rate) {
    return startAngle - (rate / 100) * Math.PI;
  }

  function arcPath(startA, endA, radius) {
    const x1 = cx + radius * Math.cos(startA);
    const y1 = cy - radius * Math.sin(startA);
    const x2 = cx + radius * Math.cos(endA);
    const y2 = cy - radius * Math.sin(endA);
    const large = Math.abs(endA - startA) > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  }

  const needleAngle = rateToAngle(currentRate);
  const needleX = cx + (r - 12) * Math.cos(needleAngle);
  const needleY = cy - (r - 12) * Math.sin(needleAngle);

  // Color zones: red < 70, yellow 70-90, green > 90
  const greenVar = 'var(--ops-green, #00ff41)';
  const greenDimVar = 'var(--ops-green-dim, #00ff4133)';
  const gaugeColor = currentRate >= 90 ? greenVar : currentRate >= 70 ? '#ffcc00' : '#ff0040';

  return (
    <div className="px-3 py-2">
      <div className="text-[11px] font-bold tracking-widest mb-1" style={{ color: greenVar }}>INTERCEPTION RATE</div>
      <div className="flex items-start gap-3">
        {/* Gauge */}
        <svg viewBox={`0 0 ${W} ${H}`} className="flex-1" style={{ maxWidth: 200, height: 120 }}>
          <defs>
            <linearGradient id="gauge-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4060" />
              <stop offset="50%" stopColor="#ffcc00" />
              <stop offset="100%" stopColor="#2dd4a8" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path d={arcPath(startAngle, endAngle, r)} fill="none" stroke="#1a2a3a" strokeWidth="14" strokeLinecap="round" />

          {/* Gradient zone overlay */}
          <path d={arcPath(startAngle, endAngle, r)} fill="none" stroke="url(#gauge-gradient)" strokeWidth="14" strokeLinecap="round" opacity="0.2" />

          {/* Tick marks */}
          {[25, 50, 75].map(pct => {
            const a = rateToAngle(pct);
            const x1 = cx + (r - 9) * Math.cos(a);
            const y1 = cy - (r - 9) * Math.sin(a);
            const x2 = cx + (r + 9) * Math.cos(a);
            const y2 = cy - (r + 9) * Math.sin(a);
            return <line key={pct} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="1" />;
          })}

          {/* Active arc */}
          <path d={arcPath(startAngle, needleAngle, r)} fill="none" stroke="url(#gauge-gradient)" strokeWidth="14" strokeLinecap="round" />

          {/* Needle */}
          <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={gaugeColor} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="5" fill={gaugeColor} />
          <circle cx={cx} cy={cy} r="2.5" fill="#050a0e" />

          {/* Rate text */}
          <text x={cx} y={cy - 18} textAnchor="middle" fill={gaugeColor} fontSize="22" fontFamily="monospace" fontWeight="bold">
            {currentRate.toFixed(1)}%
          </text>
          <text x={cx} y={cy - 4} textAnchor="middle" fill="#9ca3af" fontSize="9" fontFamily="monospace" fontWeight="bold">
            OVERALL
          </text>

          {/* Scale labels */}
          <text x={cx - r - 2} y={cy + 14} textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="monospace" fontWeight="bold">0%</text>
          <text x={cx} y={cy - r - 4} textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="monospace" fontWeight="bold">50%</text>
          <text x={cx + r + 2} y={cy + 14} textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="monospace" fontWeight="bold">100%</text>
        </svg>

        {/* Stats sidebar */}
        <div className="flex-1 min-w-0 space-y-1.5 pt-1">
          <div className="py-1 border-b border-ops-border/30">
            <div className="text-[8px] text-gray-500 tracking-wider">LAST 3 DAYS</div>
            <div className="text-[14px] font-bold font-mono" style={{ color: recentRate >= 90 ? greenVar : recentRate >= 70 ? '#ffcc00' : '#ff0040' }}>
              {recentRate.toFixed(1)}%
            </div>
          </div>
          <div className="py-1 border-b border-ops-border/30">
            <div className="text-[8px] text-gray-500 tracking-wider">BEST DAY</div>
            <div className="flex items-baseline gap-1">
              <span className="text-[12px] font-bold font-mono" style={{ color: greenVar }}>{best.rate.toFixed(0)}%</span>
              <span className="text-[8px] text-gray-500">D{warDay(best.date)}</span>
            </div>
          </div>
          <div className="py-1">
            <div className="text-[8px] text-gray-500 tracking-wider">WORST DAY</div>
            <div className="flex items-baseline gap-1">
              <span className="text-[12px] font-bold font-mono text-[#ff0040]">{worst.rate.toFixed(0)}%</span>
              <span className="text-[8px] text-gray-500">D{warDay(worst.date)}</span>
            </div>
          </div>
          <div className="py-1 border-t border-ops-border/30">
            <div className="text-[8px] text-gray-500 tracking-wider">INTERCEPTED</div>
            <div className="text-[12px] font-bold font-mono text-gray-300">{formatNum(totalIntercepted)} <span className="text-[9px] text-gray-500">/ {formatNum(totalLaunched)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Capability degradation line chart
function CapabilityDegradation({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const dailyTotals = data.map((d) => ({
    day: warDay(d.date),
    total: d.missiles + d.drones,
  }));

  const peak = dailyTotals[0].total;
  const current = dailyTotals[dailyTotals.length - 1].total;
  const declinePct = peak > 0 ? Math.round(((current - peak) / peak) * 100) : 0;

  const maxTotal = Math.max(...dailyTotals.map((d) => d.total));
  const W = 300;
  const H = 120;
  const padL = 32;
  const padR = 4;
  const padT = 6;
  const padB = 20;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const points = dailyTotals.map((d, i) => {
    const x = padL + (i / (dailyTotals.length - 1)) * chartW;
    const y = padT + chartH - (d.total / maxTotal) * chartH;
    return { x, y, day: d.day, total: d.total };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = linePath + ` L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`;

  // X-axis labels: show every 3rd day
  const xLabels = points.filter((_, i) => i % 3 === 0);

  return (
    <div className="px-3 py-2">
      <div className="text-xs font-bold tracking-widest mb-1.5" style={{ color: '#d4a017' }}>
        CAPABILITY DEGRADATION
      </div>

      {/* SVG line chart */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }}>
        {/* Axis lines */}
        <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#1a2d3d" strokeWidth="0.5" />
        <line x1={padL} y1={padT + chartH} x2={padL + chartW} y2={padT + chartH} stroke="#1a2d3d" strokeWidth="0.5" />

        {/* Horizontal gridlines */}
        {[0.25, 0.5, 0.75].map(frac => {
          const yPos = padT + chartH - frac * chartH;
          return (
            <g key={frac}>
              <line x1={padL} y1={yPos} x2={padL + chartW} y2={yPos} stroke="#1a2d3d" strokeWidth="0.5" strokeDasharray="3,2" />
              <text x={padL - 3} y={yPos + 3} textAnchor="end" fill="#6e7681" fontSize="8" fontFamily="monospace">
                {formatNum(Math.round(maxTotal * frac))}
              </text>
            </g>
          );
        })}

        {/* Fill area */}
        <path d={areaPath} fill="#ef4060" opacity="0.1" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#ef4060" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Data points — interactive */}
        {points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} style={{ cursor: 'pointer' }}>
            <circle cx={p.x} cy={p.y} r="8" fill="transparent" />
            <circle cx={p.x} cy={p.y} r={hoveredIdx === i ? 3.5 : 1.5} fill="#ef4060" style={{ transition: 'r 0.15s ease' }} />
          </g>
        ))}

        {/* Hover tooltip */}
        {hoveredIdx !== null && (() => {
          const p = points[hoveredIdx];
          const tw = 52, th = 26;
          const tx = Math.min(Math.max(p.x - tw / 2, padL), padL + chartW - tw);
          const ty = p.y - th - 6;
          return (
            <g>
              <rect x={tx} y={ty} width={tw} height={th} rx="3" fill="#0c1320" stroke="#1a2d3d" strokeWidth="0.5" />
              <text x={tx + tw / 2} y={ty + 11} textAnchor="middle" fill="#ef4060" fontSize="10" fontWeight="bold" fontFamily="monospace">
                {p.total}
              </text>
              <text x={tx + tw / 2} y={ty + 21} textAnchor="middle" fill="#9ca3af" fontSize="8" fontFamily="monospace">
                Day {p.day}
              </text>
            </g>
          );
        })()}

        {/* X-axis labels */}
        {xLabels.map((p) => (
          <text key={p.day} x={p.x} y={padT + chartH + 14} textAnchor="middle" fill="#9ca3af" fontSize="9" fontWeight="bold" fontFamily="monospace">
            D{p.day}
          </text>
        ))}

        {/* Y-axis labels */}
        <text x={padL - 3} y={padT + 4} textAnchor="end" fill="#9ca3af" fontSize="9" fontWeight="bold" fontFamily="monospace">
          {formatNum(maxTotal)}
        </text>
        <text x={padL - 3} y={padT + chartH + 3} textAnchor="end" fill="#9ca3af" fontSize="9" fontWeight="bold" fontFamily="monospace">
          0
        </text>
      </svg>

      {/* Stat boxes */}
      <div className="flex gap-2 mt-1.5">
        <div className="flex-1 bg-ops-border/20 rounded px-2 py-1 text-center">
          <div className="text-[8px] text-gray-500 tracking-wider font-bold">PEAK</div>
          <div className="text-[14px] font-bold font-mono" style={{ color: '#ff0040' }}>{formatNum(peak)}</div>
        </div>
        <div className="flex-1 bg-ops-border/20 rounded px-2 py-1 text-center">
          <div className="text-[8px] text-gray-500 tracking-wider font-bold">CURRENT</div>
          <div className="text-[14px] font-bold font-mono" style={{ color: '#d4a017' }}>{formatNum(current)}</div>
        </div>
        <div className="flex-1 bg-ops-border/20 rounded px-2 py-1 text-center">
          <div className="text-[8px] text-gray-500 tracking-wider font-bold">DECLINE</div>
          <div className="text-[14px] font-bold font-mono" style={{ color: 'var(--ops-green, #00ff41)' }}>{declinePct}%</div>
        </div>
      </div>
    </div>
  );
}

function InfrastructureDamage() {
  const { categories } = infrastructureDamage;
  const overall = Math.round(categories.reduce((s, c) => s + c.destructionPct, 0) / categories.length);

  function barColor(pct) {
    if (pct >= 80) return '#ef4060';
    if (pct >= 60) return '#ff6600';
    if (pct >= 30) return '#d4a017';
    return '#2dd4a8';
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-ops-muted font-bold tracking-wider">OVERALL DEGRADATION</span>
        <span className="text-xl font-bold font-mono" style={{ color: barColor(overall) }}>{overall}%</span>
      </div>
      {categories.map((cat) => (
        <div key={cat.id}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] font-bold text-ops-text">{cat.label}</span>
            <span className="text-[13px] font-bold font-mono" style={{ color: barColor(cat.destructionPct) }}>{cat.destructionPct}%</span>
          </div>
          <div className="h-4 bg-ops-border/20 rounded overflow-hidden">
            <div className="h-full rounded transition-all duration-700"
              style={{ width: `${cat.destructionPct}%`, background: `linear-gradient(90deg, ${barColor(cat.destructionPct)}, ${barColor(cat.destructionPct)}88)` }} />
          </div>
          <p className="text-[11px] text-ops-muted mt-0.5">{cat.detail}</p>
        </div>
      ))}
      <p className="text-[10px] text-ops-muted pt-2 border-t border-ops-border/30">Sources: Pentagon, Alma Center, Critical Threats, IISS</p>
    </div>
  );
}

function WarCostComparison() {
  const { current, historical } = warCostComparison;
  const maxCost = Math.max(current.costBn, ...historical.map((h) => h.costBn));

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
      {/* Current conflict hero */}
      <div className="bg-ops-red/10 border border-ops-red/30 rounded px-3 py-3">
        <div className="flex items-center gap-2 mb-2">
          <img src={`https://flagcdn.com/20x15/${current.flag}.png`} alt="" className="w-5 h-3.5 rounded-sm border border-white/10" />
          <span className="text-sm font-bold text-ops-red">{current.name}</span>
          <span className="text-[11px] text-ops-muted ml-auto">Day {current.days}</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><div className="text-[10px] text-ops-muted font-bold">COST</div><div className="text-base font-bold font-mono text-ops-red">${current.costBn}B</div></div>
          <div><div className="text-[10px] text-ops-muted font-bold">TROOPS</div><div className="text-base font-bold font-mono text-ops-text">{(current.troops / 1000).toFixed(0)}K</div></div>
          <div><div className="text-[10px] text-ops-muted font-bold">SORTIES</div><div className="text-base font-bold font-mono text-ops-text">{(current.sorties / 1000).toFixed(0)}K</div></div>
        </div>
      </div>

      {/* Historical comparison */}
      <div className="text-[11px] text-ops-muted font-bold tracking-wider">AT DAY {current.days} COMPARISON</div>
      {historical.map((h) => {
        const pct = (h.costBn / maxCost) * 100;
        return (
          <div key={h.name} className="py-2 border-b border-ops-border/30">
            <div className="flex items-center gap-2 mb-1">
              <img src={`https://flagcdn.com/20x15/${h.flag}.png`} alt="" className="w-5 h-3.5 rounded-sm" />
              <span className="text-[13px] font-bold text-ops-text">{h.name}</span>
              <span className="text-xs font-bold font-mono text-ops-muted ml-auto">${h.costBn}B</span>
            </div>
            <div className="h-3 bg-ops-border/20 rounded overflow-hidden mb-1">
              <div className="h-full rounded transition-all duration-500" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-ops-muted">{h.note}</span>
              <span className="text-[10px] text-ops-muted">Total: ${h.totalBn}B / {h.duration}</span>
            </div>
          </div>
        );
      })}
      <p className="text-[10px] text-ops-muted pt-2 border-t border-ops-border/30">Sources: CRS, Penn Wharton, DoD</p>
    </div>
  );
}

export default function MissileDroneTracker() {
  const [activeTab, setActiveTab] = useState('launches');
  const weeks = useMemo(() => groupByWarWeek(launchData), []);

  const totals = useMemo(() => {
    const missiles = launchData.reduce((s, d) => s + d.missiles, 0);
    const drones = launchData.reduce((s, d) => s + d.drones, 0);
    const intercepted = launchData.reduce((s, d) => s + d.intercepted, 0);
    const total = missiles + drones;
    const rate = total > 0 ? ((intercepted / total) * 100).toFixed(1) : 0;
    return { missiles, drones, intercepted, total, rate };
  }, []);

  const maxWeekly = useMemo(
    () => Math.max(...weeks.map((w) => w.missiles + w.drones), 1),
    [weeks],
  );

  const dateRange = launchData.length > 0
    ? `${formatDate(launchData[0].date)} – ${formatDate(launchData[launchData.length - 1].date)}`
    : '';

  return (
    <div className="flex flex-col h-full">
      {/* Header with tabs */}
      <div className="panel-header px-3 py-2 flex items-center justify-between">
        <span className="text-ops-red text-[11px] font-bold tracking-widest mr-2">MILITARY</span>
        <div className="flex ml-auto">
          {[['launches', 'LAUNCHES'], ['damage', 'DAMAGE'], ['cost', 'COST']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-2 py-1 text-[9px] font-bold tracking-widest transition-all duration-150 border-b-2 ${
                activeTab === key ? 'text-ops-red border-ops-red' : 'text-ops-muted border-transparent hover:text-ops-text'
              }`}>{label}</button>
          ))}
        </div>
      </div>

      {activeTab === 'damage' ? <InfrastructureDamage /> : activeTab === 'cost' ? <WarCostComparison /> : <>
      {/* Totals bar */}
      <div className="px-3 py-2 border-b border-ops-border/50 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4304d]" />
          <span className="text-[10px] text-ops-muted font-bold">MISSILES</span>
          <span className="text-base font-bold font-mono text-[#ff0040]">{formatNum(totals.missiles)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#cc5200]" />
          <span className="text-[9px] text-ops-muted font-bold">DRONES</span>
          <span className="text-base font-bold font-mono text-[#ff6600]">{formatNum(totals.drones)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ops-green, #00ff41)' }} />
          <span className="text-[9px] text-ops-muted font-bold">INTERCEPT</span>
          <span className="text-base font-bold font-mono" style={{ color: 'var(--ops-green, #00ff41)' }}>{totals.rate}%</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Weekly bar chart */}
        <div className="px-3 py-2 space-y-1.5">
          {[...weeks].reverse().map((week) => {
            const total = week.missiles + week.drones;
            const missilePct = (week.missiles / maxWeekly) * 100;
            const dronePct = (week.drones / maxWeekly) * 100;
            const interceptRate = total > 0 ? Math.round((week.intercepted / total) * 100) : 0;
            return (
              <div key={week.weekNum} className="group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[11px] group-hover:text-[13px] font-mono text-ops-text group-hover:text-white w-16 shrink-0 font-bold group-hover:font-extrabold tracking-wide transition-all duration-200">
                    WEEK {week.weekNum}
                  </span>
                  <div className="flex-1 h-5 flex rounded overflow-hidden bg-ops-border/20">
                    <div
                      className="h-full transition-all duration-700"
                      style={{ width: `${missilePct}%`, background: 'linear-gradient(90deg, #ef4060, #cc0033)', borderRadius: '4px 0 0 4px' }}
                    />
                    <div
                      className="h-full transition-all duration-700"
                      style={{ width: `${dronePct}%`, background: 'linear-gradient(90deg, #ff6600, #cc5200)', borderRadius: '0 4px 4px 0' }}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-ops-text w-10 text-right shrink-0">
                    {formatNum(total)}
                  </span>
                </div>
                {/* Inline breakdown on hover */}
                <div className="hidden group-hover:block pl-12 py-0.5">
                  <div className="text-[10px] text-gray-300 font-bold mb-0.5">
                    {formatDate(week.startDate)} – {formatDate(week.endDate)} ({week.days.length} days)
                  </div>
                  <div className="flex items-center gap-3 text-[12px] font-mono font-bold">
                    <span><span className="text-[#ff0040]">{week.missiles}</span> <span className="text-gray-300">missiles</span></span>
                    <span><span className="text-[#ff6600]">{week.drones}</span> <span className="text-gray-300">drones</span></span>
                    <span><span style={{ color: 'var(--ops-green, #00ff41)' }}>{interceptRate}%</span> <span className="text-gray-300">int.</span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interception rate gauge + Capability degradation side by side */}
        <div className="flex border-t border-ops-border/30">
          <div className="flex-1 border-r border-ops-border/30">
            <InterceptionGauge data={launchData} />
          </div>
          <div className="flex-1">
            <CapabilityDegradation data={launchData} />
          </div>
        </div>

        {/* Country breakdown stacked bars */}
        <div className="px-3 py-2 border-t border-ops-border/30 space-y-3">
          <StackedBar data={countryBreakdown.missiles} label="MISSILES BY TARGET" color="#ff0040" />
          <StackedBar data={countryBreakdown.drones} label="DRONES BY TARGET" color="#ff6600" />
        </div>
      </div>
      </>}
    </div>
  );
}

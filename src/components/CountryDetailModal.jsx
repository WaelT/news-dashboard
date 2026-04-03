import { useEffect, useRef } from 'react';
import { countryBreakdown } from '../data/launchData';
import casualtyTimeline from '../data/casualtyTimeline';

const COUNTRY_CODE_MAP = {
  iran: 'ir', israel: 'il', usa: 'us', lebanon: 'lb', uae: 'ae',
  kuwait: 'kw', bahrain: 'bh', qatar: 'qa', saudi: 'sa', jordan: 'jo',
  iraq: 'iq', oman: 'om', syria: 'sy', palestine: 'ps', yemen: 'ye',
};

const COUNTRY_LABEL_MAP = {
  iran: 'Iran', israel: 'Israel', usa: 'USA', lebanon: 'Lebanon',
  uae: 'UAE', kuwait: 'Kuwait', bahrain: 'Bahrain', qatar: 'Qatar',
  saudi: 'Saudi Arabia', jordan: 'Jordan', iraq: 'Iraq', oman: 'Oman',
  syria: 'Syria', palestine: 'Palestine', yemen: 'Yemen',
};

const COUNTRY_COLOR_MAP = {
  iran: '#ff0040', israel: '#0088cc', usa: '#3b82f6', lebanon: '#ff6600',
  yemen: '#d4a017', iraq: '#8ac926', uae: '#e5e5e5', kuwait: '#00a676',
  bahrain: '#ef4444', qatar: '#8b1a3a', saudi: '#22c55e', jordan: '#f59e0b',
  oman: '#06b6d4', syria: '#c084fc', palestine: '#22c55e',
};

// Map country keys to the label used in countryBreakdown (target countries)
const BREAKDOWN_LABEL_MAP = {
  israel: 'Israel', uae: 'UAE', saudi: 'Saudi Arabia', kuwait: 'Kuwait',
  qatar: 'Qatar', bahrain: 'Bahrain', jordan: 'Jordan', iraq: 'Iraq',
};

// Extra key stats per country (only show applicable ones)
const COUNTRY_EXTRA_STATS = {
  iran: [
    { label: 'TARGETS STRUCK', value: '10,000+' },
    { label: 'COMBAT SORTIES', value: '8,000+' },
    { label: 'NAVY DESTROYED', value: '92%' },
    { label: 'MISSILES LAUNCHED', value: '1,041' },
    { label: 'LAUNCH RATE DECLINE', value: '-90%' },
    { label: 'CIVILIAN STRUCTURES HIT', value: '82,000+' },
  ],
  lebanon: [
    { label: 'HEZBOLLAH ATTACK WAVES', value: '1,084' },
    { label: 'IDF GROUND TROOPS', value: '50,000' },
    { label: 'TERRITORY CAPTURED', value: '180 km²' },
    { label: 'CIVILIANS DISPLACED', value: '1.2M+' },
    { label: 'LITANI BRIDGES', value: 'All destroyed' },
    { label: 'HEZBOLLAH FIGHTERS KIA', value: '800+' },
  ],
  israel: [
    { label: 'IRON DOME INTERCEPTS', value: '95%+' },
    { label: 'DAVID\'S SLING FAILURE', value: 'Under investigation' },
    { label: 'TEL AVIV MISSILE HIT', value: 'Mar 24' },
    { label: 'DIMONA/ARAD HIT', value: '175+ wounded' },
    { label: 'RESERVISTS CALLED', value: '300K+' },
  ],
  usa: [
    { label: 'TROOPS DEPLOYED', value: '47,000+' },
    { label: 'CARRIER GROUPS', value: '2' },
    { label: 'BASES DAMAGED', value: '17' },
    { label: 'DAILY COST', value: '$1.2B' },
    { label: '5-DAY STRIKE PAUSE', value: 'Energy targets' },
  ],
};

function flagUrl(cc) {
  return `https://flagcdn.com/40x30/${cc}.png`;
}

function formatNum(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

function MiniLineChart({ data, color, width = 220, height = 60 }) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data.map((d) => d.value), 1);
  const padX = 28;
  const padY = 8;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * chartW;
    const y = padY + chartH - (d.value / max) * chartH;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = pathD + ` L${points[points.length - 1].x},${padY + chartH} L${points[0].x},${padY + chartH} Z`;

  return (
    <svg width={width} height={height} className="block mx-auto">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const y = padY + chartH - f * chartH;
        return (
          <line key={f} x1={padX} y1={y} x2={width - padX} y2={y}
            stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
        );
      })}
      {/* Y-axis labels */}
      <text x={padX - 4} y={padY + 3} fill="#888" fontSize={7} textAnchor="end" fontFamily="monospace">
        {formatNum(max)}
      </text>
      <text x={padX - 4} y={padY + chartH + 3} fill="#888" fontSize={7} textAnchor="end" fontFamily="monospace">
        0
      </text>
      {/* Area fill */}
      <path d={areaD} fill={color} opacity={0.1} />
      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      {/* End dot */}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y}
        r={2.5} fill={color} />
      {/* X-axis labels (first and last) */}
      <text x={points[0].x} y={height - 1} fill="#888" fontSize={6} textAnchor="start" fontFamily="monospace">
        {data[0].label}
      </text>
      <text x={points[points.length - 1].x} y={height - 1} fill="#888" fontSize={6} textAnchor="end" fontFamily="monospace">
        {data[data.length - 1].label}
      </text>
    </svg>
  );
}

export default function CountryDetailModal({ country, onClose, isOpen }) {
  const backdropRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !country) return null;

  const cc = COUNTRY_CODE_MAP[country] || country;
  const label = COUNTRY_LABEL_MAP[country] || country;
  const color = COUNTRY_COLOR_MAP[country] || '#888';
  const breakdownLabel = BREAKDOWN_LABEL_MAP[country];

  // Casualties
  const casualties = {
    iran: { killed: 3486, wounded: 26500 },
    israel: { killed: 34, wounded: 6597 },
    usa: { killed: 15, wounded: 520 },
    lebanon: { killed: 1345, wounded: 4040 },
    yemen: { killed: 0, wounded: 0 },
    iraq: { killed: 109, wounded: 223 },
    uae: { killed: 12, wounded: 169 },
    kuwait: { killed: 8, wounded: 99 },
    bahrain: { killed: 3, wounded: 38 },
    qatar: { killed: 4, wounded: 16 },
    saudi: { killed: 2, wounded: 16 },
    jordan: { killed: 0, wounded: 19 },
    oman: { killed: 3, wounded: 5 },
    syria: { killed: 4, wounded: 0 },
    palestine: { killed: 10, wounded: 0 },
  };

  const cas = casualties[country] || { killed: 0, wounded: 0 };
  const casMax = Math.max(cas.killed, cas.wounded, 1);

  // Missiles/Drones received
  let missilesReceived = 0;
  let dronesReceived = 0;
  if (breakdownLabel) {
    const mEntry = countryBreakdown.missiles.find((m) => m.country === breakdownLabel);
    const dEntry = countryBreakdown.drones.find((d) => d.country === breakdownLabel);
    missilesReceived = mEntry?.count || 0;
    dronesReceived = dEntry?.count || 0;
  }
  const mdMax = Math.max(missilesReceived, dronesReceived, 1);

  // Casualty timeline data for this country
  const timelineData = casualtyTimeline
    .filter((row) => row[country] !== undefined)
    .map((row) => ({
      label: row.date.slice(5), // MM-DD
      value: row[country],
    }));

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'modalFadeIn 250ms ease-out',
      }}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.92); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        className="relative w-full max-w-[500px] mx-4 rounded-lg border border-ops-border overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
          animation: 'modalSlideIn 300ms ease-out',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-ops-border"
          style={{ borderBottomColor: color, borderBottomWidth: 2 }}
        >
          <div className="flex items-center gap-3">
            <img src={flagUrl(cc)} alt={label} className="w-8 h-6 object-cover rounded-sm shadow" />
            <span className="text-lg font-bold font-mono tracking-wide" style={{ color }}>
              {label.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-ops-muted hover:text-white transition-colors text-xl leading-none font-mono px-2 py-1"
            title="Close"
          >
            &times;
          </button>
        </div>

        {/* Casualties Section */}
        <div className="px-4 py-3 border-b border-ops-border/50">
          <div className="text-[9px] font-bold tracking-widest text-ops-muted mb-2">CASUALTIES</div>
          <div className="space-y-2">
            {/* Killed */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-[#ff0040] w-16">KILLED</span>
              <div className="flex-1 h-4 bg-ops-border/20 rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-500"
                  style={{ width: `${(cas.killed / casMax) * 100}%`, background: '#cc0033' }}
                />
              </div>
              <span className="text-sm font-mono font-bold text-[#ff0040] w-16 text-right">
                {cas.killed > 0 ? formatNum(cas.killed) : '-'}
              </span>
            </div>
            {/* Wounded */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-[#ff6600] w-16">WOUNDED</span>
              <div className="flex-1 h-4 bg-ops-border/20 rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-500"
                  style={{ width: `${(cas.wounded / casMax) * 100}%`, background: '#cc5200' }}
                />
              </div>
              <span className="text-sm font-mono font-bold text-[#ff6600] w-16 text-right">
                {cas.wounded > 0 ? formatNum(cas.wounded) : '-'}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[9px] text-ops-muted font-mono">
            Total: {formatNum(cas.killed + cas.wounded)}
          </div>
        </div>

        {/* Missiles/Drones Received */}
        {breakdownLabel && (missilesReceived > 0 || dronesReceived > 0) && (
          <div className="px-4 py-3 border-b border-ops-border/50">
            <div className="text-[9px] font-bold tracking-widest text-ops-muted mb-2">
              MISSILES / DRONES RECEIVED
            </div>
            <div className="space-y-2">
              {/* Missiles */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-[#f59e0b] w-16">MISSILES</span>
                <div className="flex-1 h-4 bg-ops-border/20 rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm"
                    style={{ width: `${(missilesReceived / mdMax) * 100}%`, background: '#d97706' }}
                  />
                </div>
                <span className="text-sm font-mono font-bold text-[#f59e0b] w-16 text-right">
                  {formatNum(missilesReceived)}
                </span>
              </div>
              {/* Drones */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-[#06b6d4] w-16">DRONES</span>
                <div className="flex-1 h-4 bg-ops-border/20 rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm"
                    style={{ width: `${(dronesReceived / mdMax) * 100}%`, background: '#0891b2' }}
                  />
                </div>
                <span className="text-sm font-mono font-bold text-[#06b6d4] w-16 text-right">
                  {formatNum(dronesReceived)}
                </span>
              </div>
            </div>
            <div className="mt-2 text-[9px] text-ops-muted font-mono">
              Total incoming: {formatNum(missilesReceived + dronesReceived)}
            </div>
          </div>
        )}

        {/* Casualty Trend */}
        {timelineData.length >= 2 && (
          <div className="px-4 py-3 border-b border-ops-border/50">
            <div className="text-[9px] font-bold tracking-widest text-ops-muted mb-2">
              CASUALTY TREND (KILLED)
            </div>
            <MiniLineChart data={timelineData} color={color} width={440} height={80} />
          </div>
        )}

        {/* Key Stats */}
        <div className="px-4 py-3">
          <div className="text-[9px] font-bold tracking-widest text-ops-muted mb-2">KEY STATS</div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="bg-ops-border/10 rounded px-2 py-1.5">
              <span className="text-ops-muted block text-[8px]">FATALITY RATE</span>
              <span className="text-white font-bold">
                {cas.killed + cas.wounded > 0
                  ? `${((cas.killed / (cas.killed + cas.wounded)) * 100).toFixed(1)}%`
                  : 'N/A'}
              </span>
            </div>
            <div className="bg-ops-border/10 rounded px-2 py-1.5">
              <span className="text-ops-muted block text-[8px]">TOTAL CASUALTIES</span>
              <span className="text-white font-bold">{formatNum(cas.killed + cas.wounded)}</span>
            </div>
            {breakdownLabel && (
              <>
                <div className="bg-ops-border/10 rounded px-2 py-1.5">
                  <span className="text-ops-muted block text-[8px]">INCOMING ORDNANCE</span>
                  <span className="text-white font-bold">{formatNum(missilesReceived + dronesReceived)}</span>
                </div>
                <div className="bg-ops-border/10 rounded px-2 py-1.5">
                  <span className="text-ops-muted block text-[8px]">MISSILE/DRONE RATIO</span>
                  <span className="text-white font-bold">
                    {dronesReceived > 0
                      ? `1:${(dronesReceived / Math.max(missilesReceived, 1)).toFixed(1)}`
                      : 'N/A'}
                  </span>
                </div>
              </>
            )}
            {timelineData.length >= 2 && (
              <div className="bg-ops-border/10 rounded px-2 py-1.5">
                <span className="text-ops-muted block text-[8px]">DAILY AVG KILLED</span>
                <span className="text-white font-bold">
                  {formatNum(Math.round(timelineData[timelineData.length - 1].value / timelineData.length))}
                </span>
              </div>
            )}
            {(COUNTRY_EXTRA_STATS[country] || []).map((stat) => (
              <div key={stat.label} className="bg-ops-border/10 rounded px-2 py-1.5">
                <span className="text-ops-muted block text-[8px]">{stat.label}</span>
                <span className="font-bold" style={{ color }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-1.5 border-t border-ops-border/50">
          <p className="text-ops-muted text-[7px] font-mono">
            Sources: Wikipedia, Al Jazeera, HRANA, Reuters, Defense Ministry Reports.
          </p>
        </div>
      </div>
    </div>
  );
}

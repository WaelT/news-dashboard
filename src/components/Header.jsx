import { useState, useEffect } from 'react';

const ZONES = [
  { timeZone: 'UTC', label: 'UTC', color: '#ff6600' },
  { timeZone: 'Asia/Tehran', label: 'TEHRAN', color: '#ff0040' },
  { timeZone: 'Asia/Riyadh', label: 'RIYADH', color: '#d4a017' },
  { timeZone: undefined, label: 'LOCAL', color: '#00ff41' },
];

export default function Header({ threatLevel, oilPrice, activeZoneCount }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-ops-panel border-b border-ops-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-ops-green font-bold text-lg tracking-widest font-display">
          OPERATION EPIC FURY — OPS DASHBOARD
        </h1>
        <div className="flex items-center gap-2">
          <span className="live-dot inline-block w-2 h-2 rounded-full bg-ops-red" />
          <span className="text-ops-red text-xs font-bold tracking-wider">LIVE</span>
        </div>
      </div>

      {/* Status indicators */}
      <div className="hidden lg:flex items-center gap-4 text-[10px]">
        {threatLevel && (
          <div className="flex items-center gap-1.5 px-2 py-1 border rounded" style={{ borderColor: `${threatLevel.color}66` }}>
            <span className="live-dot w-1.5 h-1.5 rounded-full" style={{ background: threatLevel.color }} />
            <span className="text-ops-muted font-bold tracking-wider">THREAT</span>
            <span className="font-bold tracking-wider" style={{ color: threatLevel.color }}>{threatLevel.label}</span>
          </div>
        )}
        {oilPrice && (
          <div className="flex items-center gap-1.5 px-2 py-1 border border-ops-border rounded">
            <span className="text-ops-muted font-bold tracking-wider">OIL</span>
            <span className="font-mono text-ops-text">${oilPrice.price.toFixed(2)}</span>
            <span className={`font-mono ${oilPrice.change >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
              {oilPrice.change >= 0 ? '+' : ''}{oilPrice.change.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 text-xs text-ops-muted">
        {ZONES.map((z, i) => {
          const t = time.toLocaleTimeString('en-US', {
            hour12: false,
            ...(z.timeZone ? { timeZone: z.timeZone } : {}),
          });
          return (
            <div key={z.label} className={`flex items-center gap-1.5${i >= 2 ? ' hidden md:flex' : ''}`}>
              <span style={{ color: z.color }} className="font-bold text-[10px] tracking-wider">
                {z.label}
              </span>
              <span style={{ color: z.color }} className="font-mono opacity-80">
                {t}
              </span>
            </div>
          );
        })}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-ops-green" />
          <span className="text-ops-green">ONLINE</span>
        </div>
      </div>
    </header>
  );
}

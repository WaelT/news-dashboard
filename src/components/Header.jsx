import { useState, useEffect } from 'react';

const ZONES = [
  { timeZone: 'UTC', label: 'UTC', color: '#ff6600' },
  { timeZone: 'Asia/Tehran', label: 'TEHRAN', color: '#ff0040' },
  { timeZone: 'Asia/Riyadh', label: 'RIYADH', color: '#d4a017' },
  { timeZone: undefined, label: 'LOCAL', color: '#00ff41' },
];

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-ops-panel border-b border-ops-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-ops-green font-bold text-lg tracking-widest font-display">
          IRAN CONFLICT — OPS DASHBOARD
        </h1>
        <div className="flex items-center gap-2">
          <span className="live-dot inline-block w-2 h-2 rounded-full bg-ops-red" />
          <span className="text-ops-red text-xs font-bold tracking-wider">LIVE</span>
        </div>
      </div>

      <div className="flex items-center gap-5 text-xs text-ops-muted">
        {ZONES.map((z) => {
          const t = time.toLocaleTimeString('en-US', {
            hour12: false,
            ...(z.timeZone ? { timeZone: z.timeZone } : {}),
          });
          return (
            <div key={z.label} className="flex items-center gap-1.5">
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

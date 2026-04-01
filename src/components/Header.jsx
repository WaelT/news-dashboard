import { useState, useEffect } from 'react';
import useNotifications from '../hooks/useNotifications';
import useTheme from '../hooks/useTheme';

const ZONES = [
  { timeZone: 'UTC', label: 'UTC', color: '#ff6600' },
  { timeZone: 'Asia/Tehran', label: 'TEHRAN', color: '#ff0040' },
  { timeZone: 'Asia/Riyadh', label: 'RIYADH', color: '#d4a017' },
  { timeZone: undefined, label: 'LOCAL', color: '#2dd4a8' },
];

export default function Header({ threatLevel, oilPrice, activeZoneCount }) {
  const [time, setTime] = useState(new Date());
  const { enabled: notificationsEnabled, toggleEnabled: toggleNotifications, supported: notificationsSupported } = useNotifications();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="panel-header px-3 lg:px-4 py-2 lg:py-2.5">
      {/* Row 1: Title + Status + Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 lg:gap-4 min-w-0">
          <h1 className="text-ops-green font-bold text-sm lg:text-xl tracking-widest font-display truncate">
            OPS DASHBOARD
          </h1>
          <div className="flex items-center gap-1 lg:gap-2 shrink-0">
            <span className="live-dot inline-block w-1.5 lg:w-2 h-1.5 lg:h-2 rounded-full bg-ops-red" />
            <span className="text-ops-red text-[9px] lg:text-xs font-bold tracking-wider">LIVE</span>
          </div>
        </div>

        {/* Status indicators — desktop only */}
        <div className="hidden lg:flex items-center gap-4 text-[11px]">
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
              <span className={`font-mono ${oilPrice.change >= 0 ? 'text-ops-green' : 'text-ops-red'}`}>
                {oilPrice.change >= 0 ? '+' : ''}{oilPrice.change.toFixed(1)}%
              </span>
              {oilPrice.sparkline?.length > 2 && (
                <svg width="40" height="14" viewBox="0 0 40 14" className="ml-0.5">
                  <polyline
                    fill="none"
                    stroke={oilPrice.change >= 0 ? 'var(--ops-green)' : '#ef4060'}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    points={oilPrice.sparkline.map((v, idx, arr) => {
                      const min = Math.min(...arr);
                      const max = Math.max(...arr);
                      const x = (idx / (arr.length - 1)) * 40;
                      const y = 13 - ((v - min) / (max - min || 1)) * 12;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* Right side: controls + clocks (desktop) / compact controls (mobile) */}
        <div className="flex items-center gap-3 lg:gap-5 text-xs text-ops-muted shrink-0">
          {/* Timezones — desktop only */}
          <div className="hidden lg:flex items-center gap-5">
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
          </div>
          {/* Threat badge — mobile only */}
          {threatLevel && (
            <div className="flex lg:hidden items-center gap-1 px-1.5 py-0.5 border rounded text-[9px]" style={{ borderColor: `${threatLevel.color}66` }}>
              <span className="live-dot w-1 h-1 rounded-full" style={{ background: threatLevel.color }} />
              <span className="font-bold tracking-wider" style={{ color: threatLevel.color }}>{threatLevel.label}</span>
            </div>
          )}
          <button
            onClick={toggleTheme}
            className="text-ops-muted hover:text-ops-text transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
          {notificationsSupported && (
            <button
              onClick={toggleNotifications}
              className="text-ops-muted hover:text-ops-text transition-colors"
              title={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={notificationsEnabled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
          )}
          <div className="hidden lg:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ops-green" />
            <span className="text-ops-green">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Row 2: Mobile-only — timezones + oil price */}
      <div className="flex lg:hidden items-center justify-between mt-1 pt-1 border-t border-ops-border/40">
        <div className="flex items-center gap-3 text-[9px]">
          {ZONES.map((z) => {
            const t = time.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              ...(z.timeZone ? { timeZone: z.timeZone } : {}),
            });
            return (
              <div key={z.label} className="flex items-center gap-1">
                <span style={{ color: z.color }} className="font-bold tracking-wider">
                  {z.label}
                </span>
                <span style={{ color: z.color }} className="font-mono opacity-80">
                  {t}
                </span>
              </div>
            );
          })}
        </div>
        {oilPrice && (
          <div className="flex items-center gap-1 text-[9px]">
            <span className="text-ops-muted font-bold">OIL</span>
            <span className="font-mono text-ops-text">${oilPrice.price.toFixed(0)}</span>
            <span className={`font-mono ${oilPrice.change >= 0 ? 'text-ops-green' : 'text-ops-red'}`}>
              {oilPrice.change >= 0 ? '+' : ''}{oilPrice.change.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

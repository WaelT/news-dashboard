import { useState, useEffect, useRef } from 'react';

const BREAKING_KEYWORDS = [
  'breaking', 'عاجل', 'urgent', 'just in', 'developing',
  'killed', 'strike', 'attack', 'explosion', 'missile',
  'قتل', 'ضربة', 'هجوم', 'انفجار', 'صاروخ', 'قصف',
];

function isBreaking(article) {
  const title = (article.title || '').toLowerCase();
  return BREAKING_KEYWORDS.some((kw) => title.includes(kw.toLowerCase()));
}

function playAlertTone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    // Soft sine chime — two gentle tones with fade-out
    const playChime = (freq, start, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.04, now + start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur);
    };
    playChime(660, 0, 0.4);
    playChime(880, 0.2, 0.5);
  } catch {}
}

export default function BreakingNews({ articles }) {
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());
  const [muted, setMuted] = useState(() => localStorage.getItem('breaking-muted') === 'true');
  const [flashKeys, setFlashKeys] = useState(new Set());
  const seenRef = useRef(new Set());
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
    localStorage.setItem('breaking-muted', String(muted));
  }, [muted]);

  useEffect(() => {
    const breaking = articles.filter((a) => {
      const key = a.title?.slice(0, 60);
      if (!key || seenRef.current.has(key)) return false;
      return isBreaking(a);
    });

    if (breaking.length > 0) {
      const newKeys = new Set(breaking.map((a) => a.title?.slice(0, 60)));
      breaking.forEach((a) => seenRef.current.add(a.title?.slice(0, 60)));
      setAlerts((prev) => {
        const existing = new Set(prev.map((p) => p.title?.slice(0, 60)));
        const newAlerts = breaking.filter((b) => !existing.has(b.title?.slice(0, 60)));
        return [...newAlerts, ...prev].slice(0, 10);
      });
      if (!mutedRef.current) playAlertTone();

      // Flash the new items for 5 seconds
      setFlashKeys(newKeys);
      setTimeout(() => setFlashKeys(new Set()), 5000);
    }
  }, [articles]);

  const visible = alerts.filter((a) => !dismissed.has(a.title?.slice(0, 60)));

  if (visible.length === 0) return null;

  const dismissAll = () => {
    setDismissed(new Set(alerts.map((a) => a.title?.slice(0, 60))));
  };

  return (
    <div>
      {/* Ticker bar with latest alert */}
      <div className={`border-b-2 border-ops-red transition-colors ${flashKeys.size > 0 ? 'bg-ops-red/25' : 'bg-ops-red/10'}`}>
        {/* Scrolling ticker */}
        <div className="flex items-center overflow-hidden">
          <div className={`shrink-0 px-3 py-2 flex items-center gap-2 transition-colors ${flashKeys.size > 0 ? 'bg-white text-ops-red' : 'bg-ops-red'}`}>
            <span className={`live-dot w-2 h-2 rounded-full ${flashKeys.size > 0 ? 'bg-ops-red' : 'bg-white'}`} />
            <span className={`text-[10px] font-bold tracking-widest ${flashKeys.size > 0 ? 'text-ops-red' : 'text-white'}`}>BREAKING</span>
          </div>

          <div className="flex-1 overflow-hidden py-2">
            <div className="breaking-ticker flex items-center gap-8 whitespace-nowrap">
              {visible.map((alert, i) => {
                const key = alert.title?.slice(0, 60);
                const isNew = flashKeys.has(key);
                return (
                  <a
                    key={i}
                    href={alert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-3 hover:text-white transition-colors ${isNew ? 'breaking-flash' : ''}`}
                  >
                    {isNew && (
                      <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-white text-ops-red tracking-widest animate-pulse">
                        NEW
                      </span>
                    )}
                    <span
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: `${alert.sourceColor || '#ff0040'}33`,
                        color: alert.sourceColor || '#ff0040',
                      }}
                    >
                      {alert.source}
                    </span>
                    <span
                      className={`text-xs ${isNew ? 'text-white font-bold' : 'text-ops-text'}`}
                      dir="auto"
                      style={{ unicodeBidi: 'isolate' }}
                    >
                      {alert.title}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setMuted((m) => !m)}
            className="shrink-0 px-2 py-2 text-ops-muted hover:text-ops-text transition-colors"
            title={muted ? 'Unmute alerts' : 'Mute alerts'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              {muted ? (
                <>
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </>
              ) : (
                <>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </>
              )}
            </svg>
          </button>

          <button
            onClick={dismissAll}
            className="shrink-0 px-3 py-2 text-ops-muted text-[9px] hover:text-ops-red transition-colors"
            title="Dismiss all"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

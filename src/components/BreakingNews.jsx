import { useState, useEffect, useRef } from 'react';
import useNotifications from '../hooks/useNotifications';

function playAlertTone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

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

export default function BreakingNews({ articles, breakingArticles }) {
  const [muted, setMuted] = useState(() => localStorage.getItem('breaking-muted') === 'true');
  const [breakingAlert, setBreakingAlert] = useState(null);
  const prevCountRef = useRef(0);
  const mutedRef = useRef(muted);
  const notifiedTitlesRef = useRef(new Set());
  const { sendNotification } = useNotifications();

  useEffect(() => {
    mutedRef.current = muted;
    localStorage.setItem('breaking-muted', String(muted));
  }, [muted]);

  // Trigger alert when new breaking articles arrive from dedicated feeds
  useEffect(() => {
    if (breakingArticles.length > prevCountRef.current && breakingArticles.length > 0) {
      const newest = breakingArticles[0];
      setBreakingAlert(newest);
      if (!mutedRef.current) playAlertTone();

      // Send browser notification if not already notified for this headline
      if (!notifiedTitlesRef.current.has(newest.title)) {
        notifiedTitlesRef.current.add(newest.title);
        sendNotification('BREAKING NEWS', newest.title);
      }

      const timer = setTimeout(() => {
        setBreakingAlert((prev) => (prev?.title === newest.title ? null : prev));
      }, 10_000);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = breakingArticles.length;
  }, [breakingArticles]);

  if (articles.length === 0) return null;

  return (
    <div>
      {/* Breaking alert banner — large flashing red for 10s */}
      {breakingAlert && (
        <div className="border-b-2 border-ops-red bg-ops-red/20 animate-pulse">
          <div className="flex items-center overflow-hidden">
            <div className="shrink-0 px-3 py-2.5 bg-white flex items-center gap-2">
              <span className="live-dot w-2.5 h-2.5 rounded-full bg-ops-red" />
              <span className="text-xs font-bold tracking-widest text-ops-red">BREAKING</span>
            </div>
            <a
              href={breakingAlert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 hover:text-white transition-colors"
            >
              <span
                className="text-base font-bold text-white breaking-flash"
                dir="auto"
                style={{ unicodeBidi: 'isolate' }}
              >
                {breakingAlert.title}
              </span>
            </a>
            <button
              onClick={() => setBreakingAlert(null)}
              className="shrink-0 px-3 py-2 text-ops-muted text-sm hover:text-ops-red transition-colors"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Normal news ticker — all articles */}
      <div className="border-b border-ops-border/50 bg-ops-panel/50">
        <div className="flex items-center overflow-hidden">
          <div className="shrink-0 px-3 py-1.5 flex items-center gap-2 bg-ops-amber/10">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-ops-amber" />
            <span className="text-[10px] font-bold tracking-widest text-ops-amber">NEWS</span>
          </div>

          <div className="flex-1 overflow-hidden py-1.5">
            <div className="breaking-ticker flex items-center whitespace-nowrap">
              {[0, 1].map((copy) =>
                <div key={copy} className="flex items-center gap-8 shrink-0 pr-8">
                  {articles.slice(0, 20).map((article, i) => (
                    <a
                      key={i}
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 hover:text-ops-amber transition-colors"
                    >
                      <span
                        className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: `${article.sourceColor || '#6e7681'}33`,
                          color: article.sourceColor || '#6e7681',
                        }}
                      >
                        {article.source}
                      </span>
                      <span
                        className="text-xs text-ops-text"
                        dir="auto"
                        style={{ unicodeBidi: 'isolate' }}
                      >
                        {article.title}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setMuted((m) => !m)}
            className="shrink-0 px-2 py-1.5 text-ops-muted hover:text-ops-text transition-colors"
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
        </div>
      </div>
    </div>
  );
}

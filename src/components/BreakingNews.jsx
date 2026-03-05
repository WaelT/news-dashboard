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

export default function BreakingNews({ articles }) {
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());
  const seenRef = useRef(new Set());

  useEffect(() => {
    const breaking = articles.filter((a) => {
      const key = a.title?.slice(0, 60);
      if (!key || seenRef.current.has(key)) return false;
      return isBreaking(a);
    });

    if (breaking.length > 0) {
      breaking.forEach((a) => seenRef.current.add(a.title?.slice(0, 60)));
      setAlerts((prev) => {
        const existing = new Set(prev.map((p) => p.title?.slice(0, 60)));
        const newAlerts = breaking.filter((b) => !existing.has(b.title?.slice(0, 60)));
        return [...newAlerts, ...prev].slice(0, 10);
      });
    }
  }, [articles]);

  const visible = alerts.filter((a) => !dismissed.has(a.title?.slice(0, 60)));

  if (visible.length === 0) return null;

  const dismiss = (title) => {
    setDismissed((prev) => new Set([...prev, title?.slice(0, 60)]));
  };

  const dismissAll = () => {
    setDismissed(new Set(alerts.map((a) => a.title?.slice(0, 60))));
  };

  return (
    <div>
      {/* Ticker bar with latest alert */}
      <div className="bg-ops-red/10 border-b-2 border-ops-red">
        {/* Scrolling ticker */}
        <div className="flex items-center overflow-hidden">
          <div className="shrink-0 bg-ops-red px-3 py-2 flex items-center gap-2">
            <span className="live-dot w-2 h-2 rounded-full bg-white" />
            <span className="text-white text-[10px] font-bold tracking-widest">BREAKING</span>
          </div>

          <div className="flex-1 overflow-hidden py-2">
            <div className="breaking-ticker flex items-center gap-8 whitespace-nowrap">
              {visible.map((alert, i) => (
                <a
                  key={i}
                  href={alert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 hover:text-white transition-colors"
                >
                  <span
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: `${alert.sourceColor || '#ff0040'}33`,
                      color: alert.sourceColor || '#ff0040',
                    }}
                  >
                    {alert.source}
                  </span>
                  <span className="text-ops-text text-xs" dir="auto" style={{ unicodeBidi: 'isolate' }}>
                    {alert.title}
                  </span>
                </a>
              ))}
            </div>
          </div>

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

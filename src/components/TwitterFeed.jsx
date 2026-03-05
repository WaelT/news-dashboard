import { useState, useEffect, useRef, useCallback } from 'react';

const FEEDS = [
  { handle: 'AJEnglish', name: 'Al Jazeera EN' },
  { handle: 'AJArabic', name: 'Al Jazeera AR' },
  { handle: 'Reuters', name: 'Reuters' },
  { handle: 'BBCWorld', name: 'BBC World' },
  { handle: 'AP', name: 'AP News' },
];

function loadWidgetScript() {
  return new Promise((resolve) => {
    if (window.twttr?.widgets) { resolve(window.twttr); return; }
    const existing = document.getElementById('twitter-wjs');
    if (existing) { existing.addEventListener('load', () => resolve(window.twttr)); return; }
    const script = document.createElement('script');
    script.id = 'twitter-wjs';
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.onload = () => resolve(window.twttr);
    document.head.appendChild(script);
  });
}

export default function TwitterFeed() {
  const [activeHandle, setActiveHandle] = useState('AJEnglish');
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const renderTimeline = useCallback(async (handle) => {
    setLoading(true);
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = '';

    try {
      const twttr = await loadWidgetScript();
      await twttr.widgets.createTimeline(
        { sourceType: 'profile', screenName: handle },
        el,
        {
          theme: 'dark',
          chrome: 'noheader nofooter noborders transparent',
          height: el.parentElement?.clientHeight || 400,
          dnt: true,
        }
      );
    } catch {
      el.innerHTML = '';
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    renderTimeline(activeHandle);
  }, [activeHandle, renderTimeline]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-ops-border flex items-center justify-between">
        <span className="text-ops-green text-[10px] font-bold tracking-widest">X / LIVE FEED</span>
      </div>

      <div className="flex gap-0 border-b border-ops-border overflow-x-auto">
        {FEEDS.map((feed) => (
          <button
            key={feed.handle}
            onClick={() => setActiveHandle(feed.handle)}
            className={`px-2 py-1.5 text-[8px] font-bold tracking-wider whitespace-nowrap transition-colors border-b-2 ${
              activeHandle === feed.handle
                ? 'border-ops-green text-ops-green bg-ops-border/30'
                : 'border-transparent text-ops-muted hover:text-ops-text'
            }`}
          >
            {feed.name.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading && (
          <div className="p-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-ops-border rounded w-3/4 mb-1.5" />
                <div className="h-2 bg-ops-border rounded w-1/2" />
              </div>
            ))}
          </div>
        )}
        <div ref={containerRef} className="h-full" />
      </div>
    </div>
  );
}

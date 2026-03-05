import { useState, useEffect, useRef } from 'react';

const FEEDS = [
  { handle: 'AJEnglish', name: 'Al Jazeera EN' },
  { handle: 'AJArabic', name: 'Al Jazeera AR' },
  { handle: 'Reuters', name: 'Reuters' },
  { handle: 'BBCWorld', name: 'BBC World' },
  { handle: 'AP', name: 'AP News' },
];

let scriptLoaded = false;

function ensureScript() {
  if (scriptLoaded) return;
  scriptLoaded = true;
  const script = document.createElement('script');
  script.src = 'https://platform.twitter.com/widgets.js';
  script.async = true;
  document.head.appendChild(script);
}

export default function TwitterFeed() {
  const [activeHandle, setActiveHandle] = useState('AJEnglish');
  const containerRef = useRef(null);

  useEffect(() => {
    ensureScript();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = '';
    const anchor = document.createElement('a');
    anchor.className = 'twitter-timeline';
    anchor.setAttribute('data-theme', 'dark');
    anchor.setAttribute('data-chrome', 'noheader nofooter noborders transparent');
    anchor.setAttribute('href', `https://x.com/${activeHandle}`);
    anchor.textContent = `Loading @${activeHandle}...`;
    el.appendChild(anchor);

    const tryLoad = () => {
      if (window.twttr?.widgets) {
        window.twttr.widgets.load(el);
      } else {
        setTimeout(tryLoad, 300);
      }
    };
    tryLoad();
  }, [activeHandle]);

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

      <div className="flex-1 min-h-0 overflow-y-auto" ref={containerRef}>
        <span className="text-ops-muted text-[9px] p-3 block">Loading @{activeHandle}...</span>
      </div>
    </div>
  );
}

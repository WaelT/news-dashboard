import { useState, useEffect, useCallback } from 'react';

const FEEDS = [
  { handle: 'AJEnglish', name: 'Al Jazeera EN', color: '#d2a02a' },
  { handle: 'Reuters', name: 'Reuters', color: '#ff6600' },
  { handle: 'BBCWorld', name: 'BBC World', color: '#bb1919' },
  { handle: 'AP', name: 'AP News', color: '#00a1e0' },
];

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

async function fetchTimeline(handle) {
  const url = `/api/twitter/${handle}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export default function TwitterFeed() {
  const [activeHandle, setActiveHandle] = useState('AJEnglish');
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTweets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTimeline(activeHandle);
      setTweets(data);
    } catch {
      // API not configured — show placeholder
      setError('no-api');
      setTweets([]);
    } finally {
      setLoading(false);
    }
  }, [activeHandle]);

  useEffect(() => { loadTweets(); }, [loadTweets]);

  const activeFeed = FEEDS.find((f) => f.handle === activeHandle);

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="px-3 py-2 border-b border-ops-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-ops-green text-[10px] font-bold tracking-widest">
            X / SOCIAL FEED
          </span>
        </div>
        <a
          href="https://x.com/search?q=iran+war+conflict&f=live"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ops-muted text-[9px] hover:text-ops-amber transition-colors"
        >
          [LIVE SEARCH]
        </a>
      </div>

      {/* Source tabs */}
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

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading && (
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-ops-border rounded w-3/4 mb-1.5" />
                <div className="h-2 bg-ops-border rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error === 'no-api' && !loading && (
          <div className="flex flex-col h-full">
            {/* Quick links to each account */}
            <div className="p-3 space-y-2 border-b border-ops-border/50">
              <p className="text-ops-muted text-[9px] mb-2">
                LIVE X FEEDS — click to open in new tab
              </p>
              {FEEDS.map((feed) => (
                <a
                  key={feed.handle}
                  href={`https://x.com/${feed.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-ops-border/30 transition-colors group"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: feed.color }}
                  />
                  <span className="text-[11px] text-ops-text group-hover:text-ops-green transition-colors">
                    @{feed.handle}
                  </span>
                  <span className="text-[9px] text-ops-muted ml-auto">
                    {feed.name}
                  </span>
                </a>
              ))}
            </div>

            {/* Search links */}
            <div className="p-3 space-y-2">
              <p className="text-ops-muted text-[9px] mb-2">TRENDING SEARCHES</p>
              {['iran war', 'iran conflict', 'middle east crisis', 'strait of hormuz', 'tehran'].map((q) => (
                <a
                  key={q}
                  href={`https://x.com/search?q=${encodeURIComponent(q)}&f=live`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-ops-border/30 transition-colors group"
                >
                  <span className="text-ops-amber text-[10px]">#</span>
                  <span className="text-[11px] text-ops-text group-hover:text-ops-amber transition-colors">
                    {q}
                  </span>
                  <span className="text-ops-muted text-[9px] ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    OPEN →
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-auto p-3 border-t border-ops-border/50">
              <p className="text-ops-muted text-[8px] leading-relaxed">
                X/Twitter blocks embedded timelines on third-party sites.
                Use the links above to follow live coverage.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && tweets.length > 0 && tweets.map((tweet, i) => (
          <a
            key={i}
            href={tweet.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 border-b border-ops-border/50 hover:bg-ops-border/20 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-bold" style={{ color: activeFeed?.color }}>
                @{activeHandle}
              </span>
              <span className="text-ops-muted text-[9px]">{timeAgo(tweet.date)}</span>
            </div>
            <p className="text-[11px] text-ops-text leading-relaxed group-hover:text-ops-green transition-colors">
              {tweet.text}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';

const FEEDS = [
  { handle: 'AJEnglish', name: 'Al Jazeera EN' },
  { handle: 'AJArabic', name: 'Al Jazeera AR' },
  { handle: 'Reuters', name: 'Reuters' },
  { handle: 'BBCWorld', name: 'BBC World' },
  { handle: 'AP', name: 'AP News' },
];

function timelineUrl(handle) {
  return `https://syndication.twitter.com/srv/timeline-profile/screen-name/${handle}?dnt=true&embedId=twitter-widget-0&hideBorder=true&hideFooter=true&hideHeader=true&hideScrollBar=false&lang=en&theme=dark&transparent=true`;
}

export default function TwitterFeed() {
  const [activeHandle, setActiveHandle] = useState('AJEnglish');

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

      <div className="flex-1 min-h-0">
        <iframe
          key={activeHandle}
          src={timelineUrl(activeHandle)}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-popups"
          title={`@${activeHandle} timeline`}
        />
      </div>
    </div>
  );
}

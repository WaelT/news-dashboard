import { useEnglishNews, useArabicNews } from '../hooks/useNews';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 p-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-3 bg-ops-border rounded w-3/4 mb-1.5" />
          <div className="h-2 bg-ops-border rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

function NewsList({ articles, loading, error, lastUpdated, label, emptyMsg }) {
  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-ops-border">
        <div className="flex items-center gap-2">
          <span className="text-ops-amber text-[10px] font-bold tracking-widest">
            {label}
          </span>
          <span className="text-ops-muted text-[9px]">
            {articles.length > 0 ? `${articles.length} items` : ''}
          </span>
        </div>
        {lastUpdated && (
          <span className="text-ops-muted text-[9px]">
            UPD {lastUpdated.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {loading && <LoadingSkeleton />}
        {error && (
          <div className="p-3 text-ops-red text-xs">ERROR: {error}</div>
        )}
        {!loading && articles.length === 0 && !error && (
          <div className="p-3 text-ops-muted text-xs">
            <p className="mb-1">No articles loaded.</p>
            <p className="text-[9px]">{emptyMsg}</p>
          </div>
        )}
        {articles.map((article, i) => (
          <a
            key={i}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 border-b border-ops-border/50 hover:bg-ops-border/20 transition-colors group"
          >
            <div className="flex items-start gap-2">
              <span
                className="text-[8px] font-bold px-1 py-0.5 rounded shrink-0 mt-0.5 tracking-wide"
                style={{
                  background: `${article.sourceColor || '#6e7681'}22`,
                  color: article.sourceColor || '#6e7681',
                }}
              >
                {article.source}
              </span>
              <span className="text-ops-muted text-[9px] shrink-0 mt-0.5">
                {timeAgo(article.pubDate)}
              </span>
            </div>
            <p className="text-[11px] text-ops-text mt-1 leading-relaxed group-hover:text-ops-amber transition-colors line-clamp-2">
              {article.title}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

export function EnglishNews() {
  const data = useEnglishNews();
  return (
    <NewsList
      {...data}
      label="NEWS FEED — EN"
      emptyMsg="Set VITE_GNEWS_API_KEY in .env for live data. RSS feeds require dev server proxy."
    />
  );
}

export function ArabicNews() {
  const data = useArabicNews();
  return (
    <NewsList
      {...data}
      label="أخبار — AR"
      emptyMsg="Set VITE_GNEWS_API_KEY in .env for live data. Arabic RSS feeds require dev server proxy."
    />
  );
}

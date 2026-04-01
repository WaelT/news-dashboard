import { useState, useEffect, useRef } from 'react';

const CHANNELS = [
  { id: 'aborasmi', name: 'Al Jazeera AR', color: '#d2a02a' },
  { id: 'AJENews', name: 'Al Jazeera EN', color: '#d2a02a' },
  { id: 'IranIntl_En', name: 'Iran Intl EN', color: '#ef4060' },
  { id: 'SkyNewsArabia_BreakingNews', name: 'Sky News AR', color: '#c8102e' },
  { id: 'MideastSpectator', name: 'ME Spectator', color: '#d4a017' },
  { id: 'OSINTdefender', name: 'OSINT Defender', color: '#2dd4a8' },
];

const POSTS_TO_SHOW = 5;

function TelegramPost({ channel, postId }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-post', `${channel}/${postId}`);
    script.setAttribute('data-width', '100%');
    script.setAttribute('data-dark', '1');
    script.setAttribute('data-color', '2AABEE');
    script.setAttribute('data-dark-color', '2AABEE');
    el.appendChild(script);
  }, [channel, postId]);

  return <div ref={ref} className="mb-1" />;
}

export default function TelegramFeed() {
  const [selected, setSelected] = useState(0);
  const [postIds, setPostIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const channel = CHANNELS[selected];

  // Try to fetch latest post IDs via dev proxy, fallback to direct links
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPostIds([]);

    async function fetchPosts() {
      try {
        const res = await fetch(`/tg-proxy/${channel.id}`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error('proxy failed');
        const html = await res.text();
        const ids = [];
        const regex = /data-post="[^/]+\/(\d+)"/g;
        let m;
        while ((m = regex.exec(html)) !== null) ids.push(parseInt(m[1], 10));
        const unique = [...new Set(ids)].sort((a, b) => b - a).slice(0, POSTS_TO_SHOW);
        if (!cancelled && unique.length > 0) {
          setPostIds(unique);
          setLoading(false);
          return;
        }
      } catch {
        // Proxy not available (prod) — fall through to fallback
      }

      // Fallback: try fetching directly (may fail due to CORS)
      try {
        const res = await fetch(`https://t.me/s/${channel.id}`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error('direct failed');
        const html = await res.text();
        const ids = [];
        const regex = /data-post="[^/]+\/(\d+)"/g;
        let m;
        while ((m = regex.exec(html)) !== null) ids.push(parseInt(m[1], 10));
        const unique = [...new Set(ids)].sort((a, b) => b - a).slice(0, POSTS_TO_SHOW);
        if (!cancelled && unique.length > 0) {
          setPostIds(unique);
          setLoading(false);
          return;
        }
      } catch {
        // CORS blocked on prod — expected
      }

      if (!cancelled) setLoading(false);
    }

    fetchPosts();
    return () => { cancelled = true; };
  }, [channel.id]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="panel-header px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#0088cc] text-[11px] font-bold tracking-widest">TELEGRAM</span>
          <span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-[#0088cc]" />
        </div>
        <span className="text-ops-muted text-[10px]">{CHANNELS.length} CHANNELS</span>
      </div>

      {/* Channel selector */}
      <div className="px-2 py-1.5 border-b border-ops-border/50 flex flex-wrap gap-1.5 overflow-y-auto max-h-[72px]">
        {CHANNELS.map((ch, i) => (
          <button
            key={ch.id}
            onClick={() => setSelected(i)}
            className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded transition-all duration-150 flex items-center gap-1 ${
              selected === i
                ? 'bg-ops-border/40 text-white'
                : 'text-ops-muted hover:text-ops-text hover:bg-ops-border/20'
            }`}
            style={selected === i ? { color: ch.color } : undefined}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: ch.color, boxShadow: selected === i ? `0 0 6px ${ch.color}` : 'none' }}
            />
            {ch.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Posts or fallback */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <span className="text-ops-muted text-[11px]">Loading @{channel.id}...</span>
          </div>
        )}

        {!loading && postIds.length > 0 && postIds.map((id) => (
          <TelegramPost key={`${channel.id}-${id}`} channel={channel.id} postId={id} />
        ))}

        {!loading && postIds.length === 0 && (
          <div className="py-3 space-y-2.5">
            <p className="text-ops-muted text-[10px] px-1">
              Telegram embeds require the dev proxy. Open channels directly:
            </p>
            {CHANNELS.map((ch) => (
              <a
                key={ch.id}
                href={`https://t.me/s/${ch.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded border border-ops-border/30 hover:border-[#0088cc]/40 hover:bg-[#0088cc]/5 transition-all group"
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ background: `${ch.color}22`, color: ch.color }}
                >
                  {ch.name.charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-ops-text font-bold group-hover:text-[#0088cc] transition-colors">{ch.name}</span>
                  <span className="text-[9px] text-ops-muted block">@{ch.id}</span>
                </div>
                <span className="text-[9px] text-ops-muted opacity-0 group-hover:opacity-100 transition-opacity">OPEN</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

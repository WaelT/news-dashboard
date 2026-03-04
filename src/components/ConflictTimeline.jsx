import { useMemo } from 'react';

const EVENT_TYPES = {
  strike: { color: '#ff0040', label: 'STRIKE' },
  missile: { color: '#ff0040', label: 'MISSILE' },
  diplomacy: { color: '#00ff41', label: 'DIPLOMATIC' },
  military: { color: '#ff6600', label: 'MILITARY' },
  humanitarian: { color: '#00b4d8', label: 'HUMANITARIAN' },
  nuclear: { color: '#ff6600', label: 'NUCLEAR' },
  naval: { color: '#00aaff', label: 'NAVAL' },
  general: { color: '#6e7681', label: 'UPDATE' },
};

const TYPE_KEYWORDS = [
  { type: 'strike', words: ['strike', 'airstrike', 'bomb', 'قصف', 'ضربة', 'غارة', 'شظايا'] },
  { type: 'missile', words: ['missile', 'rocket', 'drone', 'صاروخ', 'صواريخ', 'مسيّرة', 'مسيرة', 'باليستي'] },
  { type: 'diplomacy', words: ['ceasefire', 'negotiat', 'diplomat', 'summit', 'talks', 'peace', 'وقف إطلاق', 'مفاوضات', 'دبلوماس'] },
  { type: 'nuclear', words: ['nuclear', 'enrichment', 'uranium', 'iaea', 'نووي', 'تخصيب', 'يورانيوم'] },
  { type: 'naval', words: ['navy', 'naval', 'ship', 'carrier', 'hormuz', 'red sea', 'بحري', 'سفينة', 'هرمز', 'البحر الأحمر'] },
  { type: 'humanitarian', words: ['civilian', 'refugee', 'humanitarian', 'casualt', 'killed', 'dead', 'wounded', 'مدني', 'لاجئ', 'قتل', 'ضحايا', 'جرحى', 'وفاة'] },
  { type: 'military', words: ['military', 'troops', 'army', 'deploy', 'base', 'عسكري', 'جيش', 'قوات', 'جنود'] },
];

function classifyArticle(article) {
  const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();
  for (const { type, words } of TYPE_KEYWORDS) {
    if (words.some((w) => text.includes(w))) return type;
  }
  return 'general';
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch { return ''; }
}

export default function ConflictTimeline({ articles }) {
  const events = useMemo(() => {
    return articles.slice(0, 30).map((a) => ({
      ...a,
      eventType: classifyArticle(a),
    }));
  }, [articles]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-ops-border flex items-center justify-between">
        <span className="text-ops-amber text-[10px] font-bold tracking-widest">CONFLICT TIMELINE</span>
        <span className="text-ops-muted text-[9px]">{events.length} events</span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-2">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[5px] top-0 bottom-0 w-px bg-ops-border" />

          {events.map((event, i) => {
            const et = EVENT_TYPES[event.eventType] || EVENT_TYPES.general;
            return (
              <a
                key={i}
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative pl-5 pb-3 group"
              >
                {/* Dot on timeline */}
                <div
                  className="absolute left-0 top-1 w-[11px] h-[11px] rounded-full border-2"
                  style={{ borderColor: et.color, background: i === 0 ? et.color : '#050a0e' }}
                />

                {/* Time + type badge */}
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-ops-muted text-[11px]">{formatTime(event.pubDate)}</span>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider"
                    style={{ background: `${et.color}22`, color: et.color }}
                  >
                    {et.label}
                  </span>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: `${event.sourceColor || '#6e7681'}22`, color: event.sourceColor || '#6e7681' }}
                  >
                    {event.source}
                  </span>
                  <span className="text-ops-muted text-[10px] ml-auto">{timeAgo(event.pubDate)}</span>
                </div>

                {/* Headline */}
                <p className="text-[13px] text-ops-text leading-relaxed group-hover:text-ops-amber transition-colors line-clamp-2">
                  {event.title}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

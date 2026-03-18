import { useMemo } from 'react';

const ESCALATION_KEYWORDS = [
  'strike', 'attack', 'bomb', 'missile', 'drone', 'kill', 'destroy',
  'escalat', 'retaliat', 'invasion', 'launch', 'dead', 'casualt',
  'wound', 'blast', 'تصعيد', 'هجوم', 'قصف', 'صاروخ',
];

const DEESCALATION_KEYWORDS = [
  'ceasefire', 'peace', 'negotiat', 'diplomat', 'withdraw', 'de-escalat',
  'humanitarian', 'aid', 'truce', 'talks', 'وقف إطلاق', 'سلام', 'مفاوضات',
];

function scoreSentiment(title) {
  if (!title) return 0;
  const text = title.toLowerCase();
  let score = 0;
  for (const kw of ESCALATION_KEYWORDS) {
    if (text.includes(kw)) score += 1;
  }
  for (const kw of DEESCALATION_KEYWORDS) {
    if (text.includes(kw)) score -= 1;
  }
  return score;
}

function sentimentColor(score) {
  if (score > 0) return '#ff0040';
  if (score < 0) return 'var(--ops-green, #059669)';
  return '#ffcc00';
}

const EVENT_TYPES = {
  strike: { color: '#ff0040', label: 'STRIKE' },
  missile: { color: '#ff0040', label: 'MISSILE' },
  diplomacy: { color: 'var(--ops-green, #059669)', label: 'DIPLOMATIC' },
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
    return articles.slice(0, 30).map((a) => {
      const sentiment = scoreSentiment(a.title);
      return {
        ...a,
        eventType: classifyArticle(a),
        sentiment,
        sentimentColor: sentimentColor(sentiment),
      };
    });
  }, [articles]);

  const sentimentSummary = useMemo(() => {
    let esc = 0, deesc = 0, neutral = 0;
    for (const e of events) {
      if (e.sentiment > 0) esc++;
      else if (e.sentiment < 0) deesc++;
      else neutral++;
    }
    const total = esc + deesc + neutral || 1;
    // Position marker: 0 = full escalation (left/red), 100 = full de-escalation (right/green)
    // During active war, most articles are escalatory so bias heavily left
    const escRatio = esc / total;
    // Map: if 60%+ articles are escalation, dot should be in red/orange zone (15-35%)
    const balance = Math.min(85, Math.max(10, (1 - escRatio) * 100 * 0.7));
    return { esc, deesc, neutral, balance };
  }, [events]);

  return (
    <div className="flex flex-col h-full">
      {/* Sentiment summary bar */}
      <div className="px-3 pt-2 pb-1 border-b border-ops-border">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] tracking-wider text-[#ff0040] font-bold">ESCALATION</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#ff0040] font-mono">{sentimentSummary.esc}</span>
            <span className="text-[10px] text-ops-muted font-mono">·</span>
            <span className="text-[10px] text-[#ffcc00] font-mono">{sentimentSummary.neutral}</span>
            <span className="text-[10px] text-ops-muted font-mono">·</span>
            <span className="text-[10px] text-[#059669] font-mono">{sentimentSummary.deesc}</span>
          </div>
          <span className="text-[9px] tracking-wider text-[#059669] font-bold">DE-ESCALATION</span>
        </div>
        <div className="relative h-[6px] rounded-full overflow-hidden" style={{ background: 'linear-gradient(to right, #ff0040, #ffcc00 50%, #059669)' }}>
          <div
            className="absolute top-[-4px] w-[14px] h-[14px] rounded-full border-2 border-white escalation-dot"
            style={{
              left: `calc(${sentimentSummary.balance}% - 7px)`,
              background: sentimentSummary.balance < 40 ? '#ff0040' : sentimentSummary.balance < 60 ? '#ffcc00' : '#059669',
              boxShadow: `0 0 8px ${sentimentSummary.balance < 40 ? '#ff0040' : sentimentSummary.balance < 60 ? '#ffcc00' : '#059669'}, 0 0 16px ${sentimentSummary.balance < 40 ? '#ff004088' : sentimentSummary.balance < 60 ? '#ffcc0088' : '#05966988'}`,
            }}
          />
        </div>
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
                {/* Dot on timeline — colored by sentiment */}
                <div
                  className="absolute left-0 top-1 w-[11px] h-[11px] rounded-full border-2"
                  style={{ borderColor: event.sentimentColor, background: i === 0 ? event.sentimentColor : '#050a0e' }}
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

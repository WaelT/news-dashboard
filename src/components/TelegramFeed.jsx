const CHANNELS = [
  {
    name: 'Intel Slava Z',
    handle: 'inaborjomi',
    description: 'OSINT & conflict updates',
    color: '#00b4d8',
  },
  {
    name: 'War Monitor',
    handle: 'warmonitors',
    description: 'Real-time conflict tracking',
    color: '#ff6600',
  },
  {
    name: 'Middle East Spectator',
    handle: 'MideastSpectator',
    description: 'Middle East conflict analysis',
    color: '#d4a017',
  },
  {
    name: 'Iran International',
    handle: 'IranIntl_En',
    description: 'Iran news & updates',
    color: '#ff0040',
  },
  {
    name: 'OSINT Defender',
    handle: 'OSINTdefender',
    description: 'Open source intelligence',
    color: '#8ac926',
  },
  {
    name: 'Aurora Intel',
    handle: 'AuroraIntel',
    description: 'Global military tracking',
    color: '#00ff41',
  },
];

const SEARCH_QUERIES = [
  { label: 'Iran Strikes', query: 'iran+strike' },
  { label: 'Hormuz Strait', query: 'hormuz+strait' },
  { label: 'Tehran', query: 'tehran+attack' },
  { label: 'Nuclear Iran', query: 'iran+nuclear' },
  { label: 'Middle East War', query: 'middle+east+war' },
];

export default function TelegramFeed() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-ops-border flex items-center justify-between">
        <span className="text-[#0088cc] text-[10px] font-bold tracking-widest">TELEGRAM CHANNELS</span>
        <span className="text-ops-muted text-[9px]">OSINT SOURCES</span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Channel links */}
        <div className="p-3 space-y-1.5">
          <p className="text-ops-muted text-[9px] mb-2 font-bold tracking-wider">LIVE CHANNELS</p>
          {CHANNELS.map((ch) => (
            <a
              key={ch.handle}
              href={`https://t.me/${ch.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-2.5 py-2 rounded border border-ops-border/30 hover:border-ops-border hover:bg-ops-border/20 transition-all group"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: `${ch.color}22`, color: ch.color }}
              >
                {ch.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-ops-text font-bold group-hover:text-ops-green transition-colors truncate">
                    {ch.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-ops-muted">@{ch.handle}</span>
                  <span className="text-[8px] text-ops-muted opacity-60">{ch.description}</span>
                </div>
              </div>
              <span className="text-ops-muted text-[9px] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                OPEN
              </span>
            </a>
          ))}
        </div>

        {/* Search links */}
        <div className="p-3 pt-0 space-y-1.5">
          <p className="text-ops-muted text-[9px] mb-2 font-bold tracking-wider border-t border-ops-border/50 pt-3">
            TELEGRAM SEARCH
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SEARCH_QUERIES.map((sq) => (
              <a
                key={sq.query}
                href={`https://t.me/s?q=${sq.query}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-ops-border/30 hover:bg-ops-border/60 transition-colors text-[9px] text-ops-text hover:text-[#0088cc]"
              >
                <span className="text-[#0088cc]">#</span>
                {sq.label}
              </a>
            ))}
          </div>
        </div>

        {/* Embed preview for one channel */}
        <div className="p-3 pt-0">
          <p className="text-ops-muted text-[9px] mb-2 font-bold tracking-wider border-t border-ops-border/50 pt-3">
            LIVE PREVIEW
          </p>
          <div className="rounded border border-ops-border overflow-hidden">
            <iframe
              src="https://t.me/s/MideastSpectator"
              title="Telegram Channel Preview"
              className="w-full border-0"
              style={{
                height: '250px',
                filter: 'invert(0.88) hue-rotate(180deg)',
                colorScheme: 'light',
              }}
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
          <p className="text-ops-muted text-[7px] mt-1">
            Preview may be limited. Click channels above for full access.
          </p>
        </div>
      </div>
    </div>
  );
}

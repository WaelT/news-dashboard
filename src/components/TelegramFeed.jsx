import { useState } from 'react';

const CHANNELS = [
  { id: 'aborasmi', name: 'Al Jazeera AR', color: '#d2a02a' },
  { id: 'AJENews', name: 'Al Jazeera EN', color: '#d2a02a' },
  { id: 'IranIntl_En', name: 'Iran Intl EN', color: '#ef4060' },
  { id: 'SkyNewsArabia_BreakingNews', name: 'Sky News AR', color: '#c8102e' },
  { id: 'MideastSpectator', name: 'ME Spectator', color: '#d4a017' },
  { id: 'OSINTdefender', name: 'OSINT Defender', color: '#2dd4a8' },
];

export default function TelegramFeed() {
  const [selected, setSelected] = useState(0);
  const channel = CHANNELS[selected];

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

      {/* Telegram channel iframe */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <iframe
          key={channel.id}
          src={`https://t.me/s/${channel.id}`}
          title={channel.name}
          className="w-full h-full border-0 absolute inset-0"
          sandbox="allow-scripts allow-same-origin allow-popups"
          style={{
            filter: 'invert(0.88) hue-rotate(180deg)',
            colorScheme: 'light',
          }}
        />
      </div>
    </div>
  );
}

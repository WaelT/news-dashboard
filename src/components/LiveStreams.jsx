import { useState } from 'react';

const STREAMS = [
  { name: 'Al Jazeera Arabic', videoId: 'bNyUyrR0PHo', color: '#d2a02a' },
  { name: 'Al Jazeera Mubasher', videoId: 'rvJOGTSQNj8', color: '#d2a02a' },
  { name: 'France 24 English', videoId: 'Ap-UM1O9RBU', color: '#00a1e0' },
];

export default function LiveStreams() {
  const [selected, setSelected] = useState(0);

  const stream = STREAMS[selected];

  return (
    <div className="h-full flex flex-col">
      {/* Panel header */}
      <div className="panel-header px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-ops-red text-[11px] font-bold tracking-widest">LIVE TV</span>
          <span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-ops-red" />
        </div>
        <span className="text-ops-muted text-[10px]">{STREAMS.length} CHANNELS</span>
      </div>

      {/* Channel selector */}
      <div className="px-2 py-2 border-b border-ops-border/50 flex flex-wrap gap-1.5 overflow-y-auto max-h-[72px]">
        {STREAMS.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setSelected(i)}
            className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded transition-all duration-150 ${
              selected === i
                ? 'bg-ops-border/40 text-white'
                : 'text-ops-muted hover:text-ops-text hover:bg-ops-border/20'
            }`}
            style={selected === i ? { color: s.color } : undefined}
          >
            {s.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Video player */}
      <div className="flex-1 relative min-h-0 bg-black">
        <iframe
          key={stream.videoId}
          src={`https://www.youtube.com/embed/${stream.videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
          title={stream.name}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

import { useState } from 'react';

const STREAMS = [
  {
    name: 'Al Jazeera Arabic',
    videoId: 'bNyUyrR0PHo',
    color: '#d2a02a',
  },
  {
    name: 'Sky News',
    videoId: 'YDvsBbKfLPA',
    color: '#c8102e',
  },
  {
    name: 'France 24',
    videoId: 'Ap-UM1O9RBU',
    color: '#00a1e0',
  },
  {
    name: 'DW News',
    videoId: 'VoXhNxAL6EY',
    color: '#0070c0',
  },
];

export default function LiveStreams() {
  const [focused, setFocused] = useState(null);
  const [active, setActive] = useState(new Set());

  const gridClass = 'grid-cols-2 grid-rows-2';

  function handleClick(i) {
    if (focused === i) {
      setFocused(null);
    } else {
      setFocused(i);
      setActive((prev) => new Set(prev).add(i));
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Panel header */}
      <div className="px-3 py-1.5 border-b border-ops-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-ops-red text-[10px] font-bold tracking-widest">
            LIVE STREAMS
          </span>
          <span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-ops-red" />
          <span className="text-ops-muted text-[9px]">{STREAMS.length} CHANNELS</span>
        </div>
        {focused !== null && (
          <button
            onClick={() => setFocused(null)}
            className="text-ops-muted text-[9px] hover:text-ops-green transition-colors"
          >
            [SHOW ALL]
          </button>
        )}
      </div>

      {/* Streams grid */}
      <div className={`flex-1 grid ${focused !== null ? 'grid-cols-1 grid-rows-1' : gridClass} gap-px bg-ops-border min-h-0`}>
        {STREAMS.map((stream, i) => {
          if (focused !== null && focused !== i) return null;

          const isActive = active.has(i) || focused === i;

          return (
            <div
              key={stream.name}
              className="relative bg-ops-bg group cursor-pointer"
              onClick={() => handleClick(i)}
            >
              {/* Label overlay */}
              <div className="absolute top-1 left-1.5 z-10 flex items-center gap-1.5">
                <span
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wider bg-black/70"
                  style={{ color: stream.color }}
                >
                  {stream.name.toUpperCase()}
                </span>
                {isActive && <span className="live-dot w-1.5 h-1.5 rounded-full bg-ops-red" />}
              </div>

              {/* Expand hint */}
              <div className="absolute bottom-1 right-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-ops-muted text-[8px] bg-black/70 px-1.5 py-0.5 rounded">
                  {focused === i ? 'MINIMIZE' : isActive ? 'EXPAND' : 'PLAY'}
                </span>
              </div>

              {isActive ? (
                <iframe
                  src={`https://www.youtube.com/embed/${stream.videoId}?autoplay=${focused === i ? 1 : 0}&mute=1&controls=1&modestbranding=1&rel=0`}
                  title={stream.name}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  loading="lazy"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${stream.videoId}/mqdefault.jpg`}
                    alt={stream.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                  <div className="relative flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-full bg-ops-red/80 flex items-center justify-center group-hover:bg-ops-red transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-[9px] text-ops-muted font-bold tracking-wider">CLICK TO PLAY</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

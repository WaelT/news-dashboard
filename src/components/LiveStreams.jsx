import { useState } from 'react';

const STREAMS = [
  {
    name: 'Al Jazeera Mubasher',
    videoId: 'mJdhDuweBHM',
    color: '#d2a02a',
  },
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
];

export default function LiveStreams() {
  const [focused, setFocused] = useState(null);

  const gridClass = 'grid-cols-2 grid-rows-2';

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

          return (
            <div
              key={stream.name}
              className="relative bg-ops-bg group cursor-pointer"
              onClick={() => setFocused(focused === i ? null : i)}
            >
              {/* Label overlay */}
              <div className="absolute top-1 left-1.5 z-10 flex items-center gap-1.5">
                <span
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wider bg-black/70"
                  style={{ color: stream.color }}
                >
                  {stream.name.toUpperCase()}
                </span>
                <span className="live-dot w-1.5 h-1.5 rounded-full bg-ops-red" />
              </div>

              {/* Expand hint */}
              <div className="absolute bottom-1 right-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-ops-muted text-[8px] bg-black/70 px-1.5 py-0.5 rounded">
                  {focused === i ? 'MINIMIZE' : 'EXPAND'}
                </span>
              </div>

              <iframe
                src={`https://www.youtube.com/embed/${stream.videoId}?autoplay=0&mute=1&controls=1&modestbranding=1&rel=0`}
                title={stream.name}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';

// Use channel /live URLs where possible — they auto-redirect to current stream
const STREAMS = [
  { name: 'Al Jazeera Arabic', channelId: 'UCaDBoTJJOq_LRpPf-E1EUQQ', videoId: 'bNyUyrR0PHo', color: '#d2a02a' },
  { name: 'Al Jazeera Mubasher', channelId: 'UCbqHEMPkSasFazMk7p5dqSQ', videoId: 'eksOMqVMINo', color: '#d2a02a' },
  { name: 'Al Jazeera English', channelId: 'UCNye-wNBqNL5ZzHSJj3l8Bg', videoId: 'F-POY4Q0QSI', color: '#d2a02a' },
  { name: 'Sky News Arabia', channelId: 'UCxqSGx3GGQe3gauIZB2gFjA', color: '#c8102e' },
  { name: 'Al Arabiya', channelId: 'UCbyT7JxSMOCqOP4OaL5fDkg', color: '#e44d26' },
  { name: 'France 24 Arabic', channelId: 'UCfMoR2LPMYTn98vbcFk3fSA', color: '#00a1e0' },
  { name: 'France 24 English', videoId: 'Ap-UM1O9RBU', color: '#00a1e0' },
  { name: 'RT Arabic', channelId: 'UCpwvZwUam-URkxB7g4USKpg', color: '#6aa84f' },
  { name: 'DW News', videoId: 'gNosnzCaS4I', color: '#0078d4' },
  { name: 'TRT World', videoId: 'Fxu04q4Rv38', color: '#1a9e49' },
];

export default function LiveStreams() {
  const [selected, setSelected] = useState(0);

  const stream = STREAMS[selected];

  return (
    <div className="h-full flex flex-col">
      {/* Panel header */}
      <div className="px-3 py-1.5 border-b border-ops-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-ops-red text-[10px] font-bold tracking-widest">LIVE TV</span>
          <span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-ops-red" />
        </div>
        <span className="text-ops-muted text-[9px]">{STREAMS.length} CHANNELS</span>
      </div>

      {/* Channel selector */}
      <div className="px-2 py-1.5 border-b border-ops-border/50 flex flex-wrap gap-1 overflow-y-auto max-h-[72px]">
        {STREAMS.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setSelected(i)}
            className={`px-2 py-0.5 text-[9px] font-bold tracking-wider rounded transition-colors ${
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
          key={stream.videoId || stream.channelId}
          src={
            stream.videoId
              ? `https://www.youtube.com/embed/${stream.videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`
              : `https://www.youtube.com/embed/live_stream?channel=${stream.channelId}&autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`
          }
          title={stream.name}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

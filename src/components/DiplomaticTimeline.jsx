import diplomaticEvents, { STATUS_COLORS, TYPE_ICONS } from '../data/diplomaticEvents';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

const sorted = [...diplomaticEvents].sort((a, b) => {
  const diff = new Date(b.date) - new Date(a.date);
  if (diff !== 0) return diff;
  // preserve original order for same-date events (later entries first)
  return diplomaticEvents.indexOf(b) - diplomaticEvents.indexOf(a);
});

export default function DiplomaticTimeline() {
  return (
    <div className="flex flex-col h-full">
      {/* Status legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 px-3 py-1.5 border-b border-ops-border/50">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-[9px] font-bold tracking-wider text-ops-muted uppercase">{status}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-2">
        <div className="relative">
          {/* Vertical timeline line — gradient fade */}
          <div className="absolute left-[5px] top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, var(--ops-green, #2dd4a8), var(--ops-border) 40%)' }} />

          {sorted.map((ev, i) => {
            const statusColor = STATUS_COLORS[ev.status] || '#6e7681';
            const icon = TYPE_ICONS[ev.type] || '';
            return (
              <div key={i} className="relative pl-5 pb-3">
                {/* Dot */}
                {/* Color-coded connector to next event */}
                {i < sorted.length - 1 && (
                  <div className="absolute left-[4px] w-[3px] rounded-full"
                    style={{
                      top: '14px', height: 'calc(100% - 6px)',
                      background: `linear-gradient(to bottom, ${statusColor}, ${STATUS_COLORS[sorted[i + 1]?.status] || '#6e7681'})`,
                      opacity: 0.4,
                    }}
                  />
                )}
                <div
                  className={`absolute left-0 top-1 w-[11px] h-[11px] rounded-full border-2 ${i === 0 ? 'timeline-dot-pulse' : ''}`}
                  style={{
                    borderColor: statusColor,
                    background: i === 0 ? statusColor : '#0c1320',
                    color: statusColor,
                  }}
                />

                {/* Date + status badge */}
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-ops-muted text-[11px] font-mono">{formatDate(ev.date)}</span>
                  {icon && <span className="text-[11px]">{icon}</span>}
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase"
                    style={{ background: `${statusColor}22`, color: statusColor }}
                  >
                    {ev.status}
                  </span>
                </div>

                {/* Event title */}
                <p className="text-[13px] text-ops-text font-bold leading-snug">
                  {ev.event}
                </p>

                {/* Detail */}
                {ev.detail && (
                  <p className="text-[11px] text-ops-muted leading-relaxed mt-0.5">
                    {ev.detail}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

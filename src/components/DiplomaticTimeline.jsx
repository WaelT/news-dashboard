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
      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-2">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[5px] top-0 bottom-0 w-px bg-ops-border" />

          {sorted.map((ev, i) => {
            const statusColor = STATUS_COLORS[ev.status] || '#6e7681';
            const icon = TYPE_ICONS[ev.type] || '';
            return (
              <div key={i} className="relative pl-5 pb-3">
                {/* Dot */}
                <div
                  className="absolute left-0 top-1 w-[11px] h-[11px] rounded-full border-2"
                  style={{
                    borderColor: statusColor,
                    background: i === 0 ? statusColor : '#050a0e',
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

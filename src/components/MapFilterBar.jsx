import { useState } from 'react';

const TYPE_LABELS = {
  strike: 'Strike',
  military: 'Military',
  naval: 'Naval',
  nuclear: 'Nuclear',
  oil: 'Oil',
  strategic: 'Strategic',
  diplomatic: 'Diplomatic',
  airbase: 'Airbase',
};

const TYPE_COLORS = {
  strike: '#ff0040',
  military: '#ff6600',
  naval: '#00aaff',
  nuclear: '#ff6600',
  oil: '#ffcc00',
  strategic: '#00aaff',
  diplomatic: '#00ff41',
  airbase: '#ff6600',
};

const STATUS_LABELS = {
  'high-alert': 'High Alert',
  active: 'Active',
  monitoring: 'Monitoring',
};

const STATUS_COLORS = {
  'high-alert': '#ff0040',
  active: '#ff6600',
  monitoring: '#00ff41',
};

function Chip({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-[9px] font-bold px-2 py-1 rounded border transition-colors"
      style={
        active
          ? { background: `${color}22`, borderColor: color, color }
          : { background: 'transparent', borderColor: '#1a2a3a', color: '#6e7681' }
      }
    >
      {label}
    </button>
  );
}

export default function MapFilterBar({ filters, onFiltersChange, countries, showRoutes, onToggleRoutes, showHeat, onToggleHeat, showBoundaries, onToggleBoundaries, showTimeline, onToggleTimeline }) {
  const [expanded, setExpanded] = useState(false);

  const toggleFilter = (category, value) => {
    const updated = { ...filters };
    const set = new Set(updated[category]);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    updated[category] = set;
    onFiltersChange(updated);
  };

  const clearAll = () => {
    onFiltersChange({
      countries: new Set(),
      types: new Set(),
      statuses: new Set(),
      liveOnly: false,
    });
  };

  const hasActive =
    filters.countries.size > 0 ||
    filters.types.size > 0 ||
    filters.statuses.size > 0 ||
    filters.liveOnly;

  return (
    <div className="absolute top-2 left-12 z-[1000]">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="text-[9px] font-bold tracking-wider px-2 py-1 bg-ops-panel/90 border border-ops-border rounded backdrop-blur-sm flex items-center gap-1.5"
      >
        <span className={hasActive ? 'text-ops-green' : 'text-ops-muted'}>FILTERS</span>
        {hasActive && <span className="w-1.5 h-1.5 rounded-full bg-ops-green" />}
        <span className="text-ops-muted ml-1">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <div className="mt-1 bg-ops-panel/90 backdrop-blur-sm border border-ops-border rounded p-2 max-h-[70vh] overflow-y-auto w-[280px]">
          {/* Country */}
          <div className="mb-2">
            <div className="text-[8px] font-bold text-ops-muted tracking-widest mb-1">COUNTRY</div>
            <div className="flex flex-wrap gap-1">
              {countries.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  active={filters.countries.has(c)}
                  color="#00ff41"
                  onClick={() => toggleFilter('countries', c)}
                />
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="mb-2">
            <div className="text-[8px] font-bold text-ops-muted tracking-widest mb-1">TYPE</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(TYPE_LABELS).map(([key, label]) => (
                <Chip
                  key={key}
                  label={label}
                  active={filters.types.has(key)}
                  color={TYPE_COLORS[key]}
                  onClick={() => toggleFilter('types', key)}
                />
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="mb-2">
            <div className="text-[8px] font-bold text-ops-muted tracking-widest mb-1">STATUS</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <Chip
                  key={key}
                  label={label}
                  active={filters.statuses.has(key)}
                  color={STATUS_COLORS[key]}
                  onClick={() => toggleFilter('statuses', key)}
                />
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onFiltersChange({ ...filters, liveOnly: !filters.liveOnly })}
              className={`text-[9px] font-bold px-2 py-1 rounded border ${
                filters.liveOnly
                  ? 'bg-ops-red/20 border-ops-red text-ops-red'
                  : 'bg-transparent border-ops-border text-ops-muted'
              }`}
            >
              LIVE ONLY
            </button>
            <button
              onClick={onToggleRoutes}
              className={`text-[9px] font-bold px-2 py-1 rounded border ${
                showRoutes
                  ? 'bg-ops-red/20 border-ops-red text-ops-red'
                  : 'bg-transparent border-ops-border text-ops-muted'
              }`}
            >
              ATTACK ROUTES
            </button>
            <button
              onClick={onToggleHeat}
              className={`text-[9px] font-bold px-2 py-1 rounded border ${
                showHeat
                  ? 'bg-ops-red/20 border-ops-red text-ops-red'
                  : 'bg-transparent border-ops-border text-ops-muted'
              }`}
            >
              HEAT MAP
            </button>
            <button
              onClick={onToggleBoundaries}
              className={`text-[9px] font-bold px-2 py-1 rounded border ${
                showBoundaries
                  ? 'bg-[#00ff41]/20 border-[#00ff41] text-[#00ff41]'
                  : 'bg-transparent border-ops-border text-ops-muted'
              }`}
            >
              BORDERS
            </button>
            <button
              onClick={onToggleTimeline}
              className={`text-[9px] font-bold px-2 py-1 rounded border ${
                showTimeline
                  ? 'bg-ops-amber/20 border-ops-amber text-ops-amber'
                  : 'bg-transparent border-ops-border text-ops-muted'
              }`}
            >
              TIMELINE
            </button>
          </div>

          {/* Clear */}
          {hasActive && (
            <button
              onClick={clearAll}
              className="text-[9px] font-bold tracking-wider text-ops-muted hover:text-ops-text px-2 py-1 border border-ops-border rounded w-full"
            >
              CLEAR ALL
            </button>
          )}
        </div>
      )}
    </div>
  );
}

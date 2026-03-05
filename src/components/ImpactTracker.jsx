import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
// Note: casualties data is updated via GitHub Action (scripts/update-casualties.mjs)

const PARTY_META = [
  { key: 'iran', flag: '\u{1f1ee}\u{1f1f7}', label: 'Iran', color: '#ff0040' },
  { key: 'israel', flag: '\u{1f1ee}\u{1f1f1}', label: 'Israel', color: '#0088cc' },
  { key: 'usa', flag: '\u{1f1fa}\u{1f1f8}', label: 'USA', color: '#3b82f6' },
  { key: 'lebanon', flag: '\u{1f1f1}\u{1f1e7}', label: 'Lebanon', color: '#ff6600' },
  { key: 'yemen', flag: '\u{1f1fe}\u{1f1ea}', label: 'Yemen', color: '#d4a017' },
  { key: 'iraq', flag: '\u{1f1ee}\u{1f1f6}', label: 'Iraq', color: '#8ac926' },
  { key: 'uae', flag: '\u{1f1e6}\u{1f1ea}', label: 'UAE', color: '#e5e5e5' },
  { key: 'kuwait', flag: '\u{1f1f0}\u{1f1fc}', label: 'Kuwait', color: '#00a676' },
  { key: 'bahrain', flag: '\u{1f1e7}\u{1f1ed}', label: 'Bahrain', color: '#ef4444' },
  { key: 'qatar', flag: '\u{1f1f6}\u{1f1e6}', label: 'Qatar', color: '#8b1a3a' },
  { key: 'syria', flag: '\u{1f1f8}\u{1f1fe}', label: 'Syria', color: '#c084fc' },
  { key: 'palestine', flag: '\u{1f1f5}\u{1f1f8}', label: 'Palestine', color: '#22c55e' },
];

const DEFAULT_CASUALTIES = {
  iran: { killed: 1097, wounded: 5402 },
  israel: { killed: 12, wounded: 1274 },
  usa: { killed: 6, wounded: 20 },
  lebanon: { killed: 72, wounded: 437 },
  yemen: { killed: 0, wounded: 0 },
  iraq: { killed: 20, wounded: 36 },
  uae: { killed: 3, wounded: 68 },
  kuwait: { killed: 4, wounded: 32 },
  bahrain: { killed: 2, wounded: 6 },
  qatar: { killed: 0, wounded: 16 },
  jordan: { killed: 0, wounded: 5 },
  oman: { killed: 1, wounded: 3 },
  syria: { killed: 0, wounded: 0 },
  palestine: { killed: 0, wounded: 0 },
};

function formatNum(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

// --- Squarified treemap layout ---

function worstRatio(row, rowArea, side) {
  const rowW = rowArea / side;
  let worst = 0;
  for (const item of row) {
    const h = item.area / rowW;
    const r = Math.max(rowW / h, h / rowW);
    if (r > worst) worst = r;
  }
  return worst;
}

function layoutRow(row, rowArea, rect, out) {
  const vert = rect.w >= rect.h;
  const rowW = rowArea / (vert ? rect.h : rect.w);
  let off = 0;
  for (const item of row) {
    const size = item.area / rowW;
    if (vert) {
      out.push({ ...item, x: rect.x, y: rect.y + off, w: rowW, h: size });
      off += size;
    } else {
      out.push({ ...item, x: rect.x + off, y: rect.y, w: size, h: rowW });
      off += size;
    }
  }
}

function squarify(items, rect, out) {
  if (!items.length) return;
  if (items.length === 1) {
    out.push({ ...items[0], x: rect.x, y: rect.y, w: rect.w, h: rect.h });
    return;
  }
  const side = Math.min(rect.w, rect.h);
  let row = [];
  let rowArea = 0;
  let i = 0;

  while (i < items.length) {
    const next = [...row, items[i]];
    const nextArea = rowArea + items[i].area;
    if (!row.length || worstRatio(next, nextArea, side) <= worstRatio(row, rowArea, side)) {
      row = next;
      rowArea = nextArea;
      i++;
    } else {
      break;
    }
  }

  layoutRow(row, rowArea, rect, out);
  const vert = rect.w >= rect.h;
  const rowW = rowArea / (vert ? rect.h : rect.w);
  const newRect = vert
    ? { x: rect.x + rowW, y: rect.y, w: rect.w - rowW, h: rect.h }
    : { x: rect.x, y: rect.y + rowW, w: rect.w, h: rect.h - rowW };
  squarify(items.slice(row.length), newRect, out);
}

function buildTreemap(data, width, height) {
  const filtered = data.filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  if (!filtered.length) return [];
  const total = filtered.reduce((s, d) => s + d.value, 0);
  const items = filtered.map((d) => ({ ...d, area: (d.value / total) * width * height }));
  const out = [];
  squarify(items, { x: 0, y: 0, w: width, h: height }, out);
  return out;
}

// --- Component ---

function TreemapCell({ node, hovered, onHover }) {
  const isHovered = hovered === node.key;
  const isSmall = node.w < 80 || node.h < 50;
  const isTiny = node.w < 50 || node.h < 35;

  return (
    <div
      className="absolute transition-all duration-300 overflow-hidden border border-black/30"
      style={{
        left: node.x,
        top: node.y,
        width: node.w,
        height: node.h,
        background: `${node.color}${isHovered ? '50' : '25'}`,
        borderColor: isHovered ? node.color : 'rgba(0,0,0,0.3)',
        zIndex: isHovered ? 10 : 1,
      }}
      onMouseEnter={() => onHover(node.key)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Glow edge */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          boxShadow: `inset 0 0 ${isHovered ? 20 : 8}px ${node.color}44`,
          opacity: isHovered ? 1 : 0.6,
        }}
      />

      <div className="relative h-full flex flex-col justify-center items-center p-1 text-center">
        {isTiny ? (
          /* Tiny cells: name + number only */
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[8px] font-bold" style={{ color: node.color }}>{node.label}</span>
            <span className="text-[8px] font-mono font-bold text-ops-text">{formatNum(node.killed + node.wounded)}</span>
          </div>
        ) : isSmall ? (
          /* Small cells: name + compact numbers */
          <>
            <span className="text-[10px] font-bold" style={{ color: node.color }}>{node.label}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-mono font-bold text-[#ff0040]">{formatNum(node.killed)}</span>
              <span className="text-[7px] text-ops-muted">/</span>
              <span className="text-[9px] font-mono font-bold text-[#ff6600]">{formatNum(node.wounded)}</span>
            </div>
          </>
        ) : (
          /* Normal / large cells: full detail */
          <>
            <span className="text-sm font-bold tracking-wider mb-1" style={{ color: node.color }}>{node.label}</span>
            <div className="flex items-center gap-3 mt-1">
              <div className="text-center">
                <div className="text-[7px] text-ops-muted font-bold tracking-wider">KILLED</div>
                <div className="text-base font-bold font-mono text-[#ff0040] leading-tight">{formatNum(node.killed)}</div>
              </div>
              <div className="text-center">
                <div className="text-[7px] text-ops-muted font-bold tracking-wider">WOUNDED</div>
                <div className="text-base font-bold font-mono text-[#ff6600] leading-tight">{formatNum(node.wounded)}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ImpactTracker() {
  const casualties = DEFAULT_CASUALTIES;
  const [hovered, setHovered] = useState(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDims({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const parties = useMemo(
    () => PARTY_META.map((p) => ({
      ...p,
      ...(casualties[p.key] || { killed: 0, wounded: 0 }),
      value: (casualties[p.key]?.killed || 0) + (casualties[p.key]?.wounded || 0),
    })),
    [casualties],
  );

  const nodes = useMemo(
    () => (dims.w > 0 && dims.h > 0 ? buildTreemap(parties, dims.w, dims.h) : []),
    [parties, dims],
  );

  const totalKilled = parties.reduce((s, p) => s + p.killed, 0);
  const totalWounded = parties.reduce((s, p) => s + p.wounded, 0);
  const dateLabel = 'MAR 5, 2026';

  const handleHover = useCallback((key) => setHovered(key), []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-1.5 border-b border-ops-border flex items-center justify-between">
        <span className="text-ops-red text-[10px] font-bold tracking-widest">CASUALTIES</span>
        <span className="text-ops-muted text-[8px]">{dateLabel}</span>
      </div>

      {/* Totals bar */}
      <div className="px-3 py-1.5 border-b border-ops-border/50 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff0040]" />
          <span className="text-[8px] text-ops-muted font-bold">KILLED</span>
          <span className="text-sm font-bold font-mono text-[#ff0040]">{formatNum(totalKilled)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6600]" />
          <span className="text-[8px] text-ops-muted font-bold">WOUNDED</span>
          <span className="text-sm font-bold font-mono text-[#ff6600]">{formatNum(totalWounded)}</span>
        </div>
      </div>

      {/* Treemap */}
      <div ref={containerRef} className="flex-1 min-h-0 relative">
        {nodes.map((node) => (
          <TreemapCell key={node.key} node={node} hovered={hovered} onHover={handleHover} />
        ))}
      </div>

      {/* Source */}
      <div className="px-3 py-1 border-t border-ops-border/50">
        <p className="text-ops-muted text-[7px]">
          Sources: Wikipedia, Al Jazeera, HRANA, Reuters.
        </p>
      </div>
    </div>
  );
}

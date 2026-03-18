import { useMemo } from 'react';

export default function Sparkline({
  data = [],
  width = 60,
  height = 20,
  color = '#00ff41',
  fillColor,
  strokeWidth = 1.5,
  showDots = false,
  dotRadius = 1.5,
  padding = 2,
}) {
  const points = useMemo(() => {
    if (!data.length) return [];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = width - padding * 2;
    const h = height - padding * 2;
    return data.map((v, i) => ({
      x: padding + (i / Math.max(data.length - 1, 1)) * w,
      y: padding + h - ((v - min) / range) * h,
    }));
  }, [data, width, height, padding]);

  if (points.length < 2) return null;

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');
  const fill = fillColor
    ? `${points[0].x},${height} ${polyline} ${points[points.length - 1].x},${height}`
    : null;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      {fill && (
        <polygon points={fill} fill={fillColor} opacity="0.15" />
      )}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {showDots &&
        points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={dotRadius} fill={color} />
        ))}
    </svg>
  );
}

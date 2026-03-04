import { useMemo, useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import conflictZones from '../data/conflictZones';
import MapMarkerPopup from './MapMarkerPopup';

// SVG icon paths for each marker type
const ICONS = {
  explosion: `
    <circle cx="12" cy="14" r="7" fill="#ff0040" opacity="0.85"/>
    <rect x="10.5" y="3" width="3" height="6" rx="1" fill="#ff0040" opacity="0.9"/>
    <line x1="8" y1="4" x2="12" y2="7" stroke="#ff5577" stroke-width="1.2"/>
    <line x1="16" y1="4" x2="12" y2="7" stroke="#ff5577" stroke-width="1.2"/>
    <line x1="8" y1="2" x2="8" y2="5" stroke="#ff5577" stroke-width="1"/>
    <line x1="16" y1="2" x2="16" y2="5" stroke="#ff5577" stroke-width="1"/>
  `,
  nuclear: `<text x="12" y="17" text-anchor="middle" font-size="18" fill="#ff6600">☢</text>`,
  military: `
    <circle cx="12" cy="12" r="7" fill="none" stroke="#ff6600" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="3" fill="none" stroke="#ff6600" stroke-width="1.2"/>
    <line x1="12" y1="3" x2="12" y2="7" stroke="#ff6600" stroke-width="1.5"/>
    <line x1="12" y1="17" x2="12" y2="21" stroke="#ff6600" stroke-width="1.5"/>
    <line x1="3" y1="12" x2="7" y2="12" stroke="#ff6600" stroke-width="1.5"/>
    <line x1="17" y1="12" x2="21" y2="12" stroke="#ff6600" stroke-width="1.5"/>
  `,
  missile: `
    <g transform="scale(0.24)">
      <circle fill="#ff0040" cx="50" cy="50" r="41.5" opacity="0.9"/>
      <path fill="#FFFFFF" d="M60.23,25.703c-0.197-0.2-0.469-0.324-0.771-0.324c-0.223,0-0.427,0.068-0.6,0.181l-7.857,5.334 l0.001-4.562c-0.001-0.555-0.45-1.003-1.003-1.003s-1.001,0.448-1.002,1.003v8.669c0,0.345-0.278,0.624-0.624,0.624 c-0.344,0-0.622-0.278-0.622-0.624V30.65c0-0.433-0.247-0.764-0.593-1.001l-6.02-4.089c-0.172-0.112-0.376-0.18-0.598-0.18 c-0.303,0-0.576,0.125-0.773,0.324c-0.193,0.194-0.312,0.465-0.312,0.762v10.64c0,1.687,0.863,3.171,2.168,4.035l4.604,3.128 l-3.477,3.6c-0.006,0.007-0.013,0.011-0.019,0.017c-0.191,0.196-0.311,0.463-0.313,0.759c0,0-0.002,6.878-0.002,6.88 c0,0.345,0.277,0.623,0.62,0.629h13.92c0.343-0.006,0.62-0.284,0.62-0.629c0-0.002-0.002-6.88-0.002-6.88 c-0.001-0.296-0.121-0.563-0.313-0.759c-0.006-0.005-0.013-0.01-0.019-0.017l-3.477-3.6l4.604-3.128 c1.306-0.863,2.168-2.348,2.168-4.035l0.001-10.64C60.543,26.169,60.424,25.899,60.23,25.703z"/>
      <path fill="#FFFFFF" d="M56.862,57.593H43.137c-0.345,0-0.625,0.279-0.625,0.625c0,0.003,0.002,0.007,0.002,0.011l-0.002,0.003 c0.491,5.852,2.994,11.129,6.814,15.135c0.165,0.186,0.406,0.304,0.673,0.304s0.508-0.118,0.673-0.304 c3.82-4.006,6.322-9.282,6.814-15.135l-0.002-0.002c0-0.004,0.002-0.008,0.002-0.012C57.487,57.872,57.208,57.593,56.862,57.593z"/>
    </g>
  `,
  naval: `
    <path d="M4 17 Q8 14 12 14 Q16 14 20 17Z" fill="#00aaff" opacity="0.8"/>
    <rect x="10" y="9" width="4" height="5" fill="#00aaff" opacity="0.9"/>
    <line x1="12" y1="4" x2="12" y2="9" stroke="#00aaff" stroke-width="1.5"/>
    <path d="M3 19 Q7 17 12 17 Q17 17 21 19" fill="none" stroke="#00aaff" stroke-width="1" opacity="0.5"/>
  `,
  airbase: `<path d="M12 3 L13 9 L20 13 L13 12 L13 19 L15 21 L12 20 L9 21 L11 19 L11 12 L4 13 L11 9Z" fill="#ff6600" opacity="0.85"/>`,
  government: `
    <path d="M12 3 L20 9 L4 9Z" fill="#ff0040" opacity="0.9"/>
    <rect x="5" y="9" width="14" height="10" fill="#ff0040" opacity="0.7"/>
    <rect x="7" y="11" width="2" height="3" fill="#050a0e"/>
    <rect x="11" y="11" width="2" height="8" fill="#050a0e"/>
    <rect x="15" y="11" width="2" height="3" fill="#050a0e"/>
    <line x1="4" y1="19" x2="20" y2="19" stroke="#ff0040" stroke-width="1.5"/>
  `,
  oil: `
    <path d="M12 3 Q12 3 16 12 A5.5 5.5 0 0 1 8 12 Q12 3 12 3Z" fill="#ffcc00" opacity="0.85"/>
    <path d="M10.5 13 Q12 11 13.5 13 A2 2 0 0 1 10.5 13Z" fill="#050a0e" opacity="0.4"/>
  `,
  shipping: `
    <path d="M3 14 Q6 11 9 14 Q12 17 15 14 Q18 11 21 14" fill="none" stroke="#00aaff" stroke-width="1.5"/>
    <path d="M3 18 Q6 15 9 18 Q12 21 15 18 Q18 15 21 18" fill="none" stroke="#00aaff" stroke-width="1.2" opacity="0.5"/>
    <polygon points="12,3 15,8 9,8" fill="#00aaff" opacity="0.7"/>
  `,
  diplomatic: `
    <circle cx="12" cy="7" r="4" fill="none" stroke="#00ff41" stroke-width="1.5"/>
    <path d="M5 21 Q5 14 12 14 Q19 14 19 21" fill="none" stroke="#00ff41" stroke-width="1.5"/>
    <circle cx="12" cy="7" r="1.5" fill="#00ff41" opacity="0.5"/>
  `,
};

const LEGEND_ICONS = {
  missile: `<svg width="12" height="12" viewBox="0 0 100 100"><circle fill="#ff0040" cx="50" cy="50" r="41.5"/><path fill="#FFFFFF" d="M60.23,25.703c-0.197-0.2-0.469-0.324-0.771-0.324c-0.223,0-0.427,0.068-0.6,0.181l-7.857,5.334l0.001-4.562c-0.001-0.555-0.45-1.003-1.003-1.003s-1.001,0.448-1.002,1.003v8.669c0,0.345-0.278,0.624-0.624,0.624c-0.344,0-0.622-0.278-0.622-0.624V30.65c0-0.433-0.247-0.764-0.593-1.001l-6.02-4.089c-0.172-0.112-0.376-0.18-0.598-0.18c-0.303,0-0.576,0.125-0.773,0.324c-0.193,0.194-0.312,0.465-0.312,0.762v10.64c0,1.687,0.863,3.171,2.168,4.035l4.604,3.128l-3.477,3.6c-0.006,0.007-0.013,0.011-0.019,0.017c-0.191,0.196-0.311,0.463-0.313,0.759c0,0-0.002,6.878-0.002,6.88c0,0.345,0.277,0.623,0.62,0.629h13.92c0.343-0.006,0.62-0.284,0.62-0.629c0-0.002-0.002-6.88-0.002-6.88c-0.001-0.296-0.121-0.563-0.313-0.759c-0.006-0.005-0.013-0.01-0.019-0.017l-3.477-3.6l4.604-3.128c1.306-0.863,2.168-2.348,2.168-4.035l0.001-10.64C60.543,26.169,60.424,25.899,60.23,25.703z"/><path fill="#FFFFFF" d="M56.862,57.593H43.137c-0.345,0-0.625,0.279-0.625,0.625c0,0.003,0.002,0.007,0.002,0.011l-0.002,0.003c0.491,5.852,2.994,11.129,6.814,15.135c0.165,0.186,0.406,0.304,0.673,0.304s0.508-0.118,0.673-0.304c3.82-4.006,6.322-9.282,6.814-15.135l-0.002-0.002c0-0.004,0.002-0.008,0.002-0.012C57.487,57.872,57.208,57.593,56.862,57.593z"/></svg>`,
  nuclear: `<svg width="12" height="12" viewBox="0 0 24 24"><text x="12" y="18" text-anchor="middle" font-size="20" fill="#ff6600">☢</text></svg>`,
  military: `<svg width="12" height="12" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="none" stroke="#ff6600" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="none" stroke="#ff6600" stroke-width="1.5"/><line x1="12" y1="3" x2="12" y2="7" stroke="#ff6600" stroke-width="2"/><line x1="12" y1="17" x2="12" y2="21" stroke="#ff6600" stroke-width="2"/><line x1="3" y1="12" x2="7" y2="12" stroke="#ff6600" stroke-width="2"/><line x1="17" y1="12" x2="21" y2="12" stroke="#ff6600" stroke-width="2"/></svg>`,
  naval: `<svg width="12" height="12" viewBox="0 0 24 24"><path d="M4 17 Q8 14 12 14 Q16 14 20 17Z" fill="#00aaff"/><rect x="10" y="9" width="4" height="5" fill="#00aaff"/><line x1="12" y1="4" x2="12" y2="9" stroke="#00aaff" stroke-width="2"/></svg>`,
  oil: `<svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 3 Q12 3 16 12 A5.5 5.5 0 0 1 8 12 Q12 3 12 3Z" fill="#ffcc00"/></svg>`,
  diplomatic: `<svg width="12" height="12" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" fill="none" stroke="#00ff41" stroke-width="2"/><path d="M5 21 Q5 14 12 14 Q19 14 19 21" fill="none" stroke="#00ff41" stroke-width="2"/></svg>`,
};

const STATUS_RING = {
  'high-alert': { color: '#ff0040', opacity: 0.5 },
  active: { color: '#ff6600', opacity: 0.4 },
  monitoring: { color: '#00ff41', opacity: 0.3 },
};

// --- Live activity helpers ---

const STRIKE_KEYWORDS = [
  'strike', 'airstrike', 'bomb', 'explosion', 'missile', 'attack', 'killed', 'destroyed',
  'ضربة', 'قصف', 'غارة', 'صاروخ', 'انفجار', 'هجوم', 'قتل',
];

function matchArticles(zone, articles) {
  if (!zone.keywords || !articles.length) return [];
  const kw = zone.keywords.map((k) => k.toLowerCase());
  return articles
    .filter((a) => {
      const text = `${a.title || ''} ${a.description || ''}`.toLowerCase();
      return kw.some((k) => text.includes(k));
    })
    .slice(0, 8);
}

function articleAge(article) {
  if (!article.pubDate) return Infinity;
  return (Date.now() - new Date(article.pubDate).getTime()) / 1000;
}

function isStrikeArticle(article) {
  const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();
  return STRIKE_KEYWORDS.some((kw) => text.includes(kw));
}

function computeLiveStatus(zone, matched) {
  if (!matched.length) return { status: zone.status, articleCount: 0, isFlash: false, hasStrike: false };

  const newest = Math.min(...matched.map(articleAge));
  const strikeMatches = matched.filter(isStrikeArticle);
  const hasStrike = strikeMatches.length > 0;
  const newestStrike = hasStrike ? Math.min(...strikeMatches.map(articleAge)) : Infinity;

  let status = zone.status;
  if (newest < 3600) status = 'high-alert';          // < 1 hour
  else if (newest < 21600) status = 'active';         // < 6 hours
  else if (newest < 86400 && matched.length >= 2) status = 'active';

  const isFlash = newestStrike < 1800;  // strike in last 30 min

  return { status, articleCount: matched.length, isFlash, hasStrike };
}

// --- Icon creation ---

function createMarkerIcon(zone, live) {
  const svgContent = ICONS[zone.icon] || ICONS.military;
  const ring = STATUS_RING[live.status] || STATUS_RING.monitoring;

  // Scale up markers with more activity
  let size = zone.type === 'capital' || zone.type === 'strike' ? 32 : 26;
  if (live.articleCount >= 3) size = Math.max(size, 36);
  else if (live.articleCount >= 1) size = Math.max(size, 30);

  const isPulsing = live.status === 'high-alert' || zone.type === 'strike';
  const isFlash = live.isFlash;

  const pulseRing = isPulsing
    ? `<circle cx="12" cy="12" r="11" fill="none" stroke="${ring.color}" stroke-width="1" opacity="${ring.opacity}" class="map-icon-pulse"/>`
    : '';

  const flashRing = isFlash
    ? `<circle cx="12" cy="12" r="11" fill="${ring.color}" opacity="0.15" class="map-icon-flash"/>`
    : '';

  // Article count badge
  const badge = live.articleCount > 0
    ? `<circle cx="20" cy="4" r="5" fill="${ring.color}"/>
       <text x="20" y="6.5" text-anchor="middle" font-size="7" font-weight="bold" fill="white" font-family="monospace">${live.articleCount > 9 ? '9+' : live.articleCount}</text>`
    : '';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" style="overflow:visible;filter:drop-shadow(0 0 ${isFlash ? 8 : 4}px ${ring.color});">
      ${flashRing}
      ${pulseRing}
      ${svgContent}
      ${badge}
    </svg>`;

  return L.divIcon({
    className: `map-marker-icon${isFlash ? ' map-marker-flash' : ''}`,
    html: svg,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

// --- Components ---

function ClickMarker({ zone, articles }) {
  const matched = useMemo(() => matchArticles(zone, articles), [zone, articles]);
  const live = useMemo(() => computeLiveStatus(zone, matched), [zone, matched]);
  const icon = useMemo(() => createMarkerIcon(zone, live), [zone, live]);
  const zIndex = live.status === 'high-alert' ? 1000 : live.status === 'active' ? 500 : 100;

  return (
    <Marker position={[zone.lat, zone.lng]} icon={icon} zIndexOffset={zIndex}>
      <Popup closeButton={true} maxWidth={420} minWidth={300}>
        <MapMarkerPopup zone={{ ...zone, status: live.status }} articles={matched} liveCount={live.articleCount} />
      </Popup>
    </Marker>
  );
}

// Live event feed overlay — shows recent article-zone matches
function LiveEventFeed({ events }) {
  const [visible, setVisible] = useState(false);
  if (!events.length) return null;

  return (
    <div className="absolute top-10 right-3 z-[1000] max-w-[280px]">
      <button
        onClick={() => setVisible((v) => !v)}
        className="text-[9px] font-bold tracking-wider px-2 py-1 bg-ops-panel/90 border border-ops-border rounded backdrop-blur-sm flex items-center gap-1.5 mb-1"
      >
        <span className="live-dot w-1.5 h-1.5 rounded-full bg-ops-red" />
        <span className="text-ops-red">LIVE EVENTS</span>
        <span className="text-ops-muted">({events.length})</span>
        <span className="text-ops-muted ml-1">{visible ? '▼' : '▶'}</span>
      </button>

      {visible && (
        <div className="bg-ops-panel/90 border border-ops-border rounded backdrop-blur-sm max-h-[200px] overflow-y-auto">
          {events.map((ev, i) => (
            <div
              key={i}
              className="px-2 py-1.5 border-b border-ops-border/30 last:border-b-0"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: ev.isStrike ? '#ff0040' : '#ff6600' }}
                />
                <span className="text-[9px] font-bold truncate" style={{ color: ev.isStrike ? '#ff0040' : '#ff6600' }}>
                  {ev.zoneName}
                </span>
                <span className="text-[8px] text-ops-muted shrink-0">{ev.timeAgo}</span>
              </div>
              <p className="text-[9px] text-ops-text leading-tight line-clamp-2">{ev.title}</p>
              <span
                className="text-[7px] font-bold px-1 py-px rounded mt-0.5 inline-block"
                style={{ background: `${ev.sourceColor || '#6e7681'}22`, color: ev.sourceColor || '#6e7681' }}
              >
                {ev.source}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Auto-fly to most active zone when articles update
function FlyToActive({ zones, articles }) {
  const map = useMap();
  const lastFlyRef = useRef(null);

  useEffect(() => {
    if (!articles.length) return;

    // Find the zone with the most recent strike article
    let bestZone = null;
    let bestAge = Infinity;

    for (const zone of zones) {
      const matched = matchArticles(zone, articles);
      const strikes = matched.filter(isStrikeArticle);
      if (!strikes.length) continue;
      const age = Math.min(...strikes.map(articleAge));
      if (age < bestAge) {
        bestAge = age;
        bestZone = zone;
      }
    }

    // Only fly if there's a very recent strike (<10min) we haven't flown to yet
    if (bestZone && bestAge < 600) {
      const flyKey = `${bestZone.id}-${Math.floor(bestAge / 60)}`;
      if (lastFlyRef.current !== flyKey) {
        lastFlyRef.current = flyKey;
        map.flyTo([bestZone.lat, bestZone.lng], 7, { duration: 1.5 });
      }
    }
  }, [articles, zones, map]);

  return null;
}

function LegendItem({ icon, label, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <span dangerouslySetInnerHTML={{ __html: LEGEND_ICONS[icon] }} />
      <span style={{ color }}>{label}</span>
    </div>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const s = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function MapView({ articles = [] }) {
  // Fetch dynamic strike zones from strikes.json
  const [dynamicZones, setDynamicZones] = useState([]);

  useEffect(() => {
    let cancelled = false;
    function fetchStrikes() {
      fetch('/strikes.json')
        .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
        .then((data) => {
          if (!cancelled && Array.isArray(data?.zones)) {
            setDynamicZones(data.zones);
          }
        })
        .catch(() => {});
    }
    fetchStrikes();
    const interval = setInterval(fetchStrikes, 5 * 60 * 1000); // refresh every 5 min
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // Merge static + dynamic zones, dynamic overwrites static by id
  const allZones = useMemo(() => {
    const map = new Map();
    for (const z of conflictZones) map.set(z.id, z);
    for (const z of dynamicZones) map.set(z.id, z); // dynamic overwrites or adds
    return Array.from(map.values());
  }, [dynamicZones]);

  // Build live events list — recent article-zone matches
  const liveEvents = useMemo(() => {
    const events = [];
    const sixHoursAgo = Date.now() - 6 * 3600 * 1000;

    for (const zone of allZones) {
      const matched = matchArticles(zone, articles);
      for (const a of matched) {
        const pubTime = a.pubDate ? new Date(a.pubDate).getTime() : 0;
        if (pubTime > sixHoursAgo) {
          events.push({
            zoneName: zone.name,
            title: a.title,
            source: a.source,
            sourceColor: a.sourceColor,
            timeAgo: timeAgo(a.pubDate),
            pubTime,
            isStrike: isStrikeArticle(a),
          });
        }
      }
    }

    // Deduplicate by title prefix
    const seen = new Set();
    const deduped = events.filter((e) => {
      const key = e.title?.slice(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return deduped.sort((a, b) => b.pubTime - a.pubTime).slice(0, 15);
  }, [articles, allZones]);

  // Count active zones for the header
  const activeCount = useMemo(() => {
    let count = 0;
    for (const zone of allZones) {
      const matched = matchArticles(zone, articles);
      if (matched.length > 0) count++;
    }
    return count;
  }, [articles, allZones]);

  return (
    <div className="w-full h-full relative">
      {/* Panel label */}
      <div className="absolute top-2 right-3 z-[1000] flex items-center gap-2">
        <span className="text-ops-green text-[10px] font-bold tracking-widest uppercase bg-ops-panel/90 px-2 py-1 border border-ops-border rounded backdrop-blur-sm">
          TACTICAL MAP — MIDDLE EAST THEATER
        </span>
        {activeCount > 0 && (
          <span className="text-[9px] font-bold bg-ops-panel/90 px-2 py-1 border border-ops-border rounded backdrop-blur-sm flex items-center gap-1.5">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-ops-red" />
            <span className="text-ops-red">{activeCount} ACTIVE</span>
          </span>
        )}
      </div>

      {/* Live event feed */}
      <LiveEventFeed events={liveEvents} />

      {/* Legend */}
      <div className="absolute bottom-6 right-3 z-[1000] bg-ops-panel/90 border border-ops-border rounded px-2.5 py-2 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[8px]">
          <LegendItem icon="missile" label="Strike Zone" color="#ff0040" />
          <LegendItem icon="military" label="Military" color="#ff6600" />
          <LegendItem icon="nuclear" label="Nuclear" color="#ff6600" />
          <LegendItem icon="naval" label="Naval" color="#00aaff" />
          <LegendItem icon="oil" label="Oil / Energy" color="#ffcc00" />
          <LegendItem icon="diplomatic" label="Diplomatic" color="#00ff41" />
        </div>
        <div className="mt-1.5 pt-1.5 border-t border-ops-border/50 flex items-center gap-3 text-[7px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff0040]" />HIGH ALERT</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff6600]" />ACTIVE</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00ff41]" />MONITORING</span>
        </div>
      </div>

      <MapContainer
        center={[28, 49]}
        zoom={5}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <FlyToActive zones={allZones} articles={articles} />

        {allZones.map((zone) => (
          <ClickMarker key={zone.id} zone={zone} articles={articles} />
        ))}
      </MapContainer>
    </div>
  );
}

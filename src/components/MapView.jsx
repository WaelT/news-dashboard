import React, { useMemo, useRef, useEffect, useState, useCallback, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, GeoJSON, useMap, CircleMarker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import conflictZones from '../data/conflictZones';
import MapMarkerPopup from './MapMarkerPopup';
import MapFilterBar from './MapFilterBar';
import attackRoutes from '../data/attackRoutes';
import launchData, { countryBreakdown } from '../data/launchData';
import groundOps from '../data/groundOps';
import displacementData from '../data/displacementData';

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

// --- Country derivation ---

const COUNTRY_FALLBACK = {
  10: 'Iran',
  101: 'Israel',
  102: 'Israel',
  103: 'Israel',
  117: 'Yemen',
  118: 'Kuwait',
  120: 'Other',
  123: 'Israel',
  127: 'Lebanon',
  139: 'Jordan',
  140: 'Jordan',
};

// Map GeoJSON country names to our data names
const GEO_NAME_MAP = {
  'United Arab Emirates': 'UAE',
  'Saudi Arabia': 'Saudi Arabia',
  Iran: 'Iran',
  Israel: 'Israel',
  Iraq: 'Iraq',
  Kuwait: 'Kuwait',
  Qatar: 'Qatar',
  Bahrain: 'Bahrain',
  Jordan: 'Jordan',
  Yemen: 'Yemen',
  Lebanon: 'Lebanon',
  Syria: 'Syria',
  Oman: 'Oman',
  Turkey: 'Turkey',
  Azerbaijan: 'Azerbaijan',
};

const TARGET_CC = {
  UAE: 'ae', Israel: 'il', Qatar: 'qa', Kuwait: 'kw', Bahrain: 'bh',
  'Saudi Arabia': 'sa', Jordan: 'jo', Iraq: 'iq', Iran: 'ir',
  Syria: 'sy', Lebanon: 'lb', Yemen: 'ye', Oman: 'om', Turkey: 'tr',
  Azerbaijan: 'az',
};

function getCountry(zone) {
  if (zone.id >= 1 && zone.id <= 24) return 'Iran';
  if (zone.id >= 147 && zone.id <= 151) return 'Azerbaijan';
  const comma = zone.name.lastIndexOf(', ');
  if (comma !== -1) return zone.name.slice(comma + 2);
  return COUNTRY_FALLBACK[zone.id] || 'Other';
}

// --- Live activity helpers ---

const STRIKE_KEYWORDS = [
  'strike', 'airstrike', 'bomb', 'explosion', 'missile', 'attack', 'killed', 'destroyed',
  'ضربة', 'قصف', 'غارة', 'صاروخ', 'انفجار', 'هجوم', 'قتل',
];

// Location keywords = first keyword for each zone (city/place name)
// Action keywords = global strike/conflict terms
const ACTION_KEYWORDS = [
  'strike', 'airstrike', 'bomb', 'explosion', 'missile', 'attack', 'killed',
  'destroyed', 'intercept', 'launch', 'raid', 'shell', 'target', 'drone',
  'ضربة', 'قصف', 'غارة', 'صاروخ', 'انفجار', 'هجوم', 'قتل', 'تدمير', 'اعتراض',
];

function matchArticles(zone, articles) {
  if (!zone.keywords || !articles.length) return [];
  const locationKw = zone.keywords.map((k) => k.toLowerCase());
  return articles
    .filter((a) => {
      const text = `${a.title || ''} ${a.description || ''}`.toLowerCase();
      const hasLocation = locationKw.some((k) => text.includes(k));
      if (!hasLocation) return false;
      const hasAction = ACTION_KEYWORDS.some((k) => text.includes(k));
      return hasAction;
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
  if (newest < 3600) status = 'high-alert';
  else if (newest < 21600) status = 'active';
  else if (newest < 86400 && matched.length >= 2) status = 'active';

  const isFlash = newestStrike < 1800;

  return { status, articleCount: matched.length, isFlash, hasStrike };
}

// --- Icon creation ---

function createMarkerIcon(zone, live) {
  const svgContent = ICONS[zone.icon] || ICONS.military;
  const ring = STATUS_RING[live.status] || STATUS_RING.monitoring;

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

// Custom cluster icon for ops-center theme
function createClusterIcon(cluster) {
  const count = cluster.getChildCount();
  const children = cluster.getAllChildMarkers();
  let maxStatus = 'monitoring';
  for (const m of children) {
    const cls = m.options.icon?.options?.className || '';
    if (cls.includes('map-marker-flash')) { maxStatus = 'high-alert'; break; }
  }
  const hasHighAlert = count > 5;
  const color = hasHighAlert || maxStatus === 'high-alert' ? '#ff0040' : count > 3 ? '#ff6600' : '#00ff41';
  const sz = count > 20 ? 40 : count > 10 ? 34 : 28;

  return L.divIcon({
    className: 'marker-cluster-ops',
    html: `<svg width="${sz}" height="${sz}" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="${color}" opacity="0.2" stroke="${color}" stroke-width="1.5"/>
      <circle cx="20" cy="20" r="12" fill="${color}" opacity="0.4"/>
      <text x="20" y="24" text-anchor="middle" fill="white" font-size="12" font-weight="bold" font-family="monospace">${count}</text>
    </svg>`,
    iconSize: [sz, sz],
    iconAnchor: [sz / 2, sz / 2],
  });
}

// --- Components ---

const ClickMarker = memo(function ClickMarker({ zone, articles }) {
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
});

// ========== Feature 1: Heat Map Overlay ==========

function HeatLayer({ zones, zoneLiveMap }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    const points = zones.map((zone) => {
      const ld = zoneLiveMap.get(zone.id);
      let intensity = 0.2;
      if (ld) {
        if (ld.live.status === 'high-alert') intensity = 1.0;
        else if (ld.live.status === 'active') intensity = 0.6;
        intensity += Math.min(ld.live.articleCount * 0.1, 0.4);
      }
      return [zone.lat, zone.lng, Math.min(intensity, 1.0)];
    });

    if (layerRef.current) map.removeLayer(layerRef.current);
    layerRef.current = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 8,
      gradient: { 0.2: '#00ff41', 0.4: '#ff6600', 0.7: '#ff0040', 1.0: '#ff0040' },
    }).addTo(map);

    return () => {
      if (layerRef.current) map.removeLayer(layerRef.current);
    };
  }, [map, zones, zoneLiveMap]);

  return null;
}

// ========== Feature 2: Animated Attack Trajectories ==========

function computeArc(from, to, numPoints = 30) {
  const midLat = (from[0] + to[0]) / 2;
  const midLng = (from[1] + to[1]) / 2;
  const dLat = to[0] - from[0];
  const dLng = to[1] - from[1];
  const offset = 0.15;
  const ctrlLat = midLat + dLng * offset;
  const ctrlLng = midLng - dLat * offset;
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * ctrlLat + t * t * to[0];
    const lng = (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * ctrlLng + t * t * to[1];
    points.push([lat, lng]);
  }
  return points;
}

function bezierPoint(from, to, t) {
  const midLat = (from[0] + to[0]) / 2;
  const midLng = (from[1] + to[1]) / 2;
  const dLat = to[0] - from[0];
  const dLng = to[1] - from[1];
  const offset = 0.15;
  const ctrlLat = midLat + dLng * offset;
  const ctrlLng = midLng - dLat * offset;
  return [
    (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * ctrlLat + t * t * to[0],
    (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * ctrlLng + t * t * to[1],
  ];
}

function AnimatedRoute({ route, offset }) {
  const map = useMap();
  const dotRef = useRef(null);
  const trailRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const dot = L.circleMarker([0, 0], {
      radius: 4,
      fillColor: route.color,
      fillOpacity: 1,
      color: route.color,
      weight: 1,
      className: 'missile-dot-marker',
    }).addTo(map);

    const trail = L.polyline([], {
      color: route.color,
      weight: 2,
      opacity: 0.6,
    }).addTo(map);

    dotRef.current = dot;
    trailRef.current = trail;

    const duration = 4000;
    let start = performance.now() - offset * duration;

    function animate(now) {
      const elapsed = (now - start) % duration;
      const t = elapsed / duration;
      const pos = bezierPoint(route.from, route.to, t);
      dot.setLatLng(pos);
      dot.setStyle({ fillOpacity: 0.6 + t * 0.4 });

      // Trail: last 8 positions
      const trailPts = [];
      for (let i = 7; i >= 0; i--) {
        const tt = Math.max(0, t - i * 0.015);
        trailPts.push(bezierPoint(route.from, route.to, tt));
      }
      trail.setLatLngs(trailPts);

      frameRef.current = requestAnimationFrame(animate);
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      map.removeLayer(dot);
      map.removeLayer(trail);
    };
  }, [map, route, offset]);

  return null;
}

function AnimatedAttackLines() {
  return (
    <>
      {attackRoutes.map((route, i) => (
        <React.Fragment key={route.id}>
          <Polyline
            positions={computeArc(route.from, route.to)}
            pathOptions={{
              color: route.color,
              weight: 1,
              opacity: 0.2,
              dashArray: '8,6',
              className: 'attack-line',
            }}
          >
            <Tooltip permanent={false} direction="center" className="attack-tooltip">
              {route.label}
            </Tooltip>
          </Polyline>
          <AnimatedRoute route={route} offset={i * 0.25} />
        </React.Fragment>
      ))}
    </>
  );
}

// ========== Feature 4: Country Boundaries ==========

function CountryBoundaries({ onHover }) {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch('/geojson/middle-east.geojson')
      .then((r) => r.json())
      .then(setGeoData)
      .catch(() => {});
  }, []);

  // Compute attack intensity per country
  const countryIntensity = useMemo(() => {
    const totals = {};
    let max = 1;
    for (const item of countryBreakdown.missiles) {
      totals[item.country] = (totals[item.country] || 0) + item.count;
    }
    for (const item of countryBreakdown.drones) {
      totals[item.country] = (totals[item.country] || 0) + item.count;
    }
    // Iran is attacker, give it high intensity
    totals['Iran'] = 999;
    for (const v of Object.values(totals)) {
      if (v > max && v < 999) max = v;
    }
    const normalized = {};
    for (const [k, v] of Object.entries(totals)) {
      normalized[k] = v >= 999 ? 1.0 : v / max;
    }
    return normalized;
  }, []);

  const style = useCallback((feature) => {
    const name = GEO_NAME_MAP[feature.properties.name] || feature.properties.name;
    const intensity = countryIntensity[name] || 0;
    let fillColor = '#00ff41';
    if (intensity > 0.6) fillColor = '#ff0040';
    else if (intensity > 0.3) fillColor = '#ff6600';
    else if (intensity > 0.05) fillColor = '#ffcc00';

    return {
      fillColor,
      fillOpacity: 0.05 + intensity * 0.15,
      color: '#1b3a2a',
      weight: 1,
      opacity: 0.6,
    };
  }, [countryIntensity]);

  const onEachFeature = useCallback((feature, layer) => {
    const name = GEO_NAME_MAP[feature.properties.name] || feature.properties.name;
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ fillOpacity: 0.3, weight: 2, color: '#00ff41' });
        onHover({ name, latlng: e.latlng });
      },
      mousemove: (e) => {
        onHover({ name, latlng: e.latlng });
      },
      mouseout: (e) => {
        e.target.setStyle(style(feature));
        onHover(null);
      },
    });
  }, [onHover, style]);

  if (!geoData) return null;

  return <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />;
}

// ========== Feature 5: Timeline Slider ==========

function formatSliderDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

function TimelineSlider({ dayIndex, setDayIndex }) {
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setDayIndex((prev) => {
          if (prev >= launchData.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, setDayIndex]);

  const day = launchData[dayIndex];
  const cumMissiles = launchData.slice(0, dayIndex + 1).reduce((s, d) => s + d.missiles, 0);
  const cumDrones = launchData.slice(0, dayIndex + 1).reduce((s, d) => s + d.drones, 0);
  const cumIntercepted = launchData.slice(0, dayIndex + 1).reduce((s, d) => s + d.intercepted, 0);

  return (
    <div className="absolute bottom-6 left-12 z-[1000] bg-ops-panel/90 border border-ops-border rounded px-3 py-2 backdrop-blur-sm max-w-[380px]">
      <div className="flex items-center gap-2 mb-1.5">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="text-[10px] font-bold text-ops-green hover:text-white w-5"
        >
          {playing ? '⏸' : '▶'}
        </button>
        <span className="text-[10px] font-mono font-bold text-ops-amber">{formatSliderDate(day.date)}</span>
        <span className="text-[8px] text-ops-muted">DAY {dayIndex + 1}</span>
      </div>
      <input
        type="range"
        min={0}
        max={launchData.length - 1}
        value={dayIndex}
        onChange={(e) => { setPlaying(false); setDayIndex(parseInt(e.target.value)); }}
        className="timeline-slider w-full"
      />
      <div className="flex items-center gap-3 mt-1.5 text-[9px] font-mono">
        <span><span className="text-[#ff0040] font-bold">{cumMissiles}</span> <span className="text-ops-muted">missiles</span></span>
        <span><span className="text-[#ff6600] font-bold">{cumDrones}</span> <span className="text-ops-muted">drones</span></span>
        <span><span className="text-[#00ff41] font-bold">{cumIntercepted}</span> <span className="text-ops-muted">int.</span></span>
      </div>
    </div>
  );
}

// ========== Feature 6: Country Stat Card on Hover ==========

function CountryStatCard({ info }) {
  const map = useMap();
  if (!info) return null;

  const { name, latlng } = info;
  const point = map.latLngToContainerPoint(latlng);

  const missiles = countryBreakdown.missiles.find((c) => c.country === name)?.count || 0;
  const drones = countryBreakdown.drones.find((c) => c.country === name)?.count || 0;
  const total = missiles + drones;
  const grandTotal = countryBreakdown.missiles.reduce((s, c) => s + c.count, 0) +
                     countryBreakdown.drones.reduce((s, c) => s + c.count, 0);
  const pct = grandTotal > 0 ? ((total / grandTotal) * 100).toFixed(1) : 0;
  const cc = TARGET_CC[name];

  // Always show card for countries with a known country code

  return (
    <div
      className="absolute z-[1100] bg-ops-panel/95 border border-ops-border rounded px-2.5 py-2 backdrop-blur-sm stat-card-enter pointer-events-none"
      style={{ left: point.x + 16, top: point.y - 60 }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {cc && <img src={`https://flagcdn.com/20x15/${cc}.png`} alt={name} className="w-4 h-3 object-cover rounded-sm" />}
        <span className="text-[10px] font-bold text-ops-text">{name.toUpperCase()}</span>
      </div>
      {name === 'Iran' ? (
        <div className="text-[9px] font-mono">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[#ff0040] font-bold">5,000+</span>
            <span className="text-gray-400">targets struck</span>
          </div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[#ff0040] font-bold">3,000+</span>
            <span className="text-gray-400">military killed</span>
          </div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[#ff6600] font-bold">60+</span>
            <span className="text-gray-400">naval vessels sunk</span>
          </div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[#ff6600] font-bold">40+</span>
            <span className="text-gray-400">leaders killed</span>
          </div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[#ffcc00] font-bold">300+</span>
            <span className="text-gray-400">missile launchers hit</span>
          </div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[#00aaff] font-bold">26/31</span>
            <span className="text-gray-400">provinces hit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ffcc00] font-bold">1,100+</span>
            <span className="text-gray-400">children killed/injured</span>
          </div>
        </div>
      ) : total > 0 ? (
        <>
          <div className="flex items-center gap-3 text-[9px] font-mono">
            <span><span className="text-[#ff0040] font-bold">{missiles}</span> <span className="text-ops-muted">missiles</span></span>
            <span><span className="text-[#ff6600] font-bold">{drones}</span> <span className="text-ops-muted">drones</span></span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex-1 h-1.5 bg-ops-border/30 rounded-full overflow-hidden">
              <div className="h-full bg-ops-red rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[8px] font-mono text-ops-muted">{pct}%</span>
          </div>
        </>
      ) : null}
    </div>
  );
}

// ========== Other existing components ==========

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
            <div key={i} className="px-2 py-1.5 border-b border-ops-border/30 last:border-b-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ev.isStrike ? '#ff0040' : '#ff6600' }} />
                <span className="text-[9px] font-bold truncate" style={{ color: ev.isStrike ? '#ff0040' : '#ff6600' }}>{ev.zoneName}</span>
                <span className="text-[8px] text-ops-muted shrink-0">{ev.timeAgo}</span>
              </div>
              <p className="text-[9px] text-ops-text leading-tight line-clamp-2">{ev.title}</p>
              <span className="text-[7px] font-bold px-1 py-px rounded mt-0.5 inline-block" style={{ background: `${ev.sourceColor || '#6e7681'}22`, color: ev.sourceColor || '#6e7681' }}>
                {ev.source}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FlyToActive({ zones, articles }) {
  const map = useMap();
  const lastFlyRef = useRef(null);

  useEffect(() => {
    if (!articles.length) return;

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

// ========== Hormuz Stats ==========

const HORMUZ_DATA = {
  updated: 'MAR 21, 2026',
  current: {
    transitsPerDay: 3,
    oilFlowMbd: 0.5,
    disruptionPct: 98,
  },
  preWar: {
    transitsPerDay: 153,
    oilFlowMbd: 20,
    globalOilPct: 20,
    globalLngPct: 20,
  },
  crisis: {
    tankersQueued: 150,
    tankersStranded: 300,
    bulkCarriersStranded: 280,
    vesselsAttacked: 23,
    seafarersKilled: 9,
    minesDetected: true,
    minelayersDestroyed: 30,
    insuranceSurge: '+300%',
    tankerRates: '$424K/day',
  },
  disruptions: [
    { country: 'Saudi Arabia', detail: '27 VLCCs to Yanbu' },
    { country: 'Iraq', detail: 'Basra tanker attacked' },
    { country: 'UAE', detail: 'Fujairah bypass active' },
  ],
};

function HormuzStatRow({ label, value, color = '#00aaff', sub }) {
  return (
    <div className="py-1.5 border-b border-ops-border/30">
      <div className="flex items-baseline justify-between gap-1">
        <span className="text-[11px] text-gray-300">{label}</span>
        <span className="text-[13px] font-bold font-mono" style={{ color }}>{value}</span>
      </div>
      {sub && <div className="text-[9px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function HormuzStats() {
  const d = HORMUZ_DATA;
  return (
    <div className="text-ops-text">
      <div className="text-[9px] text-gray-400 tracking-widest mb-1.5 flex items-center justify-between">
        <span>STATUS</span>
        <span className="text-[8px]">{d.updated}</span>
      </div>

      {/* Disruption headline */}
      <div className="bg-ops-red/10 border border-ops-red/30 rounded px-2 py-1.5 mb-2 text-center">
        <div className="text-[20px] font-bold font-mono text-ops-red">{d.current.disruptionPct}%</div>
        <div className="text-[9px] text-ops-red tracking-widest">TRAFFIC DISRUPTION</div>
      </div>

      {/* Current vs Pre-war */}
      <div className="text-[9px] text-gray-400 tracking-widest mb-1">CURRENT</div>
      <HormuzStatRow label="Vessel Transits/Day" value={d.current.transitsPerDay} color="#ff0040" sub={`Pre-war: ${d.preWar.transitsPerDay}/day`} />
      <HormuzStatRow label="Oil Flow" value={`${d.current.oilFlowMbd} mb/d`} color="#ff0040" sub={`Pre-war: ${d.preWar.oilFlowMbd} mb/d`} />
      <HormuzStatRow label="Global Oil via Hormuz" value={`${d.preWar.globalOilPct}%`} sub="of global petroleum trade" />
      <HormuzStatRow label="Global LNG via Hormuz" value={`${d.preWar.globalLngPct}%`} sub="of global LNG trade" />

      {/* Crisis metrics */}
      <div className="text-[9px] text-gray-400 tracking-widest mb-1 mt-2">CRISIS</div>
      <HormuzStatRow label="Tankers Queued Outside" value={`${d.crisis.tankersQueued}+`} color="#ff6600" />
      <HormuzStatRow label="Tankers Stranded Inside" value={`${d.crisis.tankersStranded}+`} color="#ff6600" />
      <HormuzStatRow label="Bulk Carriers Stranded" value={d.crisis.bulkCarriersStranded} color="#ff6600" />
      <HormuzStatRow label="Vessels Attacked" value={d.crisis.vesselsAttacked} color="#ff0040" />
      <HormuzStatRow label="Seafarers Killed" value={d.crisis.seafarersKilled} color="#ff0040" />
      <HormuzStatRow label="Mine Threat" value={d.crisis.minesDetected ? 'ACTIVE' : 'NONE'} color={d.crisis.minesDetected ? '#ff0040' : '#00ff41'} sub={`${d.crisis.minelayersDestroyed} minelayers destroyed`} />
      <HormuzStatRow label="War Risk Insurance" value={d.crisis.insuranceSurge} color="#ff6600" />
      <HormuzStatRow label="Supertanker Rate" value={d.crisis.tankerRates} color="#ffcc00" sub="All-time high" />

      {/* Country disruptions */}
      <div className="text-[9px] text-gray-400 tracking-widest mb-1 mt-2">EXPORT DISRUPTIONS</div>
      {d.disruptions.map((c) => (
        <div key={c.country} className="flex items-center gap-1.5 py-1.5 border-b border-ops-border/30">
          <img src={`https://flagcdn.com/16x12/${c.country === 'Saudi Arabia' ? 'sa' : c.country === 'Iraq' ? 'iq' : 'ae'}.png`} alt="" className="w-3.5 h-3" />
          <span className="text-[11px] font-bold text-gray-200">{c.country}</span>
          <span className="text-[10px] text-gray-400 ml-auto">{c.detail}</span>
        </div>
      ))}

      <p className="text-[8px] text-gray-500 mt-2">Sources: Windward, EIA, Reuters, Anadolu</p>
    </div>
  );
}

// ========== Main MapView ==========

export default function MapView({ articles = [] }) {
  const [dynamicZones, setDynamicZones] = useState([]);

  useEffect(() => {
    let cancelled = false;
    function fetchStrikes() {
      fetch('/strikes.json')
        .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
        .then((data) => {
          if (!cancelled && Array.isArray(data?.zones)) setDynamicZones(data.zones);
        })
        .catch(() => {});
    }
    fetchStrikes();
    const interval = setInterval(fetchStrikes, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const allZones = useMemo(() => {
    const map = new Map();
    for (const z of conflictZones) map.set(z.id, z);
    for (const z of dynamicZones) map.set(z.id, z);
    return Array.from(map.values());
  }, [dynamicZones]);

  const [showRoutes, setShowRoutes] = useState(false);
  const [showHeat, setShowHeat] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showHormuz, setShowHormuz] = useState(false);
  const [showGroundOps, setShowGroundOps] = useState(false);
  const [showRefugees, setShowRefugees] = useState(false);
  const [dayIndex, setDayIndex] = useState(launchData.length - 1);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const [filters, setFilters] = useState({
    countries: new Set(),
    types: new Set(),
    statuses: new Set(),
    liveOnly: false,
  });

  const zoneLiveMap = useMemo(() => {
    const m = new Map();
    for (const zone of allZones) {
      const matched = matchArticles(zone, articles);
      const live = computeLiveStatus(zone, matched);
      m.set(zone.id, { matched, live });
    }
    return m;
  }, [allZones, articles]);

  const countries = useMemo(() => {
    const set = new Set();
    for (const zone of allZones) set.add(getCountry(zone));
    return [...set].sort();
  }, [allZones]);

  // Timeline-aware filtering: when timeline is active, only show zones in countries targeted up to selected day
  const timelineTargets = useMemo(() => {
    if (!showTimeline) return null;
    const targets = new Set(['Iran']); // Always show Iran (attacker)
    for (let i = 0; i <= dayIndex; i++) {
      for (const t of launchData[i].targets) targets.add(t);
    }
    return targets;
  }, [showTimeline, dayIndex]);

  const filteredZones = useMemo(() => {
    const { countries: fc, types, statuses, liveOnly } = filters;

    return allZones.filter((zone) => {
      // Timeline filter
      if (timelineTargets) {
        const country = getCountry(zone);
        if (!timelineTargets.has(country)) return false;
      }
      if (fc.size && !fc.has(getCountry(zone))) return false;
      if (types.size && !types.has(zone.type)) return false;
      const ld = zoneLiveMap.get(zone.id);
      if (statuses.size && ld && !statuses.has(ld.live.status)) return false;
      if (liveOnly && (!ld || ld.matched.length === 0)) return false;
      return true;
    });
  }, [allZones, filters, zoneLiveMap, timelineTargets]);

  const liveEvents = useMemo(() => {
    const events = [];
    const sixHoursAgo = Date.now() - 6 * 3600 * 1000;

    for (const zone of filteredZones) {
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

    const seen = new Set();
    const deduped = events.filter((e) => {
      const key = e.title?.slice(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return deduped.sort((a, b) => b.pubTime - a.pubTime).slice(0, 15);
  }, [articles, filteredZones]);

  return (
    <div className="w-full h-full flex">
    {/* Map section */}
    <div className={`relative ${showHormuz ? 'flex-[5]' : 'flex-1'} min-w-0 h-full`}>
      {/* Panel label */}
      <div className="absolute top-2 right-3 z-[1000] flex items-center gap-2">
        <span className="text-ops-green text-[10px] font-bold tracking-widest uppercase bg-ops-panel/90 px-2 py-1 border border-ops-border rounded backdrop-blur-sm">
          TACTICAL MAP — MIDDLE EAST THEATER
        </span>
      </div>

      {/* Map filters */}
      <MapFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        countries={countries}
        showRoutes={showRoutes}
        onToggleRoutes={() => setShowRoutes((v) => !v)}
        showHeat={showHeat}
        onToggleHeat={() => setShowHeat((v) => !v)}
        showBoundaries={showBoundaries}
        onToggleBoundaries={() => setShowBoundaries((v) => !v)}
        showTimeline={showTimeline}
        onToggleTimeline={() => setShowTimeline((v) => !v)}
        showHormuz={showHormuz}
        onToggleHormuz={() => setShowHormuz((v) => !v)}
        showGroundOps={showGroundOps}
        onToggleGroundOps={() => setShowGroundOps((v) => !v)}
        showRefugees={showRefugees}
        onToggleRefugees={() => setShowRefugees((v) => !v)}
        onClearAll={() => {
          setFilters({ countries: new Set(), types: new Set(), statuses: new Set(), liveOnly: false });
          setShowRoutes(false);
          setShowHeat(false);
          setShowBoundaries(false);
          setShowTimeline(false);
          setShowHormuz(false);
          setShowGroundOps(false);
          setShowRefugees(false);
        }}
      />

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

      {/* Timeline slider */}
      {showTimeline && <TimelineSlider dayIndex={dayIndex} setDayIndex={setDayIndex} />}

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

        <FlyToActive zones={filteredZones} articles={articles} />

        {/* Feature 4: Country boundaries */}
        {showBoundaries && <CountryBoundaries onHover={setHoveredCountry} />}

        {/* Feature 1: Heat map */}
        {showHeat && <HeatLayer zones={filteredZones} zoneLiveMap={zoneLiveMap} />}

        {/* Feature 2: Animated attack routes */}
        {showRoutes && <AnimatedAttackLines />}

        {/* Ground Operations Layer */}
        {showGroundOps && (
          <>
            <Polyline
              positions={groundOps.frontline}
              pathOptions={{ color: '#d4a017', weight: 3, dashArray: '8,6', opacity: 0.9 }}
            >
              <Tooltip sticky>FRONTLINE</Tooltip>
            </Polyline>
            {/* Invisible wide polyline for easy hover */}
            <Polyline
              positions={groundOps.objectiveLine}
              pathOptions={{ color: 'transparent', weight: 16, opacity: 0 }}
            >
              <Tooltip sticky>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold', color: '#00ff41' }}>
                  LITANI RIVER — OBJECTIVE LINE
                </span>
              </Tooltip>
            </Polyline>
            {/* Visible thin line */}
            <Polyline
              positions={groundOps.objectiveLine}
              pathOptions={{ color: '#00ff41', weight: 2, dashArray: '6,4', opacity: 0.8 }}
            >
              <Tooltip permanent direction="top" offset={[0, -8]} className="litani-label">
                <span style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 'bold', color: '#00ff41', background: 'rgba(5,10,14,0.8)', padding: '2px 6px', borderRadius: '3px', border: '1px solid #00ff4144' }}>
                  LITANI RIVER
                </span>
              </Tooltip>
            </Polyline>
            {groundOps.divisions.map((div) => (
              <Marker
                key={div.name}
                position={[div.lat, div.lng]}
                icon={L.divIcon({
                  className: '',
                  html: `<svg width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#d4a01733" stroke="#d4a017" stroke-width="1.5"/>
                    <line x1="12" y1="2" x2="12" y2="22" stroke="#d4a017" stroke-width="1.2"/>
                    <line x1="2" y1="12" x2="22" y2="12" stroke="#d4a017" stroke-width="1.2"/>
                    <circle cx="12" cy="12" r="3" fill="#d4a017" opacity="0.6"/>
                  </svg>`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12],
                })}
              >
                <Tooltip>
                  <div style={{ fontFamily: 'monospace', fontSize: '10px' }}>
                    <div style={{ color: '#d4a017', fontWeight: 'bold' }}>{div.name}</div>
                    <div>Strength: {div.strength}</div>
                    <div>Sector: {div.sector}</div>
                    <div>Objective: {div.objective}</div>
                    <div>Status: <span style={{ color: div.status === 'advancing' ? '#00ff41' : '#ff6600' }}>{div.status.toUpperCase()}</span></div>
                  </div>
                </Tooltip>
              </Marker>
            ))}
            {groundOps.operations.map((op, i) => (
              <CircleMarker
                key={`groundop-${i}`}
                center={[op.lat, op.lng]}
                radius={5}
                pathOptions={{ color: op.type === 'engagement' ? '#ff0040' : '#d4a017', fillColor: op.type === 'engagement' ? '#ff0040' : '#d4a017', fillOpacity: 0.7, weight: 1 }}
              >
                <Popup>
                  <div style={{ fontFamily: 'monospace', fontSize: '10px' }}>
                    <div style={{ fontWeight: 'bold', color: '#d4a017' }}>{op.date}</div>
                    <div>{op.event}</div>
                    <div style={{ color: '#888', fontSize: '9px' }}>Type: {op.type}</div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </>
        )}

        {/* Refugee Displacement Layer */}
        {showRefugees && (
          <>
            {displacementData.countries.map((c) => (
              <CircleMarker
                key={`refugee-${c.country}`}
                center={[c.lat, c.lng]}
                radius={Math.log10(c.displaced) * 8}
                pathOptions={{ color: '#0088cc', fillColor: '#0088cc', fillOpacity: 0.3, weight: 1.5 }}
              >
                <Tooltip>
                  <div style={{ fontFamily: 'monospace', fontSize: '10px' }}>
                    <div style={{ color: '#0088cc', fontWeight: 'bold' }}>{c.country}</div>
                    <div>Displaced: {c.displaced.toLocaleString()}</div>
                    <div style={{ fontSize: '9px', color: '#888' }}>{c.detail}</div>
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
            {displacementData.countries.flatMap((c) =>
              c.flows.map((flow, i) => (
                <Polyline
                  key={`flow-${c.country}-${i}`}
                  positions={[[c.lat, c.lng], [flow.toLat, flow.toLng]]}
                  pathOptions={{
                    color: '#0088cc',
                    weight: Math.max(1, Math.log10(flow.count) * 1.5),
                    dashArray: '4,8',
                    opacity: 0.6,
                    className: 'refugee-flow-line',
                  }}
                >
                  <Tooltip sticky>
                    <span style={{ fontFamily: 'monospace', fontSize: '9px' }}>
                      {c.country} → {flow.to}: {flow.count.toLocaleString()}
                    </span>
                  </Tooltip>
                </Polyline>
              ))
            )}
          </>
        )}

        {/* Feature 3: Clustered markers */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={(zoom) => zoom <= 5 ? 120 : zoom <= 6 ? 80 : 40}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
          iconCreateFunction={createClusterIcon}
          disableClusteringAtZoom={8}
        >
          {filteredZones.map((zone) => (
            <ClickMarker key={zone.id} zone={zone} articles={articles} />
          ))}
        </MarkerClusterGroup>

        {/* Feature 6: Stat card */}
        <CountryStatCard info={hoveredCountry} />
      </MapContainer>
    </div>

    {/* Strait of Hormuz side panel — ~45% of map width */}
    {showHormuz && (
      <div className="flex-[4] min-w-0 h-full border-l border-ops-border flex flex-col bg-ops-panel">
        <div className="flex items-center justify-between px-2 py-1 border-b border-ops-border">
          <span className="text-[9px] font-bold tracking-widest text-[#00aaff]">STRAIT OF HORMUZ</span>
          <button onClick={() => setShowHormuz(false)} className="text-ops-muted hover:text-ops-text text-xs px-1">✕</button>
        </div>
        <div className="flex flex-1 min-h-0">
          {/* Live traffic embed */}
          <div className="flex-[6] min-w-0 h-full">
            <iframe
              src="https://www.marinetraffic.com/en/ais/embed/zoom:8/centery:26.5/centerx:56.2/maptype:0/shownames:true"
              className="w-full h-full"
              style={{ border: 0, display: 'block' }}
              title="Strait of Hormuz Live Traffic"
              loading="lazy"
            />
          </div>
          {/* Stats panel */}
          <div className="flex-[4] min-w-0 h-full border-l border-ops-border overflow-y-auto px-2 py-2">
            <HormuzStats />
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

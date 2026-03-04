# Iran Conflict News Dashboard — Technical Documentation

## Overview

Full-screen real-time news dashboard with a military operations center (ops-center) theme. Displays an interactive Leaflet map, live news feeds, YouTube streams, casualty treemap, and financial market indicators focused on the Iran conflict (Feb-Mar 2026).

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18/19 | UI framework |
| Vite | 7.x | Bundler + dev server + proxy |
| Tailwind CSS | 3.x | Styling (dark military theme) |
| React-Leaflet | 5.x | Interactive map |
| Leaflet | 1.9.x | Map engine |

No additional runtime dependencies. All charts (sparklines, treemap) are pure SVG/CSS.

---

## Project Structure

```
news-dashboard/
├── public/
│   ├── casualties.json          # Casualty data by country (auto-generated)
│   ├── markets.json             # Market prices (auto-generated)
│   └── strikes.json             # Dynamic strike zones (auto-generated)
├── scripts/
│   ├── update-casualties.js     # Scrapes casualty numbers from news sites
│   ├── update-markets.js        # Fetches market data (CoinGecko, seed)
│   └── update-strikes.js        # Template for dynamic strike zone generation
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx        # Main layout orchestrator
│   │   ├── Header.jsx           # Title bar, UTC/Tehran/Riyadh/Local clocks
│   │   ├── MapView.jsx          # Leaflet map with conflict zone markers
│   │   ├── MapMarkerPopup.jsx   # Popup content for map markers
│   │   ├── ConflictTimeline.jsx # Chronological event feed
│   │   ├── ImpactTracker.jsx    # Casualties treemap visualization
│   │   ├── MarketImpact.jsx     # Market data with sparkline charts
│   │   ├── LiveStreams.jsx      # 4 YouTube live stream embeds
│   │   ├── BreakingNews.jsx     # Breaking news ticker bar
│   │   ├── TwitterFeed.jsx      # X/Twitter embedded timelines
│   │   ├── TelegramFeed.jsx     # Telegram channel links
│   │   └── NewsHeadlines.jsx    # EN/AR news list (legacy, unused)
│   ├── hooks/
│   │   ├── useNews.js           # Multi-source news fetching + caching
│   │   └── useInterval.js       # Ref-based interval hook
│   ├── utils/
│   │   └── rssParser.js         # RSS feed parsing (EN + AR)
│   ├── data/
│   │   └── conflictZones.js     # 146 static conflict zone definitions
│   ├── App.jsx                  # Root component (renders Dashboard)
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles + animations
├── vite.config.js               # Vite config with RSS/API proxies
├── tailwind.config.js           # Custom ops-center color palette
├── package.json
├── missile.svg                  # Custom missile marker icon (red)
└── CLAUDE.md                    # AI assistant instructions
```

---

## Commands

```bash
npm run dev              # Start dev server (localhost:5173)
npm run build            # Production build → dist/
npm run preview          # Preview production build
npm run update-casualties  # Scrape casualty data → public/casualties.json
npm run update-markets     # Fetch market data → public/markets.json
npm run update-strikes     # Generate strike zones → public/strikes.json
```

---

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER — Title, LIVE indicator, UTC/Tehran/Riyadh/Local    │
├─────────────────────────────────────────────────────────────┤
│  BREAKING NEWS — Scrolling ticker (dismissible alerts)      │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│    TACTICAL MAP          │      LIVE STREAMS                │
│    (Leaflet + markers)   │      (2x2 YouTube iframes)      │
│                          │                                  │
├────────────┬─────────────┼──────────────────────────────────┤
│  CONFLICT  │ CASUALTIES  │                                  │
│  TIMELINE  │ (Treemap)   │     MARKET IMPACT               │
│  (events)  │             │     (8 symbols + sparklines)     │
└────────────┴─────────────┴──────────────────────────────────┘
```

Implemented in `Dashboard.jsx` as:
- Flex column: Header → BreakingNews → 2-row grid
- Top row: `grid-cols-2` → MapView | LiveStreams
- Bottom row: `grid-cols-[1fr_1fr_2fr]` → Timeline | Casualties | Markets

---

## Components

### Dashboard.jsx
Main orchestrator. Calls `useAllNews()` to get combined articles, passes them to MapView, BreakingNews, and ConflictTimeline. Renders the full-screen grid layout with a CRT scanline overlay effect.

### Header.jsx
Top bar with "IRAN CONFLICT DASHBOARD" title, pulsing red LIVE indicator, and 4 timezone clocks (UTC, Tehran +3:30, Riyadh +3, Local). Updates every second.

### MapView.jsx (complex)
Interactive Leaflet map centered on the Middle East (lat 28, lng 49, zoom 5). Uses CartoDB Dark Matter tiles.

**Key features:**
- **146 static zones** from `conflictZones.js` + dynamic zones from `strikes.json`
- **8 SVG icon types**: missile (red), nuclear, military, naval, airbase, oil, shipping, diplomatic
- **Dynamic status**: zones upgrade to high-alert/active based on matched article recency
- **Live Event Feed**: top-right overlay showing recent article-zone matches (last 6h)
- **Auto fly-to**: pans to zones with strike articles < 10 minutes old
- **Article badges**: count badges on markers with matched articles
- **Flash animations**: pulsing rings on high-alert zones, flash effect on recent strikes

**Data flow:**
1. Receives `articles` prop from Dashboard
2. Fetches `/strikes.json` every 5 minutes → merges with static zones
3. For each zone, matches articles by keywords (title + description)
4. Computes live status: `< 1h → high-alert`, `< 6h → active`
5. Renders markers with appropriate icons, badges, animations

### MapMarkerPopup.jsx
Popup content shown when clicking a map marker. Displays zone name (colored by type), type badge, description, status indicator, and up to 8 matched news articles with source badges and time-ago labels.

### ConflictTimeline.jsx
Vertical timeline of the first 30 articles. Each article is classified by event type (strike, missile, diplomacy, military, naval, humanitarian, nuclear, general) using keyword matching in English + Arabic. Shows colored dots, type badges, source labels, and clickable links.

### ImpactTracker.jsx (complex)
Squarified treemap visualization of casualties by 12 countries (Iran, Israel, USA, Lebanon, Yemen, Iraq, UAE, Kuwait, Bahrain, Qatar, Syria, Palestine).

**Algorithm:** Pure JS squarified treemap — recursively partitions rectangles to minimize worst aspect ratio. Uses ResizeObserver for responsive sizing.

**Data:** Fetches `/casualties.json` on mount, falls back to hardcoded DEFAULT_CASUALTIES. Shows killed (red) and wounded (orange) counts.

**Rendering:** Three cell size tiers — tiny (name + total), small (name + killed/wounded), normal (full labels with KILLED/WOUNDED headers).

### MarketImpact.jsx
2x4 grid of 8 financial market indicators with SVG sparkline charts.

**Symbols:** S&P 500 (ES=F), Nasdaq (NQ=F), Dow Jones (YM=F), Nikkei 225 (^N225), Brent Oil (BZ=F), Bitcoin (BTC-USD), Gold (GC=F), Silver (SI=F).

**Data flow:** Fetches from Yahoo Finance (`/api/yahoo` proxy) every 60 seconds using `Promise.allSettled`. Extracts 1-day 5-minute candle data for sparklines. Falls back to hardcoded seed data.

**Sparklines:** SVG polyline with linear gradient fill (green if up, red if down).

### LiveStreams.jsx
2x2 grid of YouTube iframe embeds. Streams: Al Jazeera Arabic, Sky News, France 24, DW News. Supports focus mode (click to expand single stream).

### BreakingNews.jsx
Horizontal scrolling ticker bar between Header and main grid. Filters articles by breaking-news keywords (English + Arabic: "breaking", "عاجل", "urgent", "killed", "strike", etc.). Deduplicates by title prefix, max 10 alerts. Dismissible individually or all at once.

### TwitterFeed.jsx
Tabbed X/Twitter feed with 4 sources (AJEnglish, Reuters, BBCWorld, AP). Falls back to direct X.com links when embeds are blocked.

---

## Data Pipeline

### News Articles
```
GNews API (optional) ─┐
                      ├─→ useAllNews() hook ─→ Dashboard ─→ MapView, Timeline, BreakingNews
RSS Feeds (4 EN) ─────┘                                         │
                                                    articles matched to zones
                                                    by keyword search
```

**RSS Feeds (proxied via Vite dev server):**
| Feed | Proxy Path | Source URL |
|---|---|---|
| BBC Middle East | `/rss/bbc` | `feeds.bbci.co.uk/news/world/middle_east/rss.xml` |
| Al Jazeera EN | `/rss/aljazeera` | `aljazeera.com/xml/rss/all.xml` |
| Reuters | `/rss/reuters` | `news.google.com/rss/search?q=iran+war` |
| AP News | `/rss/ap` | Via RSSHub |

**Arabic Feeds** (filtered by Iran-related keywords):
| Feed | Proxy Path |
|---|---|
| Al Jazeera Arabic | `/rss/aljazeera-ar` |
| BBC Arabic | `/rss/bbc-ar` |
| Sky News Arabic | `/rss/skynews-ar` |

### Conflict Zones
```
conflictZones.js (146 static) ─┐
                               ├─→ MapView (merged by id) ─→ Map markers
strikes.json (dynamic)  ───────┘
```

**Zone schema:**
```js
{
  id: 1,                    // unique identifier (1-146 static, 2000+ dynamic)
  name: 'Tehran',
  lat: 35.6892,
  lng: 51.389,
  type: 'strike',           // strike | military | naval | nuclear | oil | strategic | diplomatic
  icon: 'missile',          // missile | military | naval | nuclear | oil | shipping | airbase | diplomatic
  description: 'What happened here',
  status: 'high-alert',     // high-alert | active | monitoring
  keywords: ['tehran', 'طهران', 'iran capital'],  // for matching articles
}
```

Dynamic zones from `strikes.json` override static zones with the same `id`, or add new zones with new ids. MapView fetches `strikes.json` every 5 minutes.

### Casualties
```
update-casualties.js ─→ public/casualties.json ─→ ImpactTracker (on mount)
```
Schema: `{ casualties: { iran: { killed: N, wounded: N }, ... }, updatedAt, source }`

### Markets
```
Yahoo Finance API ─→ MarketImpact (every 60s, via /api/yahoo proxy)
update-markets.js ─→ public/markets.json (fallback seed data)
```

---

## Article-to-Zone Matching

MapView matches articles to zones using keyword substring search:

```js
function matchArticles(zone, articles) {
  // For each article, check if title or description
  // contains any of the zone's keywords (case-insensitive)
  return articles.filter(a => {
    const text = `${a.title} ${a.description}`.toLowerCase();
    return zone.keywords.some(kw => text.includes(kw.toLowerCase()));
  }).slice(0, 8);
}
```

**Live status computation** based on article recency:
- `< 1 hour` → **high-alert** (red pulsing marker)
- `< 6 hours` → **active** (orange marker)
- `< 24 hours with 2+ articles` → **active**
- Strike article `< 30 minutes` → **flash animation**

---

## Vite Proxy Configuration

All external API calls are proxied through Vite's dev server to avoid CORS issues:

```js
// vite.config.js proxy entries
'/api/yahoo'      → 'https://query1.finance.yahoo.com'
'/rss/bbc'        → 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml'
'/rss/aljazeera'  → 'https://www.aljazeera.com/xml/rss/all.xml'
'/rss/reuters'    → 'https://news.google.com/rss/search?q=iran+war'
'/rss/ap'         → RSSHub AP News feed
'/rss/bbc-ar'     → BBC Arabic RSS
'/rss/aljazeera-ar' → Al Jazeera Arabic RSS
'/rss/skynews-ar' → Sky News Arabic RSS
```

**Production note:** These proxies only work in dev mode. For production deployment, you need a backend proxy or CORS-enabled API endpoints.

---

## Styling

### Color Palette (tailwind.config.js)

| Token | Hex | Usage |
|---|---|---|
| `ops-bg` | `#050a0e` | Page background |
| `ops-panel` | `#0d1117` | Panel backgrounds |
| `ops-border` | `#1b3a2a` | Panel borders (dark green) |
| `ops-green` | `#00ff41` | Accent, status indicators |
| `ops-amber` | `#ff6600` | Warnings, active status |
| `ops-red` | `#ff0040` | Alerts, high-alert, killed counts |
| `ops-text` | `#c9d1d9` | Primary text |
| `ops-muted` | `#6e7681` | Secondary text |

### Fonts
- **Monospace:** JetBrains Mono, Fira Code (for data, numbers)
- **Display:** system-ui, sans-serif

### Animations (index.css)
- `pulse_marker` — Map marker scale pulse (2s)
- `glow` — Box-shadow breathing (2s)
- `scanline` — CRT scanline sweep (8s)
- `map-flash` — Strike zone flash (0.8s)
- `live-pulse` — Live indicator pulse (1.5s)
- `ticker-scroll` — Breaking news horizontal scroll (30s)

---

## Map Marker Icons

8 SVG icon types rendered inline in the map markers:

| Icon | Color | Used For |
|---|---|---|
| `missile` | Red `#ff0040` | Strike zones (custom missile.svg design) |
| `military` | Orange `#ff6600` | Military bases, crosshair design |
| `nuclear` | Orange `#ff6600` | Nuclear facilities, ☢ symbol |
| `naval` | Blue `#00aaff` | Naval bases and ports |
| `airbase` | Orange `#ff6600` | Air bases, airplane silhouette |
| `oil` | Yellow `#ffcc00` | Oil/energy infrastructure |
| `shipping` | Blue `#00aaff` | Shipping lanes, wave pattern |
| `diplomatic` | Green `#00ff41` | Diplomatic sites |

Markers scale from 26px to 36px based on article count. High-alert zones get pulsing rings, strike zones with recent articles get flash animations.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GNEWS_API_KEY` | No | GNews API key for additional news data. RSS feeds work without it. |

---

## Adding/Modifying Content

### Add a new conflict zone
Edit `src/data/conflictZones.js` — add an object to the array with a unique `id` (use next available number). Include coordinates, type, icon, description, status, and keywords for article matching.

### Add a dynamic zone (no code change)
Edit `public/strikes.json` — add a zone object to the `zones` array with `id` in the 2000+ range. MapView fetches this file every 5 minutes.

### Add a new market symbol
Edit `src/components/MarketImpact.jsx` — add an entry to the `SYMBOLS` array with Yahoo Finance ticker symbol. Add corresponding seed data to `SEED` object.

### Update live streams
Edit `src/components/LiveStreams.jsx` — update `videoId` values in the `STREAMS` array.

### Add a new RSS feed
Edit `src/utils/rssParser.js` — add an entry to `EN_FEEDS` or `AR_FEEDS` array with name, proxy URL, and color. Add corresponding proxy route in `vite.config.js`.

### Modify breaking news keywords
Edit `src/components/BreakingNews.jsx` — update the `BREAKING_KEYWORDS` array.

---

## Architecture Decisions

1. **No external charting library** — Sparklines and treemaps are pure SVG/CSS to minimize bundle size
2. **RSS proxy via Vite** — Avoids CORS issues without a separate backend
3. **Static + dynamic zone merge** — `conflictZones.js` for base data, `strikes.json` for runtime updates
4. **Keyword-based article matching** — Simple substring matching with bilingual keywords (English + Arabic)
5. **Fallback-first data loading** — All components have hardcoded defaults; external data enhances but isn't required
6. **No state management library** — React hooks + prop drilling is sufficient for this single-page dashboard

# Iran Conflict News Dashboard

## Overview
Full-screen real-time news dashboard with military ops-center theme. Displays interactive map, live news, social feeds, market data, casualty tracking, and video streams focused on the Iran conflict.

## Tech Stack
- React 18 + Vite
- Tailwind CSS v3 (dark military theme)
- React-Leaflet (Leaflet.js) for maps with animated attack route lines
- GNews API + RSS feeds (BBC, Al Jazeera, Al Arabiya, RT, France24) for news
- YouTube iframe embeds for live streams
- X/Twitter embedded timelines
- Yahoo Finance API for market data (via Vite proxy)
- Wikipedia API for automated casualty scraping
- GitHub Actions for scheduled data updates

## Commands
- `npm run dev` — Start dev server (localhost:5173)
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `node scripts/update-casualties.mjs` — Manually scrape & update casualty data

## Environment Variables
- `VITE_GNEWS_API_KEY` — GNews API key for live news data (optional, RSS feeds work without it)

## Architecture

### Components
- `src/components/Dashboard.jsx` — Main CSS Grid layout with resizable panels, news/timeline tabs, threat level computation, oil price fetch
- `src/components/Header.jsx` — Title bar, threat level badge, oil price indicator, multi-timezone clocks
- `src/components/MapView.jsx` — Leaflet map with conflict zone markers, animated attack route arcs (Polyline + Bezier curves)
- `src/components/MapFilterBar.jsx` — Map filters: country, type, status, live-only, attack routes toggle
- `src/components/NewsHeadlines.jsx` — EN/AR tabbed news panel ("LATEST ARTICLES")
- `src/components/ConflictTimeline.jsx` — EN/AR conflict timeline
- `src/components/BreakingNews.jsx` — Breaking news ticker with audio alerts (Web Audio API sine-wave chime), mute toggle, visual flash effect
- `src/components/ImpactTracker.jsx` — Horizontal bar chart of casualties by country (sorted descending), flags via flagcdn.com
- `src/components/MarketImpact.jsx` — Live market tickers (Yahoo Finance) + economic impact data (US, Israel, Iran, GCC costs)
- `src/components/LiveStreams.jsx` — YouTube live stream embeds
- `src/components/TwitterFeed.jsx` — Embedded X timeline widget

### Hooks
- `src/hooks/useNews.js` — News data fetching + caching (useEnglishNews, useArabicNews)
- `src/hooks/useInterval.js` — Auto-refresh timer
- `src/hooks/useResizable.js` — Draggable panel resize dividers (useResizableGrid), desktop only

### Data
- `src/data/conflictZones.js` — Curated conflict zone coordinates + keyword matching
- `src/data/attackRoutes.js` — 12 attack route corridors (Iran, Israel, USA, Houthi) with Bezier arc rendering

### Scripts & Automation
- `scripts/update-casualties.mjs` — Scrapes Wikipedia "2026 Iran war" casualties-by-country table, updates both `public/casualties.json` and `DEFAULT_CASUALTIES` in `ImpactTracker.jsx`
- `.github/workflows/update-casualties.yml` — Runs scraper every 6 hours + manual trigger, auto-commits changes

## Map Tiles
Uses CartoDB Dark Matter tiles (free, no API key). Fallback: OpenStreetMap.

## RSS Proxy
Vite dev server proxies RSS feeds to avoid CORS:
- `/rss/bbc` → BBC Middle East RSS
- `/rss/bbc-ar` → BBC Arabic RSS
- `/rss/aljazeera` → Al Jazeera English RSS
- `/rss/aljazeera-ar` → Al Jazeera Arabic RSS
- `/rss/skynews-ar` → Sky News Arabia RSS
- `/rss/alarabiya-ar` → Al Arabiya Arabic RSS
- `/rss/rt-ar` → RT Arabic RSS
- `/rss/google-ar` → Google News Arabic (Iran war)
- `/rss/france24-ar` → France 24 Arabic RSS
- `/rss/ap` → Google News (Iran conflict, English)
- `/rss/reuters` → Google News (Iran war strikes, English)
- `/api/yahoo` → Yahoo Finance API (market data)

## Deployment
- Hosted on Vercel (auto-deploys from `main` branch)
- Casualty data is hardcoded in `ImpactTracker.jsx` (no runtime fetch) to avoid Vercel CDN caching stale data
- GitHub Action updates the hardcoded values and commits, triggering Vercel redeploy

## Live Streams
YouTube video IDs in `LiveStreams.jsx`. Update if streams go offline.

## Key Design Decisions
- Casualties use hardcoded defaults (not runtime fetch) because Vercel CDN caches static JSON aggressively
- Flag emoji replaced with flagcdn.com images for cross-platform support (Windows doesn't render flag emoji)
- Breaking news audio uses Web Audio API (sine-wave chime, no audio files needed)
- Attack routes use quadratic Bezier curves for arc effect with CSS dash-flow animation
- Panel resize disabled on mobile (<1024px), falls back to responsive Tailwind grid

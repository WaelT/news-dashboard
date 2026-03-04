# Iran Conflict News Dashboard

## Overview
Full-screen real-time news dashboard with military ops-center theme. Displays interactive map, live news, social feeds, and video streams focused on the Iran conflict.

## Tech Stack
- React 18 + Vite
- Tailwind CSS v3 (dark military theme)
- React-Leaflet (Leaflet.js) for maps
- GNews API + RSS feeds (BBC, Al Jazeera) for news
- YouTube iframe embeds for live streams
- X/Twitter embedded timelines

## Commands
- `npm run dev` — Start dev server (localhost:5173)
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Environment Variables
- `VITE_GNEWS_API_KEY` — GNews API key for live news data (optional, RSS feeds work without it)

## Architecture
- `src/components/Dashboard.jsx` — Main CSS Grid layout
- `src/components/Header.jsx` — Title bar, UTC clock, live indicator
- `src/components/MapView.jsx` — Leaflet map with conflict zone markers
- `src/components/NewsHeadlines.jsx` — Scrolling news from GNews + RSS
- `src/components/TwitterFeed.jsx` — Embedded X timeline widget
- `src/components/LiveStreams.jsx` — 4 YouTube live stream embeds
- `src/hooks/useNews.js` — News data fetching + caching
- `src/hooks/useInterval.js` — Auto-refresh timer
- `src/data/conflictZones.js` — Curated conflict zone coordinates
- `src/utils/rssParser.js` — RSS feed parsing

## Map Tiles
Uses CartoDB Dark Matter tiles (free, no API key). Fallback: OpenStreetMap.

## RSS Proxy
Vite dev server proxies RSS feeds to avoid CORS:
- `/rss/bbc` → BBC Middle East RSS
- `/rss/aljazeera` → Al Jazeera RSS

## Live Streams
YouTube video IDs in `LiveStreams.jsx`. Update if streams go offline.

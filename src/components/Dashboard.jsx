import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Header from './Header';
import MapView from './MapView';
import ConflictTimeline from './ConflictTimeline';
import DiplomaticTimeline from './DiplomaticTimeline';
import ImpactTracker from './ImpactTracker';
import MarketImpact from './MarketImpact';
import MissileDroneTracker from './MissileDroneTracker';
import MobileNav, { TAB_IDS } from './MobileNav';

import LiveStreams from './LiveStreams';
import BreakingNews from './BreakingNews';
import { useEnglishNews, useArabicNews, useBreakingNews } from '../hooks/useNews';
import conflictZones from '../data/conflictZones';
import { useResizableGrid } from '../hooks/useResizable';
import useSwipe from '../hooks/useSwipe';

const BREAKING_KEYWORDS = [
  'breaking', 'عاجل', 'urgent', 'just in', 'developing',
  'killed', 'strike', 'attack', 'explosion', 'missile',
];

function matchArticlesToZone(zone, articles) {
  if (!zone.keywords || !articles.length) return [];
  const kw = zone.keywords.map((k) => k.toLowerCase());
  return articles.filter((a) => {
    const text = `${a.title || ''} ${a.description || ''}`.toLowerCase();
    return kw.some((k) => text.includes(k));
  });
}

function getThreatLevel(activeZoneCount, breakingCount) {
  const score = activeZoneCount + breakingCount * 2;
  if (score >= 20) return { label: 'CRITICAL', color: '#ff0040' };
  if (score >= 10) return { label: 'SEVERE', color: '#ff6600' };
  if (score >= 4) return { label: 'ELEVATED', color: '#d4a017' };
  return { label: 'GUARDED', color: '#00ff41' };
}

const TOP_INIT = [0.5, 0.5];
const BOTTOM_INIT = [0.25, 0.25, 0.25, 0.25];

function TimelineTabs({ enArticles, arArticles }) {
  const [tab, setTab] = useState('en');
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center border-b border-ops-border">
        <span className="px-3 text-ops-amber text-[10px] font-bold tracking-widest">TIMELINE</span>
        <div className="flex ml-auto">
          <button
            onClick={() => setTab('en')}
            className={`px-2 py-1.5 text-[10px] font-bold tracking-widest transition-colors ${tab === 'en' ? 'text-ops-amber border-b-2 border-ops-amber' : 'text-ops-muted hover:text-ops-text'}`}
          >
            EN
          </button>
          <button
            onClick={() => setTab('ar')}
            className={`px-2 py-1.5 text-[10px] font-bold tracking-widest transition-colors ${tab === 'ar' ? 'text-ops-amber border-b-2 border-ops-amber' : 'text-ops-muted hover:text-ops-text'}`}
          >
            AR
          </button>
          <button
            onClick={() => setTab('diplo')}
            className={`px-2 py-1.5 text-[10px] font-bold tracking-widest transition-colors ${tab === 'diplo' ? 'text-ops-amber border-b-2 border-ops-amber' : 'text-ops-muted hover:text-ops-text'}`}
          >
            DIPLO
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === 'diplo' ? <DiplomaticTimeline /> : <ConflictTimeline articles={tab === 'en' ? enArticles : arArticles} />}
      </div>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false,
  );
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 1024);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

function MobilePanel({ activeTab, articles, enArticles, arArticles }) {
  switch (activeTab) {
    case 'map':
      return (
        <div className="bg-ops-panel flex-1 min-h-0">
          <MapView articles={articles} />
        </div>
      );
    case 'news':
      return (
        <div className="bg-ops-panel flex-1 min-h-0 overflow-hidden">
          <TimelineTabs enArticles={enArticles} arArticles={arArticles} />
        </div>
      );
    case 'stats':
      return (
        <div className="flex-1 min-h-0 flex flex-col gap-px overflow-y-auto">
          <div className="bg-ops-panel min-h-[50vh]">
            <MissileDroneTracker />
          </div>
          <div className="bg-ops-panel min-h-[50vh]">
            <ImpactTracker />
          </div>
        </div>
      );
    case 'markets':
      return (
        <div className="bg-ops-panel flex-1 min-h-0 overflow-hidden">
          <MarketImpact />
        </div>
      );
    case 'live':
      return (
        <div className="bg-ops-panel flex-1 min-h-0">
          <LiveStreams />
        </div>
      );
    default:
      return null;
  }
}

export default function Dashboard() {
  const en = useEnglishNews();
  const ar = useArabicNews();
  const breakingArticles = useBreakingNews();
  const articles = useMemo(
    () => [...en.articles, ...ar.articles].sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0)),
    [en.articles, ar.articles],
  );
  const [oilPrice, setOilPrice] = useState(null);
  const [mobileTab, setMobileTab] = useState('map');
  const isMobile = useIsMobile();
  const swipeRef = useRef(null);
  const { direction, reset } = useSwipe(swipeRef);

  const topResize = useResizableGrid(TOP_INIT);
  const bottomResize = useResizableGrid(BOTTOM_INIT);

  // Handle swipe navigation
  useEffect(() => {
    if (!direction || !isMobile) return;
    const idx = TAB_IDS.indexOf(mobileTab);
    if (direction === 'left' && idx < TAB_IDS.length - 1) {
      setMobileTab(TAB_IDS[idx + 1]);
    } else if (direction === 'right' && idx > 0) {
      setMobileTab(TAB_IDS[idx - 1]);
    }
    reset();
  }, [direction, isMobile, mobileTab, reset]);

  // Compute active zone count
  const activeZoneCount = useMemo(() => {
    let count = 0;
    for (const zone of conflictZones) {
      if (matchArticlesToZone(zone, articles).length > 0) count++;
    }
    return count;
  }, [articles]);

  // Count breaking articles
  const breakingCount = useMemo(() => {
    return articles.filter((a) => {
      const title = (a.title || '').toLowerCase();
      return BREAKING_KEYWORDS.some((kw) => title.includes(kw));
    }).length;
  }, [articles]);

  const threatLevel = useMemo(
    () => getThreatLevel(activeZoneCount, breakingCount),
    [activeZoneCount, breakingCount],
  );

  // Fetch oil price
  useEffect(() => {
    let cancelled = false;
    async function fetchOil() {
      try {
        const res = await fetch('/api/yahoo/v8/finance/chart/BZ%3DF?range=1d&interval=5m');
        if (!res.ok) return;
        const json = await res.json();
        const meta = json?.chart?.result?.[0]?.meta;
        if (!cancelled && meta) {
          const price = meta.regularMarketPrice;
          const prev = meta.chartPreviousClose || meta.previousClose;
          const change = prev ? ((price - prev) / prev) * 100 : 0;
          setOilPrice({ price, change });
        }
      } catch {}
    }
    fetchOil();
    const interval = setInterval(fetchOil, 60_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const isDesktop = !isMobile;

  // Mobile layout
  if (isMobile) {
    return (
      <div ref={swipeRef} className="h-screen w-screen flex flex-col bg-ops-bg scanline-overlay overflow-hidden">
        <Header threatLevel={threatLevel} oilPrice={oilPrice} activeZoneCount={activeZoneCount} />
        <BreakingNews articles={articles} breakingArticles={breakingArticles} />
        <div className="flex-1 min-h-0 flex flex-col pb-14">
          <MobilePanel
            activeTab={mobileTab}
            articles={articles}
            enArticles={en.articles}
            arArticles={ar.articles}
          />
        </div>
        <MobileNav activeTab={mobileTab} onTabChange={setMobileTab} />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="h-screen w-screen flex flex-col bg-ops-bg scanline-overlay lg:overflow-hidden overflow-y-auto">
      <Header threatLevel={threatLevel} oilPrice={oilPrice} activeZoneCount={activeZoneCount} />
      <BreakingNews articles={articles} breakingArticles={breakingArticles} />

      <div className="flex-1 flex flex-col gap-px bg-ops-border min-h-0">
        {/* Top row: Map + Live Streams */}
        <div
          ref={topResize.containerRef}
          className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-none gap-px"
          style={isDesktop ? { display: 'grid', gridTemplateColumns: topResize.gridTemplate } : undefined}
        >
          <div className="bg-ops-panel min-h-[50vh] lg:min-h-0">
            <MapView articles={articles} />
          </div>
          {isDesktop && (
            <div
              className="hidden lg:block bg-ops-border hover:bg-ops-green/30 transition-colors"
              style={{ cursor: 'col-resize' }}
              onMouseDown={(e) => topResize.onMouseDown(0, e)}
            />
          )}
          <div className="bg-ops-panel min-h-[50vh] lg:min-h-0">
            <LiveStreams />
          </div>
        </div>

        {/* Bottom row: News + Timeline + Casualties + Market Impact */}
        <div
          ref={bottomResize.containerRef}
          className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-none gap-px"
          style={isDesktop ? { display: 'grid', gridTemplateColumns: bottomResize.gridTemplate } : undefined}
        >
          <div className="bg-ops-panel min-h-0 overflow-hidden">
            <TimelineTabs enArticles={en.articles} arArticles={ar.articles} />
          </div>
          {isDesktop && (
            <div
              className="hidden lg:block bg-ops-border hover:bg-ops-green/30 transition-colors"
              style={{ cursor: 'col-resize' }}
              onMouseDown={(e) => bottomResize.onMouseDown(0, e)}
            />
          )}
          <div className="bg-ops-panel min-h-0 overflow-hidden">
            <MissileDroneTracker />
          </div>
          {isDesktop && (
            <div
              className="hidden lg:block bg-ops-border hover:bg-ops-green/30 transition-colors"
              style={{ cursor: 'col-resize' }}
              onMouseDown={(e) => bottomResize.onMouseDown(1, e)}
            />
          )}
          <div className="bg-ops-panel min-h-0 overflow-hidden">
            <ImpactTracker />
          </div>
          {isDesktop && (
            <div
              className="hidden lg:block bg-ops-border hover:bg-ops-green/30 transition-colors"
              style={{ cursor: 'col-resize' }}
              onMouseDown={(e) => bottomResize.onMouseDown(2, e)}
            />
          )}
          <div className="bg-ops-panel min-h-0 overflow-hidden">
            <MarketImpact />
          </div>
        </div>
      </div>
    </div>
  );
}

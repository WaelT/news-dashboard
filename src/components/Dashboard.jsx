import Header from './Header';
import MapView from './MapView';
import ConflictTimeline from './ConflictTimeline';
import ImpactTracker from './ImpactTracker';
import MarketImpact from './MarketImpact';
import LiveStreams from './LiveStreams';
import BreakingNews from './BreakingNews';
import { useAllNews } from '../hooks/useNews';

export default function Dashboard() {
  const { articles } = useAllNews();

  return (
    <div className="h-screen w-screen flex flex-col bg-ops-bg scanline-overlay">
      <Header />
      <BreakingNews articles={articles} />

      <div className="flex-1 flex flex-col gap-px bg-ops-border min-h-0">
        {/* Top row: Map + Live Streams */}
        <div className="flex-1 min-h-0 grid grid-cols-2 gap-px">
          <div className="bg-ops-panel min-h-0">
            <MapView articles={articles} />
          </div>
          <div className="bg-ops-panel min-h-0">
            <LiveStreams />
          </div>
        </div>

        {/* Bottom row: Timeline + Casualties + Market Impact */}
        <div className="flex-1 min-h-0 grid grid-cols-[1fr_1fr_2fr] gap-px">
          <div className="bg-ops-panel min-h-0 overflow-hidden">
            <ConflictTimeline articles={articles} />
          </div>
          <div className="bg-ops-panel min-h-0 overflow-hidden">
            <ImpactTracker />
          </div>
          <div className="bg-ops-panel min-h-0 overflow-hidden">
            <MarketImpact />
          </div>
        </div>
      </div>
    </div>
  );
}

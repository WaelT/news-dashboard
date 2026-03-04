import ConflictTimeline from './ConflictTimeline';
import ImpactTracker from './ImpactTracker';
import MarketImpact from './MarketImpact';

export default function IntelPanel({ articles }) {
  return (
    <div className="flex flex-col h-full gap-px bg-ops-border">
      {/* Top row (~60%): Timeline + Casualties side-by-side */}
      <div className="flex-[6] min-h-0 grid grid-cols-2 gap-px">
        <div className="bg-ops-panel min-h-0 overflow-hidden">
          <ConflictTimeline articles={articles} />
        </div>
        <div className="bg-ops-panel min-h-0 overflow-hidden">
          <ImpactTracker />
        </div>
      </div>
      {/* Bottom row (~40%): Full-width Market Impact */}
      <div className="flex-[4] min-h-0 bg-ops-panel overflow-hidden">
        <MarketImpact />
      </div>
    </div>
  );
}

import { memo } from 'react';

interface PitboxPositionBarProps {
  distanceToPit: number;      // Distance to pitbox in meters (positive = ahead, negative = behind)
  outerThreshold: number;     // Distance when outer bar starts animating (e.g., 80m)
  innerThreshold: number;     // Distance when inner bar starts animating (e.g., 20m)
  targetZone: number;         // Size of ideal stop zone in meters (e.g., 5m)
}

/**
 * Vertical pitbox position indicator showing:
 * - Narrow outer bar (right): animates when within outer threshold
 * - Wide inner bar (left): animates when within inner threshold
 * - Green/red target zones indicating ideal stopping position
 * - Distance markers
 */
export const PitboxPositionBar = memo(({
  distanceToPit,
  outerThreshold,
  innerThreshold,
  targetZone,
}: PitboxPositionBarProps) => {
  // Calculate if we're within range for each bar
  const withinOuterRange = Math.abs(distanceToPit) <= outerThreshold;
  const withinInnerRange = Math.abs(distanceToPit) <= innerThreshold;

  // Calculate progress percentages (0-100)
  // For outer bar: 0% at outerThreshold distance, 100% at pitbox
  const outerProgress = withinOuterRange
    ? Math.max(0, Math.min(100, ((outerThreshold - Math.abs(distanceToPit)) / outerThreshold) * 100))
    : 0;

  // For inner bar: 0% at innerThreshold distance, 100% at pitbox
  const innerProgress = withinInnerRange
    ? Math.max(0, Math.min(100, ((innerThreshold - Math.abs(distanceToPit)) / innerThreshold) * 100))
    : 0;

  // Determine if we're past the pitbox (negative distance)
  const pastPitbox = distanceToPit < 0;

  // Calculate target zone positions (as percentage of bar height)
  // Green zone is slightly before pitbox, red zone is slightly after
  const targetZoneHeightPct = (targetZone / innerThreshold) * 100;
  const greenZoneTop = 50 - targetZoneHeightPct / 2;
  const redZoneTop = 50 + targetZoneHeightPct / 2;

  return (
    <div className="flex gap-1 py-2 px-2 bg-slate-800/50 rounded">
      {/* Inner Bar (wider, left side) - shows when within inner threshold */}
      <div className="flex flex-col items-center gap-1">
        {/* Distance label */}
        <div className="text-[10px] text-white/80 font-medium whitespace-nowrap h-4">
          {withinInnerRange && Math.abs(distanceToPit).toFixed(0)}
        </div>

        {/* Bar container */}
        <div className="relative w-12 bg-slate-700/50 rounded overflow-hidden" style={{ height: '160px' }}>
          {/* Target zones - only show when within inner range */}
          {withinInnerRange && (
            <>
              {/* Green zone (before pitbox) */}
              <div
                className="absolute w-full h-0.5 bg-green-500/60"
                style={{ top: `${greenZoneTop}%` }}
              />
              {/* Red zone (after pitbox) */}
              <div
                className="absolute w-full h-0.5 bg-red-500/60"
                style={{ top: `${redZoneTop}%` }}
              />
              {/* Center line (pitbox position) */}
              <div className="absolute w-full h-0.5 bg-white top-1/2" />
            </>
          )}

          {/* Animated fill bar */}
          {withinInnerRange && (
            <div
              className={[
                'absolute w-full transition-all duration-150 ease-out',
                pastPitbox ? 'bg-purple-500' : 'bg-blue-500',
              ].join(' ')}
              style={{
                bottom: 0,
                height: `${innerProgress}%`,
              }}
            />
          )}
        </div>

        {/* Bottom label */}
        <div className="text-[10px] text-slate-400 whitespace-nowrap">
          {innerThreshold}m
        </div>
      </div>

      {/* Outer Bar (narrow, right side) - shows when within outer threshold */}
      <div className="flex flex-col items-center gap-1">
        {/* Top spacing to align with inner bar */}
        <div className="h-4" />

        {/* Bar container */}
        <div className="relative w-4 bg-slate-700/50 rounded overflow-hidden" style={{ height: '160px' }}>
          {/* Animated fill bar */}
          {withinOuterRange && (
            <div
              className={[
                'absolute w-full transition-all duration-150 ease-out',
                pastPitbox ? 'bg-purple-400' : 'bg-blue-400',
              ].join(' ')}
              style={{
                bottom: 0,
                height: `${outerProgress}%`,
              }}
            />
          )}
        </div>

        {/* Bottom label */}
        <div className="text-[10px] text-slate-400 whitespace-nowrap">
          {outerThreshold}m
        </div>
      </div>
    </div>
  );
});

PitboxPositionBar.displayName = 'PitboxPositionBar';

import { memo } from 'react';

interface PitSpeedBarProps {
  currentSpeed: number;
  limitSpeed: number;
  unit: 'km/h' | 'mph';
  isSpeeding: boolean;
  isSeverelyOver: boolean;
}

/**
 * Vertical speed bar for pit lane speed visualization
 * Shows the speed limit as a center line with current speed as a bar
 * - Below the line when under limit
 * - Above the line when over limit
 */
export const PitSpeedBar = memo(({
  currentSpeed,
  limitSpeed,
  unit,
  isSpeeding,
  isSeverelyOver,
}: PitSpeedBarProps) => {
  // Calculate the delta from limit
  const delta = currentSpeed - limitSpeed;

  // Calculate the percentage for bar height
  // We'll show +/- 20 km/h or 12 mph range around the limit
  const maxRange = unit === 'km/h' ? 20 : 12;
  const deltaPercent = Math.min(Math.max(delta / maxRange, -1), 1); // Clamp between -1 and 1

  // Calculate bar height (0-100% of available space)
  const barHeightPercent = Math.abs(deltaPercent) * 100;

  // Determine color based on speed
  const getBarColor = () => {
    if (isSeverelyOver) return 'bg-red-600';
    if (isSpeeding) return 'bg-red-500';
    if (delta < -5) return 'bg-green-500';
    if (delta < 0) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const barColor = getBarColor();

  return (
    <div className="flex flex-col items-center gap-1 py-2 px-3 bg-slate-800/50 rounded">
      {/* Above limit section */}
      <div className="flex flex-col items-center h-24 w-8 justify-end">
        {delta > 0 && (
          <div
            className={`w-full ${barColor} ${isSeverelyOver ? 'animate-pulse' : ''} transition-all rounded-t`}
            style={{ height: `${barHeightPercent}%` }}
          />
        )}
      </div>

      {/* Limit line */}
      <div className="w-full flex flex-col items-center gap-0.5">
        <div className="w-full h-0.5 bg-white"></div>
        <div className="text-[10px] text-white/80 font-medium whitespace-nowrap">
          {limitSpeed.toFixed(0)} {unit}
        </div>
      </div>

      {/* Below limit section */}
      <div className="flex flex-col items-center h-24 w-8 justify-start">
        {delta < 0 && (
          <div
            className={`w-full ${barColor} transition-all rounded-b`}
            style={{ height: `${barHeightPercent}%` }}
          />
        )}
      </div>

      {/* Current speed display */}
      <div className={`text-xs font-bold ${isSpeeding ? 'text-red-400' : 'text-green-400'}`}>
        {currentSpeed.toFixed(0)}
      </div>
    </div>
  );
});

PitSpeedBar.displayName = 'PitSpeedBar';

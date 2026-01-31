import { useDashboard } from '@irdashies/context';
import type { PitlaneHelperWidgetSettings } from '../../Settings/types';

export const usePitlaneHelperSettings = () => {
  const { currentDashboard } = useDashboard();

  const widget = currentDashboard?.widgets?.find(
    (w) => w.id === 'pitlanehelper'
  ) as PitlaneHelperWidgetSettings | undefined;

  const config = widget?.config ?? {
    showMode: 'approaching' as const,
    approachDistance: 200,
    enablePitLimiterWarning: true,
    enableEarlyPitboxWarning: true,
    earlyPitboxThreshold: 75,
    showPitlaneTraffic: true,
    showSpeedBar: false,
    showPositionBar: false,
    positionBarOuterThreshold: 80,
    positionBarInnerThreshold: 20,
    positionBarTargetZone: 5,
    background: { opacity: 80 },
    progressBarOrientation: 'horizontal' as const,
    showPitExitInputs: false,
    pitExitInputs: {
      throttle: true,
      clutch: true,
    },
    showInputsPhase: 'afterPitbox' as const,
  };

  // Migrate old configs to include new fields
  const migratedConfig = {
    ...config,
    progressBarOrientation: config.progressBarOrientation ?? 'horizontal' as const,
    showPitExitInputs: config.showPitExitInputs ?? false,
    pitExitInputs: config.pitExitInputs ?? { throttle: true, clutch: true },
    showInputsPhase: config.showInputsPhase ?? 'afterPitbox' as const,
    showSpeedBar: config.showSpeedBar ?? false,
    showPositionBar: config.showPositionBar ?? false,
    positionBarOuterThreshold: config.positionBarOuterThreshold ?? 80,
    positionBarInnerThreshold: config.positionBarInnerThreshold ?? 20,
    positionBarTargetZone: config.positionBarTargetZone ?? 5,
  };

  return migratedConfig;
};

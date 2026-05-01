import { useEffect, useRef } from 'react';
import {
  useDashboard,
  useTelemetryStore,
  useSessionStore,
  useSectorTimingStore,
} from '@irdashies/context';
import logger from '@irdashies/utils/logger';
import { renderCounts, resetRenderCounts } from './renderCounter';

const REPORT_INTERVAL_MS = 10_000;
const LONG_TASK_THRESHOLD_MS = 50;

interface ChromiumPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

interface LongTaskEntry {
  duration: number;
  startTime: number;
  name: string;
}

/**
 * Per-window performance diagnostic. Reports once per REPORT_INTERVAL_MS:
 *
 *   [perf:<id>] fps=N longTasks=N (worst=Nms total=Nms) heap=NMB (+/-NMB)
 *               telemetryTicks=N sessionUpdates=N sectorUpdates=N
 *   [perf:<id>] top renders: widget1=N widget2=N widget3=N
 *
 * - heap delta (+NMB) flags leaks: a window where heap grows steadily over
 *   several reports while others stay flat is leaking.
 * - telemetryTicks: how many times this window's TelemetryStore was updated.
 *   Should be ~250 per 10s (25Hz). A laggy window with low ticks indicates
 *   IPC backpressure; a window with high ticks but low fps is renderer-bound.
 * - sessionUpdates / sectorUpdates: store mutation counters. Useful for
 *   spotting runaway updates from a specific store.
 * - top renders: widgets that re-rendered the most in this window during
 *   the report period. Pinpoints which component is the cost driver.
 *
 * Renders nothing. Mount once at the top of OverlayContainer.
 */
export const PerfDiagnostic = () => {
  const { containerBoundsInfo } = useDashboard();
  const frameCountRef = useRef(0);
  const longTasksRef = useRef<LongTaskEntry[]>([]);
  const rafIdRef = useRef<number | null>(null);
  const lastHeapMBRef = useRef<number | null>(null);
  const telemetryTicksRef = useRef(0);
  const sessionUpdatesRef = useRef(0);
  const sectorUpdatesRef = useRef(0);

  useEffect(() => {
    const displayId = containerBoundsInfo?.displayId ?? 'unknown';
    const sizeLabel = `${window.innerWidth}x${window.innerHeight}@(${window.screenX},${window.screenY})`;
    const tag = `[perf:${displayId}]`;

    logger.info(`${tag} diagnostic started ${sizeLabel}`);

    // 1. Frame counter via rAF
    const tick = () => {
      frameCountRef.current += 1;
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);

    // 2. Long-task observer (tasks blocking the main thread > 50ms)
    let observer: PerformanceObserver | undefined;
    const supportedTypes =
      (PerformanceObserver as unknown as { supportedEntryTypes?: string[] })
        .supportedEntryTypes ?? [];
    if (supportedTypes.includes('longtask')) {
      try {
        observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration >= LONG_TASK_THRESHOLD_MS) {
              longTasksRef.current.push({
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name,
              });
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (err) {
        logger.warn(`${tag} longtask observer unavailable`, err);
      }
    }

    // 3. Store mutation counters via subscribe(). Each call counts one
    // setState() that produced a state change.
    const unsubTelemetry = useTelemetryStore.subscribe(() => {
      telemetryTicksRef.current += 1;
    });
    const unsubSession = useSessionStore.subscribe(() => {
      sessionUpdatesRef.current += 1;
    });
    const unsubSector = useSectorTimingStore.subscribe(() => {
      sectorUpdatesRef.current += 1;
    });

    // 4. Periodic report
    const reportInterval = window.setInterval(() => {
      const seconds = REPORT_INTERVAL_MS / 1000;
      const fps = Math.round(frameCountRef.current / seconds);
      frameCountRef.current = 0;

      const longTasks = longTasksRef.current;
      longTasksRef.current = [];
      const longTaskCount = longTasks.length;
      const worstLongTask = longTasks.reduce(
        (max, t) => (t.duration > max ? t.duration : max),
        0
      );
      const totalBlockedMs = Math.round(
        longTasks.reduce((sum, t) => sum + t.duration, 0)
      );

      const perf = performance as ChromiumPerformance;
      const heapMB = perf.memory
        ? Math.round(perf.memory.usedJSHeapSize / (1024 * 1024))
        : -1;
      const heapDelta =
        heapMB >= 0 && lastHeapMBRef.current !== null
          ? heapMB - lastHeapMBRef.current
          : 0;
      lastHeapMBRef.current = heapMB;
      const heapDeltaStr = heapDelta >= 0 ? `+${heapDelta}` : `${heapDelta}`;

      const telemetryTicks = telemetryTicksRef.current;
      const sessionUpdates = sessionUpdatesRef.current;
      const sectorUpdates = sectorUpdatesRef.current;
      telemetryTicksRef.current = 0;
      sessionUpdatesRef.current = 0;
      sectorUpdatesRef.current = 0;

      logger.info(
        `${tag} fps=${fps} longTasks=${longTaskCount} (worst=${Math.round(
          worstLongTask
        )}ms total=${totalBlockedMs}ms) heap=${heapMB}MB (${heapDeltaStr}MB) ` +
          `telemetryTicks=${telemetryTicks} sessionUpdates=${sessionUpdates} sectorUpdates=${sectorUpdates}`
      );

      // Top widget renderers in this window during the report window.
      const topRenders = Object.entries(renderCounts())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => `${name}=${count}`)
        .join(' ');
      if (topRenders) {
        logger.info(`${tag} top renders: ${topRenders}`);
      }
      resetRenderCounts();

      // If something genuinely bad happened, also dump the worst tasks.
      if (longTaskCount > 0 && worstLongTask >= 200) {
        const top = longTasks
          .slice()
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 3)
          .map(
            (t) =>
              `${Math.round(t.duration)}ms@${Math.round(t.startTime)} (${t.name || 'unknown'})`
          )
          .join(', ');
        logger.warn(`${tag} top long tasks: ${top}`);
      }
    }, REPORT_INTERVAL_MS);

    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      observer?.disconnect();
      unsubTelemetry();
      unsubSession();
      unsubSector();
      window.clearInterval(reportInterval);
      logger.info(`${tag} diagnostic stopped`);
    };
  }, [containerBoundsInfo?.displayId]);

  return null;
};

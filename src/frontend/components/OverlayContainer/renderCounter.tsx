/**
 * Per-window render counter. Each instrumented widget bumps a counter on
 * every render; PerfDiagnostic reads and resets the counts on each report.
 *
 * Counts are window-scoped: each renderer process has its own module
 * instance, so counts naturally don't bleed across windows.
 */
const counts = new Map<string, number>();

export const renderCounts = (): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const [name, count] of counts.entries()) {
    out[name] = count;
  }
  return out;
};

export const resetRenderCounts = (): void => {
  counts.clear();
};

/**
 * Wrap a widget component so each render of the wrapped widget is counted
 * against `name`. The wrapper bumps the counter synchronously during the
 * render call, before delegating.
 *
 * The signature deliberately matches WIDGET_MAP entries:
 *   (config?: any) => React.JSX.Element | null
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const withRenderCount = (
  name: string,
  Component: (config?: any) => React.JSX.Element | null
): ((config?: any) => React.JSX.Element | null) => {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const Wrapped = (config?: unknown) => {
    counts.set(name, (counts.get(name) ?? 0) + 1);
    return Component(config);
  };
  Wrapped.displayName = `withRenderCount(${name})`;
  return Wrapped;
};

/**
 * Joker lap done, as a yellow tag beside the car. `full` spells it out where
 * there is room; `inverted` is for a row already filled with its class colour.
 */
export const JokerBadge = ({
  full,
  inverted,
}: {
  full?: boolean;
  inverted?: boolean;
}) => (
  <span
    title="Joker lap done"
    className={[
      'flex shrink-0 items-center justify-center rounded-xs font-bold italic uppercase leading-none',
      full ? 'px-1.5 py-1 text-sm' : 'h-4 min-w-4 px-0.5 text-[10px]',
      inverted ? 'bg-slate-900 text-amber-400' : 'bg-amber-400 text-slate-900',
    ].join(' ')}
  >
    {full ? 'Joker' : 'J'}
  </span>
);

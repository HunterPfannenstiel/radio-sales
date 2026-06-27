function fmt$(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

type PaceCellProps = {
  currentDailyRate: number;
  requiredDailyRate: number;
};

export function PaceCell({ currentDailyRate, requiredDailyRate }: PaceCellProps) {
  const onPace = currentDailyRate >= requiredDailyRate;
  const requiredColor = onPace
    ? "var(--color-status-success)"
    : "var(--color-accent-primary)";

  return (
    <div className="grid grid-cols-2 gap-3">
      <span
        className="font-heading text-2xl font-bold leading-none tabular-nums"
        style={{ color: "var(--color-text-primary)" }}
      >
        {fmt$(currentDailyRate)}<span className="text-sm font-sans opacity-50">/day</span>
      </span>
      <span
        className="font-heading text-2xl font-bold leading-none tabular-nums"
        style={{ color: requiredColor }}
      >
        {fmt$(requiredDailyRate)}<span className="text-sm font-sans opacity-50">/day</span>
      </span>
    </div>
  );
}

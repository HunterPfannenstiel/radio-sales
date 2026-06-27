"use client";

function fmt$(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1_000)}K`;
}

export function SummaryBlock({
  currentAmount,
  targetAmount,
}: {
  currentAmount: number;
  targetAmount: number;
}) {
  return (
    <div
      className="flex gap-8 px-6 py-6 border-b"
      style={{ borderColor: "var(--color-border-subtle)" }}
    >
      <div className="flex flex-col gap-1">
        <span
          className="text-xs font-mono uppercase tracking-widest"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Current
        </span>
        <span
          className="font-heading text-4xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {fmt$(currentAmount)}
        </span>
      </div>

      <div
        className="w-px self-stretch"
        style={{ background: "var(--color-border-subtle)" }}
      />

      <div className="flex flex-col gap-1">
        <span
          className="text-xs font-mono uppercase tracking-widest"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Goal
        </span>
        <span
          className="font-heading text-4xl font-bold"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {fmt$(targetAmount)}
        </span>
      </div>
    </div>
  );
}

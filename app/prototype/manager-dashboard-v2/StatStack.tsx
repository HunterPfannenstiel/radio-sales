"use client";

export function StatStack({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold leading-none tabular-nums">
        {value}
      </span>
    </div>
  );
}

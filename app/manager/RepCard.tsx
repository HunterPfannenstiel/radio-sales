"use client";

import Link from "next/link";
import type { RepRowData } from "./hooks/useManagerDashboard";
import { RiskAccentBar } from "./RiskAccentBar";

function fmt$(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1_000)}K`;
}

function fmtPct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

type MetricProps = { value: string; sub?: string };

function Metric({ value, sub }: MetricProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="font-heading text-xl font-bold leading-none tabular-nums"
        style={{ color: "var(--color-text-primary)" }}
      >
        {value}
        {sub && (
          <span className="text-xs font-sans opacity-50 ml-0.5">{sub}</span>
        )}
      </span>
    </div>
  );
}

export function RepCard({ rep }: { rep: RepRowData }) {
  const onPace = rep.currentDailyRate >= rep.requiredDailyRate;
  const rateColor = onPace
    ? "var(--color-status-success)"
    : "var(--color-accent-primary)";

  return (
    <Link href="/manager/sample" className="block cursor-pointer">
      <div
        className="flex items-stretch border-b"
        style={{
          background: "var(--color-surface-page)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <RiskAccentBar risk={rep.riskState} />

        <div className="flex-1 px-4 py-4 flex flex-col gap-3">
          <span
            className="font-heading text-2xl font-bold leading-none"
            style={{ color: "var(--color-text-primary)" }}
          >
            {rep.name}
          </span>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div className="flex flex-col gap-0.5">
              <span
                className="text-xs uppercase tracking-widest font-bold"
                style={{ color: "var(--color-text-secondary)", opacity: 0.7 }}
              >
                Sold
              </span>
              <Metric value={fmt$(rep.sold)} sub={` · ${fmtPct(rep.soldPct)}`} />
            </div>

            <div className="flex flex-col gap-0.5">
              <span
                className="text-xs uppercase tracking-widest font-bold"
                style={{ color: "var(--color-text-secondary)", opacity: 0.7 }}
              >
                Projected
              </span>
              <Metric value={fmt$(rep.projected)} sub={` · ${fmtPct(rep.projectedPct)}`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
            <div className="flex flex-col gap-0.5">
              <span
                className="text-xs uppercase tracking-widest font-bold"
                style={{ color: "var(--color-text-secondary)", opacity: 0.7 }}
              >
                Run rate
              </span>
              <span
                className="font-heading text-xl font-bold leading-none tabular-nums"
                style={{ color: "var(--color-text-primary)" }}
              >
                {fmt$(rep.currentDailyRate)}
                <span className="text-xs font-sans opacity-50">/day</span>
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span
                className="text-xs uppercase tracking-widest font-bold"
                style={{ color: "var(--color-text-secondary)", opacity: 0.7 }}
              >
                Required
              </span>
              <span
                className="font-heading text-xl font-bold leading-none tabular-nums"
                style={{ color: rateColor }}
              >
                {fmt$(rep.requiredDailyRate)}
                <span className="text-xs font-sans opacity-50">/day</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

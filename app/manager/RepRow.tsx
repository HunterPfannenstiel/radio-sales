import Link from "next/link";
import type { RepRowData } from "./hooks/useManagerDashboard";
import { RiskAccentBar } from "./RiskAccentBar";
import { StackedCell } from "./StackedCell";
import { PaceCell } from "./PaceCell";

function fmt$(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1_000)}K`;
}

function fmtPct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export function RepRow({ rep }: { rep: RepRowData }) {
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

      <div
        className="flex-1 grid items-center gap-6 px-6 py-5"
        style={{ gridTemplateColumns: "1fr 160px 160px 200px" }}
      >
        <span
          className="font-heading text-xl font-bold truncate"
          style={{
            color: "var(--color-text-primary)",
          }}
        >
          {rep.name}
        </span>

        <StackedCell
          primary={fmt$(rep.sold)}
          secondary={fmtPct(rep.soldPct)}
        />

        <StackedCell
          primary={fmt$(rep.projected)}
          secondary={fmtPct(rep.projectedPct)}
        />

        <PaceCell
          currentDailyRate={rep.currentDailyRate}
          requiredDailyRate={rep.requiredDailyRate}
        />
      </div>
    </div>
    </Link>
  );
}

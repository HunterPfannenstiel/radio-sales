import type { RepRowData } from "./hooks/useManagerDashboard";
import { RiskAccentBar } from "./RiskAccentBar";
import { StackedCell } from "./StackedCell";

function fmt$(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1_000)}K`;
}

function fmtPct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

const PACE_AHEAD_COLOR = "var(--color-status-success)";
const PACE_BEHIND_COLOR = "var(--color-accent-primary)";

export function RepRow({ rep }: { rep: RepRowData }) {
  const paceColor =
    rep.paceDirection === "ahead" ? PACE_AHEAD_COLOR : PACE_BEHIND_COLOR;

  return (
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
          className="font-medium truncate"
          style={{
            fontSize: "var(--font-size-body)",
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

        <StackedCell
          primary={fmt$(rep.sold)}
          primaryColor={paceColor}
          secondary={fmt$(rep.expectedPace)}
          secondaryColor="var(--color-text-secondary)"
        />
      </div>
    </div>
  );
}

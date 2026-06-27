import type { RiskState } from "./hooks/useManagerDashboard";

const RISK_COLORS: Record<RiskState, string> = {
  green: "var(--color-status-success)",
  yellow: "var(--color-status-pending)",
  red: "var(--color-accent-primary)",
};

export function RiskAccentBar({ risk }: { risk: RiskState }) {
  return (
    <div
      className="w-1.5 self-stretch shrink-0"
      style={{ background: RISK_COLORS[risk] }}
      aria-hidden
    />
  );
}

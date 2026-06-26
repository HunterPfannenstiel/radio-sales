import { PrototypeLayout, PrototypeSection } from "@/app/prototype/PrototypeLayout";
import { ManagerDashboard } from "@/app/manager-dashboard/ManagerDashboard";
import { RepRow } from "@/app/manager-dashboard/RepRow";
import { LeaderboardHeader } from "@/app/manager-dashboard/LeaderboardHeader";
import { RiskAccentBar } from "@/app/manager-dashboard/RiskAccentBar";
import { StackedCell } from "@/app/manager-dashboard/StackedCell";

const SAMPLE_REP = {
  id: "sample",
  name: "Marcus Webb",
  goal: 120_000,
  sold: 52_000,
  soldPct: 52_000 / 120_000,
  projected: 60_000,
  projectedPct: 60_000 / 120_000,
  expectedPace: 120_000 * (26 / 30),
  riskState: "red" as const,
  paceDirection: "behind" as const,
};

export default function ManagerDashboardPrototypePage() {
  return (
    <PrototypeLayout
      feature="Manager Dashboard"
      assembled={<ManagerDashboard />}
    >
      <PrototypeSection name="Rep Row">
        <div className="flex flex-col border rounded-lg overflow-hidden">
          <RepRow rep={SAMPLE_REP} />
          <RepRow
            rep={{
              ...SAMPLE_REP,
              id: "s2",
              name: "Sam Flores",
              sold: 82_000,
              soldPct: 82_000 / 90_000,
              projected: 95_000,
              projectedPct: 95_000 / 90_000,
              goal: 90_000,
              expectedPace: 90_000 * (26 / 30),
              riskState: "green",
              paceDirection: "ahead",
            }}
          />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Leaderboard Header">
        <div className="rounded-lg overflow-hidden">
          <LeaderboardHeader />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Risk Accent Bar">
        <div className="flex gap-8 items-center">
          {(["green", "yellow", "red"] as const).map((risk) => (
            <div key={risk} className="flex items-center gap-3">
              <div className="h-12 flex">
                <RiskAccentBar risk={risk} />
              </div>
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {risk}
              </span>
            </div>
          ))}
        </div>
      </PrototypeSection>

      <PrototypeSection name="Stacked Cell">
        <div className="flex gap-12 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Sold</span>
            <StackedCell primary="$52K" secondary="43%" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Projected</span>
            <StackedCell primary="$60K" secondary="50%" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Pace (behind)</span>
            <StackedCell
              primary="$52K"
              primaryColor="var(--color-accent-primary)"
              secondary="$104K exp."
              secondaryColor="var(--color-text-secondary)"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Pace (ahead)</span>
            <StackedCell
              primary="$82K"
              primaryColor="var(--color-status-success)"
              secondary="$78K exp."
              secondaryColor="var(--color-text-secondary)"
            />
          </div>
        </div>
      </PrototypeSection>
    </PrototypeLayout>
  );
}

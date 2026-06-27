import type { RepRowData } from "./hooks/useManagerDashboard";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { RepRow } from "./RepRow";
import { RepCard } from "./RepCard";
import { PageHeader } from "@/components/PageHeader";

export function RepLeaderboard({ reps }: { reps: RepRowData[] }) {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <div
        className="px-6 py-5 shrink-0"
        style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
      >
        <PageHeader title="My Team" />
      </div>

      {/* Desktop: sticky column header + rows */}
      <div className="hidden md:block">
        <LeaderboardHeader />
        {reps.map((rep) => (
          <RepRow key={rep.id} rep={rep} />
        ))}
      </div>

      {/* Mobile: stacked cards, no header */}
      <div className="md:hidden">
        {reps.map((rep) => (
          <RepCard key={rep.id} rep={rep} />
        ))}
      </div>
    </div>
  );
}

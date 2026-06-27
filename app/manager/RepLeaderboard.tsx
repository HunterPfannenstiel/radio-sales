import type { RepRowData } from "./hooks/useManagerDashboard";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { RepRow } from "./RepRow";

export function RepLeaderboard({ reps }: { reps: RepRowData[] }) {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <LeaderboardHeader />
      {reps.map((rep) => (
        <RepRow key={rep.id} rep={rep} />
      ))}
    </div>
  );
}

import { useManagerDashboard } from "./hooks/useManagerDashboard";
import { RepLeaderboard } from "./RepLeaderboard";

export function ManagerDashboard() {
  const reps = useManagerDashboard();
  return <RepLeaderboard reps={reps} />;
}

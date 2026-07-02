import { getMockRep } from "../../hooks/mockReps";
import { getAllMetricContent, type MetricContent } from "./metricContent";

export type DrillDownData = {
  id: string;
  name: string;
  initials: string;
  pace: "on-pace" | "watch" | "behind";
  dollarSold: number;
  dollarProjected: number;
  metrics: MetricContent[];
};

export function useDrillDown(repId: string): DrillDownData {
  const rep = getMockRep(repId);
  const n = Number(repId) || 1;
  const goal = 90_000 + n * 4_000;
  const pace = rep?.pace ?? "watch";

  return {
    id: rep?.id ?? repId,
    name: rep?.name ?? "Unknown Rep",
    initials: rep?.initials ?? "??",
    pace,
    dollarSold: Math.round(goal * (rep?.soldPct ?? 0.6)),
    dollarProjected: Math.round(goal * (rep?.projectedPct ?? 0.75)),
    metrics: getAllMetricContent(n, pace),
  };
}

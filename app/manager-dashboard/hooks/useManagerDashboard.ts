export type RiskState = "green" | "yellow" | "red";
export type PaceDirection = "ahead" | "behind";

export type RepRowData = {
  id: string;
  name: string;
  goal: number;
  sold: number;
  soldPct: number;
  projected: number;
  projectedPct: number;
  expectedPace: number;
  riskState: RiskState;
  paceDirection: PaceDirection;
};

const DAYS_ELAPSED = 26;
const DAYS_IN_MONTH = 30;
const PACE_FACTOR = DAYS_ELAPSED / DAYS_IN_MONTH;

const MOCK_REPS = [
  { id: "1", name: "Marcus Webb", goal: 120_000, sold: 52_000, projected: 60_000 },
  { id: "2", name: "Jordan Lee", goal: 95_000, sold: 45_000, projected: 62_000 },
  { id: "3", name: "Dana Kim", goal: 110_000, sold: 72_000, projected: 84_000 },
  { id: "4", name: "Riley Torres", goal: 100_000, sold: 78_000, projected: 88_000 },
  { id: "5", name: "Alex Chen", goal: 130_000, sold: 116_000, projected: 125_000 },
  { id: "6", name: "Sam Flores", goal: 90_000, sold: 82_000, projected: 95_000 },
  { id: "7", name: "Taylor Price", goal: 85_000, sold: 84_000, projected: 92_000 },
];

function deriveRep(rep: (typeof MOCK_REPS)[number]): RepRowData {
  const soldPct = rep.sold / rep.goal;
  const projectedPct = rep.projected / rep.goal;
  const expectedPace = rep.goal * PACE_FACTOR;
  const riskState: RiskState =
    projectedPct >= 0.9 ? "green" : projectedPct >= 0.7 ? "yellow" : "red";
  const paceDirection: PaceDirection = rep.sold >= expectedPace ? "ahead" : "behind";

  return { ...rep, soldPct, projectedPct, expectedPace, riskState, paceDirection };
}

export function useManagerDashboard(): RepRowData[] {
  return MOCK_REPS.map(deriveRep).sort((a, b) => a.projectedPct - b.projectedPct);
}

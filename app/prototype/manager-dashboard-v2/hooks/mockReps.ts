import { initials } from "../format";

export type Pace = "on-pace" | "watch" | "behind";

export type RosterRep = {
  id: string;
  name: string;
  initials: string;
  soldPct: number;
  projectedPct: number;
  pace: Pace;
};

function derivePace(projectedPct: number): Pace {
  if (projectedPct >= 0.9) return "on-pace";
  if (projectedPct >= 0.7) return "watch";
  return "behind";
}

const RAW_REPS: { id: string; name: string; soldPct: number; projectedPct: number }[] = [
  { id: "1", name: "Brian Kowalski", soldPct: 0.43, projectedPct: 0.5 },
  { id: "2", name: "Donna Marsh", soldPct: 0.47, projectedPct: 0.65 },
  { id: "3", name: "Kevin Holt", soldPct: 0.55, projectedPct: 0.68 },
  { id: "4", name: "Marcus Webb", soldPct: 0.61, projectedPct: 0.69 },
  { id: "5", name: "Priya Nair", soldPct: 0.6, projectedPct: 0.74 },
  { id: "6", name: "Tom Gallagher", soldPct: 0.66, projectedPct: 0.78 },
  { id: "7", name: "Linda Reyes", soldPct: 0.7, projectedPct: 0.82 },
  { id: "8", name: "Sam Flores", soldPct: 0.73, projectedPct: 0.86 },
  { id: "9", name: "Mike Delaney", soldPct: 0.76, projectedPct: 0.88 },
  { id: "10", name: "Susan Park", soldPct: 0.82, projectedPct: 0.91 },
  { id: "11", name: "Alicia Chen", soldPct: 0.85, projectedPct: 0.94 },
  { id: "12", name: "Derek Osei", soldPct: 0.88, projectedPct: 0.97 },
  { id: "13", name: "Grace Kim", soldPct: 0.9, projectedPct: 1.0 },
  { id: "14", name: "Frank Iannelli", soldPct: 0.94, projectedPct: 1.04 },
  { id: "15", name: "Nora Whitfield", soldPct: 0.97, projectedPct: 1.08 },
];

export const MOCK_REPS: RosterRep[] = RAW_REPS.map((rep) => ({
  ...rep,
  initials: initials(rep.name),
  pace: derivePace(rep.projectedPct),
})).sort((a, b) => a.projectedPct - b.projectedPct);

export function getMockRep(id: string): RosterRep | undefined {
  return MOCK_REPS.find((rep) => rep.id === id);
}

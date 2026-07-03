import { initials } from "../format";

export type GoalRep = {
  id: string;
  name: string;
  initials: string;
  monthlyGoal: number;
  callsPerWeek: number;
  asksPerWeek: number;
};

const RAW_REPS: {
  id: string;
  name: string;
  monthlyGoal: number;
  callsPerWeek: number;
  asksPerWeek: number;
}[] = [
  { id: "1", name: "Brian Kowalski", monthlyGoal: 4000, callsPerWeek: 25, asksPerWeek: 6 },
  { id: "2", name: "Donna Marsh", monthlyGoal: 4500, callsPerWeek: 28, asksPerWeek: 7 },
  { id: "3", name: "Kevin Holt", monthlyGoal: 5000, callsPerWeek: 30, asksPerWeek: 8 },
  { id: "4", name: "Marcus Webb", monthlyGoal: 5500, callsPerWeek: 32, asksPerWeek: 9 },
  { id: "5", name: "Priya Nair", monthlyGoal: 6000, callsPerWeek: 35, asksPerWeek: 9 },
  { id: "6", name: "Tom Gallagher", monthlyGoal: 6000, callsPerWeek: 35, asksPerWeek: 10 },
  { id: "7", name: "Linda Reyes", monthlyGoal: 6500, callsPerWeek: 38, asksPerWeek: 11 },
  { id: "8", name: "Sam Flores", monthlyGoal: 7000, callsPerWeek: 40, asksPerWeek: 12 },
  { id: "9", name: "Mike Delaney", monthlyGoal: 7500, callsPerWeek: 42, asksPerWeek: 13 },
  { id: "10", name: "Susan Park", monthlyGoal: 8000, callsPerWeek: 45, asksPerWeek: 14 },
  { id: "11", name: "Alicia Chen", monthlyGoal: 8500, callsPerWeek: 48, asksPerWeek: 15 },
  { id: "12", name: "Derek Osei", monthlyGoal: 9000, callsPerWeek: 50, asksPerWeek: 16 },
  { id: "13", name: "Grace Kim", monthlyGoal: 9500, callsPerWeek: 52, asksPerWeek: 17 },
  { id: "14", name: "Frank Iannelli", monthlyGoal: 10000, callsPerWeek: 55, asksPerWeek: 18 },
  { id: "15", name: "Nora Whitfield", monthlyGoal: 11000, callsPerWeek: 60, asksPerWeek: 20 },
];

export const MOCK_GOAL_REPS: GoalRep[] = RAW_REPS.map((rep) => ({
  ...rep,
  initials: initials(rep.name),
}));

export function getMockGoalRep(id: string): GoalRep | undefined {
  return MOCK_GOAL_REPS.find((rep) => rep.id === id);
}

"use client";

import { useState } from "react";
import { MOCK_GOAL_REPS, type GoalRep } from "./mockGoalReps";

export type GoalValues = Pick<GoalRep, "monthlyGoal" | "callsPerWeek" | "asksPerWeek">;

export function useGoalRoster() {
  const [reps, setReps] = useState<GoalRep[]>(MOCK_GOAL_REPS);

  function updateRep(id: string, values: GoalValues) {
    setReps((prev) =>
      prev.map((rep) => (rep.id === id ? { ...rep, ...values } : rep))
    );
  }

  return { reps, updateRep };
}

"use client";

import { GoalsBody } from "./GoalsBody";
import { GoalsHeader } from "./GoalsHeader";
import { useGoalRoster } from "./hooks/useGoalRoster";

export function GoalRoster() {
  const { reps, updateRep } = useGoalRoster();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <GoalsHeader />
      <GoalsBody reps={reps} onSave={updateRep} />
    </div>
  );
}

"use client";

import { PrototypeLayout, PrototypeSection } from "@/app/prototype/PrototypeLayout";
import { Table, TableBody } from "@/components/ui/table";
import { GoalRepCard } from "./GoalRepCard";
import { GoalRepTableRow } from "./GoalRepTableRow";
import { GoalStat } from "./GoalStat";
import { GoalsSkeleton } from "./GoalsSkeleton";
import { GoalRoster } from "./index";
import { MOCK_GOAL_REPS } from "./hooks/mockGoalReps";

const SAMPLE_REPS = [MOCK_GOAL_REPS[0], MOCK_GOAL_REPS[7], MOCK_GOAL_REPS[14]];

export default function GoalsPage() {
  return (
    <PrototypeLayout feature="Goals — Rep Targets" assembled={<GoalRoster />}>
      <PrototypeSection name="Goal Stat">
        <div className="flex gap-6">
          <GoalStat label="Monthly Goal" value="$8,000" size="lg" />
          <GoalStat label="Calls/Week" value="40" />
          <GoalStat label="Asks/Week" value="12" />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Rep Card (mobile)">
        <div className="flex flex-col gap-3 max-w-sm">
          {SAMPLE_REPS.map((rep) => (
            <GoalRepCard key={rep.id} rep={rep} onSave={() => {}} />
          ))}
        </div>
      </PrototypeSection>

      <PrototypeSection name="Rep Table Row (desktop)">
        <Table>
          <TableBody>
            {SAMPLE_REPS.map((rep) => (
              <GoalRepTableRow key={rep.id} rep={rep} onSave={() => {}} />
            ))}
          </TableBody>
        </Table>
      </PrototypeSection>

      <PrototypeSection name="Loading State">
        <GoalsSkeleton />
      </PrototypeSection>
    </PrototypeLayout>
  );
}

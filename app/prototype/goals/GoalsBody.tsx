"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GoalRepCard } from "./GoalRepCard";
import { GoalRepTableRow } from "./GoalRepTableRow";
import type { GoalRep } from "./hooks/mockGoalReps";
import type { GoalValues } from "./hooks/useGoalRoster";

export function GoalsBody({
  reps,
  onSave,
}: {
  reps: GoalRep[];
  onSave: (id: string, values: GoalValues) => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        {reps.map((rep) => (
          <GoalRepCard key={rep.id} rep={rep} onSave={onSave} />
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rep</TableHead>
              <TableHead className="text-right">Monthly Goal</TableHead>
              <TableHead className="text-right">Calls/Week</TableHead>
              <TableHead className="text-right">Asks/Week</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reps.map((rep) => (
              <GoalRepTableRow key={rep.id} rep={rep} onSave={onSave} />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

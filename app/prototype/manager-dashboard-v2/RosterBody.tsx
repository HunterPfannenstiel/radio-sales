"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RepCard } from "./RepCard";
import { RepTableRow } from "./RepTableRow";
import { RosterEmptyState } from "./RosterEmptyState";
import type { RosterRep } from "./hooks/mockReps";

export function RosterBody({ reps }: { reps: RosterRep[] }) {
  if (reps.length === 0) return <RosterEmptyState />;

  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        {reps.map((rep) => (
          <RepCard key={rep.id} rep={rep} />
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rep</TableHead>
              <TableHead>Sold %</TableHead>
              <TableHead>Projected %</TableHead>
              <TableHead>Pace</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reps.map((rep) => (
              <RepTableRow key={rep.id} rep={rep} />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

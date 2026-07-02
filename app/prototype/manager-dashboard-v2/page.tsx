"use client";

import { PrototypeLayout, PrototypeSection } from "@/app/prototype/PrototypeLayout";
import { RepRoster } from "./index";
import { RepCard } from "./RepCard";
import { RepTableRow } from "./RepTableRow";
import { PaceBadge } from "./PaceBadge";
import { StatStack } from "./StatStack";
import { RosterSkeleton } from "./RosterSkeleton";
import { RosterEmptyState } from "./RosterEmptyState";
import { Table, TableBody } from "@/components/ui/table";
import { MOCK_REPS } from "./hooks/mockReps";

const SAMPLE_REPS = [MOCK_REPS[0], MOCK_REPS[7], MOCK_REPS[14]];

export default function ManagerDashboardV2RosterPage() {
  return (
    <PrototypeLayout feature="Manager Dashboard v2 — Rep Roster" assembled={<RepRoster />}>
      <PrototypeSection name="Pace Badge">
        <div className="flex gap-3">
          <PaceBadge pace="on-pace" />
          <PaceBadge pace="watch" />
          <PaceBadge pace="behind" />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Stat Stack">
        <div className="flex gap-6">
          <StatStack label="Sold" value="82%" />
          <StatStack label="Projected" value="95%" />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Rep Card (mobile)">
        <div className="flex flex-col gap-3 max-w-sm">
          {SAMPLE_REPS.map((rep) => (
            <RepCard key={rep.id} rep={rep} />
          ))}
        </div>
      </PrototypeSection>

      <PrototypeSection name="Rep Table Row (desktop)">
        <Table>
          <TableBody>
            {SAMPLE_REPS.map((rep) => (
              <RepTableRow key={rep.id} rep={rep} />
            ))}
          </TableBody>
        </Table>
      </PrototypeSection>

      <PrototypeSection name="Loading State">
        <RosterSkeleton />
      </PrototypeSection>

      <PrototypeSection name="Empty State">
        <RosterEmptyState />
      </PrototypeSection>
    </PrototypeLayout>
  );
}

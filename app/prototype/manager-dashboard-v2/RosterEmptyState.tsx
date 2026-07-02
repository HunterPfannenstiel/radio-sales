"use client";

import { UsersIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function RosterEmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UsersIcon />
        </EmptyMedia>
        <EmptyTitle>No reps found</EmptyTitle>
        <EmptyDescription>
          There are no reps assigned for this month yet.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

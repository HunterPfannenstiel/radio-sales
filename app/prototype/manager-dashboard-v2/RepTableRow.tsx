"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { PaceBadge } from "./PaceBadge";
import { fmtPct } from "./format";
import type { RosterRep } from "./hooks/mockReps";

export function RepTableRow({ rep }: { rep: RosterRep }) {
  const router = useRouter();
  const href = `/prototype/manager-dashboard-v2/${rep.id}`;

  return (
    <TableRow
      className="cursor-pointer"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(event) => {
        if (event.key === "Enter") router.push(href);
      }}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar size="lg">
            <AvatarFallback>{rep.initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{rep.name}</span>
        </div>
      </TableCell>
      <TableCell>{fmtPct(rep.soldPct)}</TableCell>
      <TableCell>{fmtPct(rep.projectedPct)}</TableCell>
      <TableCell>
        <PaceBadge pace={rep.pace} />
      </TableCell>
    </TableRow>
  );
}

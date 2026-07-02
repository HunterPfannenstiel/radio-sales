"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RosterSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <Skeleton key={i} className="h-[132px] w-full rounded-xl" />
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
            {Array.from({ length: 15 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-6 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

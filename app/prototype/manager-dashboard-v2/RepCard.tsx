"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PaceBadge } from "./PaceBadge";
import { StatStack } from "./StatStack";
import { fmtPct } from "./format";
import type { RosterRep } from "./hooks/mockReps";

export function RepCard({ rep }: { rep: RosterRep }) {
  return (
    <Link href={`/prototype/manager-dashboard-v2/${rep.id}`} className="block">
      <Card className="cursor-pointer transition-colors hover:bg-muted/50">
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Avatar size="lg">
                <AvatarFallback>{rep.initials}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{rep.name}</span>
            </div>
            <PaceBadge pace={rep.pace} />
          </div>

          <div className="flex gap-6">
            <StatStack label="Sold" value={fmtPct(rep.soldPct)} />
            <StatStack label="Projected" value={fmtPct(rep.projectedPct)} />
          </div>

          <Progress value={Math.min(rep.soldPct, 1) * 100} />
        </CardContent>
      </Card>
    </Link>
  );
}

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BackNav } from "../BackNav";
import { PaceBadge } from "../PaceBadge";
import { StatStack } from "../StatStack";
import { fmtCurrency } from "../format";
import type { DrillDownData } from "./hooks/useDrillDown";

export function DrillDownHeader({ data }: { data: DrillDownData }) {
  return (
    <div className="flex flex-col gap-4">
      <BackNav
        backHref="/manager"
        crumbs={[{ label: "Rep Roster", href: "/manager" }]}
        current={data.name}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-14">
            <AvatarFallback>{data.initials}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{data.name}</h1>
            <PaceBadge pace={data.pace} />
          </div>
        </div>

        <div className="flex gap-6">
          <StatStack label="Sold" value={fmtCurrency(data.dollarSold)} />
          <StatStack label="Projected" value={fmtCurrency(data.dollarProjected)} />
        </div>
      </div>

      <Separator />
    </div>
  );
}

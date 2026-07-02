"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Pace } from "./hooks/mockReps";

const PACE_LABEL: Record<Pace, string> = {
  "on-pace": "On Pace",
  watch: "Watch",
  behind: "Behind",
};

export function PaceBadge({ pace }: { pace: Pace }) {
  if (pace === "behind") {
    return <Badge variant="destructive">{PACE_LABEL[pace]}</Badge>;
  }

  return (
    <Badge
      className={cn(
        "border-transparent text-white",
        pace === "on-pace" && "bg-[var(--color-status-success)]",
        pace === "watch" && "bg-[var(--color-status-at-risk)]"
      )}
    >
      {PACE_LABEL[pace]}
    </Badge>
  );
}

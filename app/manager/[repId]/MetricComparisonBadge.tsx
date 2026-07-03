"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PaceBadge } from "../PaceBadge";
import type { ComparisonBadgeSpec, ComparisonTone } from "./hooks/metricContent";

const TONE_CLASSES: Record<ComparisonTone, string | undefined> = {
  success: "border-transparent bg-[var(--color-status-success)] text-white",
  warning: "border-transparent bg-[var(--color-status-at-risk)] text-white",
  destructive: undefined,
};

export function MetricComparisonBadge({ comparison }: { comparison: ComparisonBadgeSpec }) {
  if (comparison.kind === "pace") {
    return <PaceBadge pace={comparison.pace} />;
  }

  if (comparison.tone === "destructive") {
    return <Badge variant="destructive">{comparison.label}</Badge>;
  }

  return (
    <Badge className={cn(TONE_CLASSES[comparison.tone])}>{comparison.label}</Badge>
  );
}

"use client";

import { ChevronRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { MetricContent } from "./hooks/metricContent";

export function MetricCard({
  metric,
  onSelect,
}: {
  metric: MetricContent;
  onSelect: (metric: MetricContent) => void;
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(metric)}
      onKeyDown={(event) => {
        if (event.key === "Enter") onSelect(metric);
      }}
      className="relative cursor-pointer transition-colors hover:bg-muted/50"
    >
      <ChevronRightIcon className="absolute top-4 right-4 size-4 text-muted-foreground" />
      <CardContent className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">{metric.label}</span>
        <span className="text-2xl font-semibold tabular-nums">{metric.cardValue}</span>
        {metric.cardProgressPct !== undefined && <Progress value={metric.cardProgressPct} />}
      </CardContent>
    </Card>
  );
}

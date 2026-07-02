"use client";

import { useMemo, useRef } from "react";
import { AlertTriangleIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MetricComparisonBadge } from "./MetricComparisonBadge";
import { MetricGroundingList } from "./MetricGroundingList";
import { MetricTrendChart } from "./MetricTrendChart";
import type { MetricContent } from "./hooks/metricContent";

export function MetricDetailSheet({
  metric,
  repName,
  open,
  onOpenChange,
}: {
  metric: MetricContent | null;
  repName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // `metric` goes null the instant the Sheet starts closing, but the Sheet
  // itself stays mounted/visible through its ~300ms exit animation. Memoize
  // the last non-null metric so the content doesn't flash to empty mid-close.
  const lastMetricRef = useRef<MetricContent | null>(metric);
  const displayMetric = useMemo(() => {
    if (metric) lastMetricRef.current = metric;
    return metric ?? lastMetricRef.current;
  }, [metric]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className={!isDesktop ? "h-[100dvh] overflow-y-auto" : "overflow-y-auto"}
      >
        <SheetHeader>
          <SheetTitle>{displayMetric?.label ?? "Metric"}</SheetTitle>
          <SheetDescription>{displayMetric?.definition}</SheetDescription>
        </SheetHeader>

        {displayMetric && (
          <div className="flex flex-col gap-6 px-4 pb-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-3xl font-semibold tabular-nums">
                  {displayMetric.topline}
                </span>
                <MetricComparisonBadge comparison={displayMetric.comparison} />
              </div>
              {displayMetric.toplineProgressPct !== undefined && (
                <Progress value={displayMetric.toplineProgressPct} />
              )}
            </div>

            {displayMetric.alert && (
              <Alert>
                <AlertTriangleIcon style={{ color: "var(--color-status-at-risk)" }} />
                <AlertTitle>Stale activity log</AlertTitle>
                <AlertDescription>{displayMetric.alert}</AlertDescription>
              </Alert>
            )}

            <MetricTrendChart
              data={displayMetric.chart.data}
              referenceLabel={displayMetric.chart.referenceLabel}
            />

            <MetricGroundingList title={displayMetric.listTitle} items={displayMetric.list} />

            <p className="text-xs text-muted-foreground">{repName}</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

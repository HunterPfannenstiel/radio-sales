"use client";

import { useState } from "react";
import { DrillDownHeader } from "./DrillDownHeader";
import { MetricDetailSheet } from "./MetricDetailSheet";
import { MetricsGrid } from "./MetricsGrid";
import { useDrillDown } from "./hooks/useDrillDown";
import type { MetricContent } from "./hooks/metricContent";

export function DrillDown({ repId }: { repId: string }) {
  const data = useDrillDown(repId);
  const [selectedMetric, setSelectedMetric] = useState<MetricContent | null>(null);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <DrillDownHeader data={data} />
      <MetricsGrid metrics={data.metrics} onSelect={setSelectedMetric} />

      <MetricDetailSheet
        metric={selectedMetric}
        repName={data.name}
        open={selectedMetric !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedMetric(null);
        }}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PrototypeLayout, PrototypeSection } from "@/app/prototype/PrototypeLayout";
import { DrillDown } from "./DrillDown";
import { DrillDownHeader } from "./DrillDownHeader";
import { MetricCard } from "./MetricCard";
import { MetricDetailSheet } from "./MetricDetailSheet";
import { useDrillDown } from "./hooks/useDrillDown";
import type { MetricContent } from "./hooks/metricContent";

export default function ManagerDashboardV2DrillDownPage() {
  const params = useParams<{ repId: string }>();
  const data = useDrillDown(params.repId);
  const [selectedMetric, setSelectedMetric] = useState<MetricContent | null>(null);

  return (
    <PrototypeLayout feature="Manager Dashboard v2 — Drill-Down" assembled={<DrillDown repId={params.repId} />}>
      <PrototypeSection name="Drill-Down Header">
        <DrillDownHeader data={data} />
      </PrototypeSection>

      <PrototypeSection name="Metric Card">
        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          {data.metrics.map((metric) => (
            <MetricCard key={metric.key} metric={metric} onSelect={setSelectedMetric} />
          ))}
        </div>
      </PrototypeSection>

      <PrototypeSection name="Metric Detail Sheet">
        <MetricDetailSheet
          metric={selectedMetric}
          repName={data.name}
          open={selectedMetric !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedMetric(null);
          }}
        />
      </PrototypeSection>
    </PrototypeLayout>
  );
}

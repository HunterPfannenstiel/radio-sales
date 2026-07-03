"use client";

import { MetricCard } from "./MetricCard";
import type { MetricContent } from "./hooks/metricContent";

export function MetricsGrid({
  metrics,
  onSelect,
}: {
  metrics: MetricContent[];
  onSelect: (metric: MetricContent) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.key} metric={metric} onSelect={onSelect} />
      ))}
    </div>
  );
}

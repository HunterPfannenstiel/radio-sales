"use client";

import { DiagnosticCard } from "./DiagnosticCard";
import type {
  DiagnosticMetric,
  MetricKey,
} from "./hooks/useManagerDrillDown";

export function DiagnosticGrid({
  metrics,
  selectedMetric,
  onSelect,
}: {
  metrics: DiagnosticMetric[];
  selectedMetric: MetricKey | null;
  onSelect: (key: MetricKey) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
      {metrics.map((metric) => (
        <DiagnosticCard
          key={metric.key}
          metric={metric}
          selected={selectedMetric === metric.key}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

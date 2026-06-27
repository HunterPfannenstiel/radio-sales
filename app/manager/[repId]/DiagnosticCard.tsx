"use client";

import { Card } from "@/components/ui/card";
import type { DiagnosticMetric, MetricKey } from "./hooks/useManagerDrillDown";

export function DiagnosticCard({
  metric,
  selected,
  onSelect,
}: {
  metric: DiagnosticMetric;
  selected: boolean;
  onSelect: (key: MetricKey) => void;
}) {
  const isOnTrack = metric.health === "on-track";

  return (
    <Card
      className="flex flex-col gap-3 p-5 cursor-pointer select-none transition-all"
      style={{
        background: "var(--color-surface-card)",
        outline: selected
          ? "2px solid var(--color-accent-primary)"
          : "1px solid var(--color-border-default)",
        outlineOffset: selected ? "2px" : "0px",
      }}
      onClick={() => onSelect(metric.key)}
    >
      <span
        className="text-xs font-mono uppercase tracking-widest"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {metric.label}
      </span>

      <span
        className="font-heading text-3xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {metric.value}
      </span>

      <span
        className="self-start text-xs font-medium px-2 py-0.5 rounded-full"
        style={
          isOnTrack
            ? {
                background: "color-mix(in oklch, var(--color-status-success) 22%, transparent)",
                color: "var(--color-status-success)",
              }
            : {
                background: "color-mix(in oklch, var(--color-destructive) 20%, transparent)",
                color: "var(--color-destructive)",
              }
        }
      >
        {isOnTrack ? "On Track" : "Off Track"}
      </span>
    </Card>
  );
}

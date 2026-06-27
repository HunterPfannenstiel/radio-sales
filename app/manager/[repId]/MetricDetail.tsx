"use client";

import type { MetricKey, MetricDetailData } from "./hooks/useManagerDrillDown";

function DetailStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-xs font-mono uppercase tracking-widest"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label}
      </span>
      <span
        className="font-heading text-4xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {value}
      </span>
    </div>
  );
}

const METRIC_LABELS: Record<MetricKey, string> = {
  activityPace: "Activity Pace",
  asks: "Asks",
  closingRatio: "Closing Ratio",
  avgAccountValue: "Avg Account Value",
};

export function MetricDetail({
  metricKey,
  data,
}: {
  metricKey: MetricKey;
  data: MetricDetailData;
}) {
  return (
    <div
      className="flex flex-col gap-6 p-6 border-t"
      style={{
        background: "var(--color-surface-subtle)",
        borderColor: "var(--color-border-default)",
      }}
    >
      <span
        className="text-xs font-mono uppercase tracking-widest"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {METRIC_LABELS[metricKey]} — Inputs
      </span>

      <div className="flex gap-10">
        {metricKey === "activityPace" && (
          <>
            <DetailStat label="This Month" value={data.activityPace.current} />
            <div
              className="w-px self-stretch"
              style={{ background: "var(--color-border-default)" }}
            />
            <DetailStat label="Expected" value={data.activityPace.expected} />
          </>
        )}

        {metricKey === "asks" && (
          <>
            <DetailStat label="This Week" value={data.asks.actual} />
            <div
              className="w-px self-stretch"
              style={{ background: "var(--color-border-default)" }}
            />
            <DetailStat label="Weekly Target" value={data.asks.weeklyTarget} />
          </>
        )}

        {metricKey === "closingRatio" && (
          <>
            <DetailStat label="Asks" value={data.closingRatio.asks} />
            <div
              className="w-px self-stretch"
              style={{ background: "var(--color-border-default)" }}
            />
            <DetailStat label="Closes" value={data.closingRatio.closes} />
          </>
        )}

        {metricKey === "avgAccountValue" && (
          <>
            <DetailStat
              label="Total Ask Amount"
              value={`$${data.avgAccountValue.totalAskAmount.toLocaleString()}`}
            />
            <div
              className="w-px self-stretch"
              style={{ background: "var(--color-border-default)" }}
            />
            <DetailStat label="Ask Count" value={data.avgAccountValue.askCount} />
          </>
        )}
      </div>
    </div>
  );
}

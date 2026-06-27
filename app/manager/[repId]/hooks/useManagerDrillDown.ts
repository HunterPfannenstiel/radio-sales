"use client";

import { useState } from "react";

export type MetricKey =
  | "activityPace"
  | "asks"
  | "closingRatio"
  | "avgAccountValue";

export type HealthStatus = "on-track" | "off-track";

export type DiagnosticMetric = {
  key: MetricKey;
  label: string;
  value: string;
  health: HealthStatus;
};

export type RepDrillDownData = {
  repName: string;
  currentAmount: number;
  targetAmount: number;
  metrics: DiagnosticMetric[];
};

export type MetricDetailData = {
  activityPace: { current: number; expected: number };
  asks: { actual: number; weeklyTarget: number };
  closingRatio: { asks: number; closes: number };
  avgAccountValue: { totalAskAmount: number; askCount: number };
};

const mockData: RepDrillDownData = {
  repName: "Sarah Mitchell",
  currentAmount: 48_200,
  targetAmount: 72_000,
  metrics: [
    {
      key: "activityPace",
      label: "Activity Pace",
      value: "14 / mo",
      health: "off-track",
    },
    {
      key: "asks",
      label: "Asks",
      value: "3 / wk",
      health: "off-track",
    },
    {
      key: "closingRatio",
      label: "Closing Ratio",
      value: "22%",
      health: "on-track",
    },
    {
      key: "avgAccountValue",
      label: "Avg Account Value",
      value: "$2,400",
      health: "off-track",
    },
  ],
};

export const mockDetailData: MetricDetailData = {
  activityPace: { current: 14, expected: 22 },
  asks: { actual: 3, weeklyTarget: 5 },
  closingRatio: { asks: 18, closes: 4 },
  avgAccountValue: { totalAskAmount: 43_200, askCount: 18 },
};

export function useManagerDrillDown() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey | null>(null);

  function selectMetric(key: MetricKey) {
    setSelectedMetric((prev) => (prev === key ? null : key));
  }

  function closeDetail() {
    setSelectedMetric(null);
  }

  return {
    data: mockData,
    detailData: mockDetailData,
    selectedMetric,
    selectMetric,
    closeDetail,
  };
}

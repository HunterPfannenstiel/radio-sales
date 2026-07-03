"use client";

import { useMemo } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ChartPoint } from "./hooks/metricContent";

export function MetricTrendChart({
  data,
  referenceLabel,
}: {
  data: ChartPoint[];
  referenceLabel?: string;
}) {
  const hasReference = data.some((point) => point.reference !== undefined);

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      value: { label: "Value", color: "var(--chart-1)" },
      ...(hasReference
        ? { reference: { label: referenceLabel ?? "Reference", color: "var(--muted-foreground)" } }
        : {}),
    }),
    [hasReference, referenceLabel]
  );

  return (
    <div className="flex flex-col gap-2">
      <ChartContainer config={chartConfig} className="aspect-auto h-40 w-full">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={11} />
          <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
          <ChartTooltip
            cursor={{ fill: "var(--muted)" }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} maxBarSize={24} />
          {hasReference && (
            <Line
              dataKey="reference"
              stroke="var(--color-reference)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
            />
          )}
        </ComposedChart>
      </ChartContainer>

      {hasReference && referenceLabel && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block h-0 w-3 border-t-2 border-dashed border-muted-foreground" />
          {referenceLabel}
        </div>
      )}
    </div>
  );
}

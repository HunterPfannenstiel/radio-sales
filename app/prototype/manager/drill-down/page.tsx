"use client";

import { PrototypeLayout, PrototypeSection } from "@/app/prototype/PrototypeLayout";
import { ManagerDrillDown } from "@/app/manager/[repId]/ManagerDrillDown";
import { DrillDownHeader } from "@/app/manager/[repId]/DrillDownHeader";
import { SummaryBlock } from "@/app/manager/[repId]/SummaryBlock";
import { DiagnosticCard } from "@/app/manager/[repId]/DiagnosticCard";
import { DiagnosticGrid } from "@/app/manager/[repId]/DiagnosticGrid";
import { MetricDetail } from "@/app/manager/[repId]/MetricDetail";
import { mockDetailData } from "@/app/manager/[repId]/hooks/useManagerDrillDown";

const SAMPLE_ON_TRACK = {
  key: "closingRatio" as const,
  label: "Closing Ratio",
  value: "22%",
  health: "on-track" as const,
};

const SAMPLE_OFF_TRACK = {
  key: "activityPace" as const,
  label: "Activity Pace",
  value: "14 / mo",
  health: "off-track" as const,
};

const ALL_METRICS = [
  SAMPLE_OFF_TRACK,
  { key: "asks" as const, label: "Asks", value: "3 / wk", health: "off-track" as const },
  SAMPLE_ON_TRACK,
  { key: "avgAccountValue" as const, label: "Avg Account Value", value: "$2,400", health: "off-track" as const },
];

export default function ManagerDrillDownPrototypePage() {
  return (
    <PrototypeLayout
      feature="Manager Drill-Down"
      assembled={<ManagerDrillDown />}
    >
      <PrototypeSection name="Drill-Down Header">
        <div className="border rounded-lg overflow-hidden">
          <DrillDownHeader repName="Sarah Mitchell" />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Summary Block">
        <div className="border rounded-lg overflow-hidden">
          <SummaryBlock currentAmount={48_200} targetAmount={72_000} />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Diagnostic Card">
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col gap-1 w-44">
            <span className="text-xs text-muted-foreground">On Track</span>
            <DiagnosticCard
              metric={SAMPLE_ON_TRACK}
              selected={false}
              onSelect={() => {}}
            />
          </div>
          <div className="flex flex-col gap-1 w-44">
            <span className="text-xs text-muted-foreground">Off Track</span>
            <DiagnosticCard
              metric={SAMPLE_OFF_TRACK}
              selected={false}
              onSelect={() => {}}
            />
          </div>
          <div className="flex flex-col gap-1 w-44">
            <span className="text-xs text-muted-foreground">Selected</span>
            <DiagnosticCard
              metric={SAMPLE_ON_TRACK}
              selected={true}
              onSelect={() => {}}
            />
          </div>
        </div>
      </PrototypeSection>

      <PrototypeSection name="Diagnostic Grid">
        <div className="border rounded-lg overflow-hidden max-w-sm">
          <DiagnosticGrid
            metrics={ALL_METRICS}
            selectedMetric={null}
            onSelect={() => {}}
          />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Metric Detail — Activity Pace">
        <div className="border rounded-lg overflow-hidden">
          <MetricDetail metricKey="activityPace" data={mockDetailData} />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Metric Detail — Asks">
        <div className="border rounded-lg overflow-hidden">
          <MetricDetail metricKey="asks" data={mockDetailData} />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Metric Detail — Closing Ratio">
        <div className="border rounded-lg overflow-hidden">
          <MetricDetail metricKey="closingRatio" data={mockDetailData} />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Metric Detail — Avg Account Value">
        <div className="border rounded-lg overflow-hidden">
          <MetricDetail metricKey="avgAccountValue" data={mockDetailData} />
        </div>
      </PrototypeSection>
    </PrototypeLayout>
  );
}

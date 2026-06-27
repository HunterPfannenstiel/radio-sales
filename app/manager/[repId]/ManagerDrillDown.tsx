"use client";

import { useManagerDrillDown } from "./hooks/useManagerDrillDown";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DrillDownHeader } from "./DrillDownHeader";
import { SummaryBlock } from "./SummaryBlock";
import { DiagnosticGrid } from "./DiagnosticGrid";
import { MetricDetail } from "./MetricDetail";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

export function ManagerDrillDown() {
  const { data, detailData, selectedMetric, selectMetric, closeDetail } =
    useManagerDrillDown();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: "var(--color-surface-page)" }}
    >
      <DrillDownHeader repName={data.repName} />

      <SummaryBlock
        currentAmount={data.currentAmount}
        targetAmount={data.targetAmount}
      />

      <DiagnosticGrid
        metrics={data.metrics}
        selectedMetric={selectedMetric}
        onSelect={selectMetric}
      />

      <Drawer
        open={selectedMetric !== null}
        onOpenChange={(open) => { if (!open) closeDetail(); }}
        direction={isDesktop ? "right" : "bottom"}
      >
        <DrawerContent
          className={isDesktop ? "md:rounded-l-[var(--radius-xl)] overflow-hidden" : undefined}
          style={{ background: "var(--color-surface-subtle)" }}
        >
          {selectedMetric !== null && (
            <MetricDetail metricKey={selectedMetric} data={detailData} />
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

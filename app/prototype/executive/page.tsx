import { PrototypeLayout, PrototypeSection } from "@/app/prototype/PrototypeLayout";
import { ExecDashboard } from "./ExecDashboard";
import { VuMeter } from "./VuMeter";

export default function ExecutiveDashboardPrototypePage() {
  return (
    <PrototypeLayout
      feature="Executive Dashboard"
      assembled={<ExecDashboard />}
    >
      <PrototypeSection name="VU Meter">
        <div className="flex flex-col gap-4 max-w-sm">
          {[0.31, 0.52, 0.78, 1.02].map((ratio) => (
            <div key={ratio} className="flex flex-col gap-1">
              <span
                className="text-xs"
                style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-family-base)" }}
              >
                {Math.round(ratio * 100)}% to goal
              </span>
              <VuMeter ratio={ratio} />
            </div>
          ))}
        </div>
      </PrototypeSection>
    </PrototypeLayout>
  );
}

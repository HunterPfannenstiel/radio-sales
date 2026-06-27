"use client";

import { useState } from "react";
import { PrototypeLayout, PrototypeSection } from "@/app/prototype/PrototypeLayout";
import { GoalSetting } from "@/app/manager/goal-setting/GoalSetting";
import { GoalPanel } from "@/app/manager/goal-setting/GoalPanel";
import { GoalField } from "@/app/manager/goal-setting/GoalField";

export default function ManagerGoalSettingPrototypePage() {
  const [activeField, setActiveField] = useState<string | null>(null);

  return (
    <PrototypeLayout
      feature="Manager Goal Setting"
      assembled={<GoalSetting />}
    >
      <PrototypeSection name="Goal Panel">
        <div className="max-w-sm">
          <GoalPanel />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Goal Field — Read">
        <div className="max-w-sm border rounded-xl px-6">
          <GoalField
            label="Monthly Goal"
            value={80_000}
            originalValue={80_000}
            isActive={false}
            onActivate={() => {}}
            onDeactivate={() => {}}
            onChange={() => {}}
            prefix="$"
          />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Goal Field — Active">
        <div className="max-w-sm border rounded-xl px-6">
          <GoalField
            label="Monthly Goal"
            value={80_000}
            originalValue={75_000}
            isActive={activeField === "demo"}
            onActivate={() => setActiveField("demo")}
            onDeactivate={() => setActiveField(null)}
            onChange={() => {}}
            prefix="$"
          />
        </div>
      </PrototypeSection>
    </PrototypeLayout>
  );
}

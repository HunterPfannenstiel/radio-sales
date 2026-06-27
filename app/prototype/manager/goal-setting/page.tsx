"use client";

import { PrototypeLayout, PrototypeSection } from "@/app/prototype/PrototypeLayout";
import { GoalSetting } from "@/app/manager/goal-setting/GoalSetting";
import { GoalPanel } from "@/app/manager/goal-setting/GoalPanel";
import { GoalField } from "@/app/manager/goal-setting/GoalField";

export default function ManagerGoalSettingPrototypePage() {
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

      <PrototypeSection name="Goal Field">
        <div className="max-w-sm border rounded-xl px-6">
          <GoalField
            label="Monthly Goal"
            value={80_000}
            originalValue={75_000}
            onChange={() => {}}
            prefix="$"
          />
        </div>
      </PrototypeSection>
    </PrototypeLayout>
  );
}

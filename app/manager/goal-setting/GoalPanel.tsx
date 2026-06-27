"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoalField } from "./GoalField";
import { useGoalPanel } from "./hooks/useGoalPanel";

export function GoalPanel() {
  const { saved, draft, isDirty, activeField, activateField, deactivateField, updateDraft, save, reset } = useGoalPanel();

  return (
    <div className="flex flex-col">
      <div className="flex justify-end gap-2 min-h-8 mb-2">
        {isDirty && (
          <>
            <Button size="sm" onClick={save} style={{ backgroundColor: "var(--color-status-success)" }}>Save</Button>
            <Button size="sm" variant="outline" onClick={reset}>Reset</Button>
          </>
        )}
      </div>

      <p className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground pb-1">
        Sales Goals
      </p>
      <GoalField
        label="Monthly Goal"
        value={draft.monthlyGoal}
        originalValue={saved.monthlyGoal}
        isActive={activeField === "monthlyGoal"}
        onActivate={() => activateField("monthlyGoal")}
        onDeactivate={deactivateField}
        onChange={(raw) => updateDraft("monthlyGoal", raw)}
        prefix="$"
      />
      <Separator />

      <p className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground pt-4 pb-1">
        Activity Targets
      </p>
      <GoalField
        label="Weekly Calls"
        value={draft.weeklyCalls}
        originalValue={saved.weeklyCalls}
        isActive={activeField === "weeklyCalls"}
        onActivate={() => activateField("weeklyCalls")}
        onDeactivate={deactivateField}
        onChange={(raw) => updateDraft("weeklyCalls", raw)}
      />
      <Separator />
      <GoalField
        label="Weekly Asks"
        value={draft.weeklyAsks}
        originalValue={saved.weeklyAsks}
        isActive={activeField === "weeklyAsks"}
        onActivate={() => activateField("weeklyAsks")}
        onDeactivate={deactivateField}
        onChange={(raw) => updateDraft("weeklyAsks", raw)}
      />
    </div>
  );
}

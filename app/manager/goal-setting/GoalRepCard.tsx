"use client";

import { PencilIcon, PhoneIcon, TargetIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CadenceField } from "./CadenceField";
import { GoalStat } from "./GoalStat";
import { MonthlyGoalField } from "./MonthlyGoalField";
import { fmtCurrency, initials } from "./format";
import { useEditableGoal } from "./hooks/useEditableGoal";
import type { GoalRep } from "./hooks/mockGoalReps";
import type { GoalValues } from "./hooks/useGoalRoster";

export function GoalRepCard({
  rep,
  onSave,
}: {
  rep: GoalRep;
  onSave: (id: string, values: GoalValues) => void;
}) {
  const editable = useEditableGoal(rep, onSave);

  return (
    <Card className={cn(editable.isEditing && "ring-2 ring-primary")}>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar size="lg">
              <AvatarFallback>{initials(rep.name)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{rep.name}</span>
          </div>
          {!editable.isEditing && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit ${rep.name}'s goals`}
              onClick={editable.startEdit}
            >
              <PencilIcon />
            </Button>
          )}
        </div>

        {editable.isEditing ? (
          <>
            <MonthlyGoalField
              value={editable.monthlyGoal}
              onChange={editable.setMonthlyGoal}
              error={editable.errors.monthlyGoal}
              large
            />
            <div className="grid grid-cols-2 gap-3">
              <CadenceField
                icon={PhoneIcon}
                label="Calls per week"
                value={editable.callsPerWeek}
                onChange={editable.setCallsPerWeek}
                error={editable.errors.callsPerWeek}
              />
              <CadenceField
                icon={TargetIcon}
                label="Asks per week"
                value={editable.asksPerWeek}
                onChange={editable.setAsksPerWeek}
                error={editable.errors.asksPerWeek}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={editable.cancel}>
                Cancel
              </Button>
              <Button onClick={editable.save}>Save</Button>
            </div>
          </>
        ) : (
          <>
            <GoalStat label="Monthly Goal" value={fmtCurrency(rep.monthlyGoal)} size="lg" />
            <div className="grid grid-cols-2 gap-3">
              <GoalStat label="Calls/Week" value={String(rep.callsPerWeek)} />
              <GoalStat label="Asks/Week" value={String(rep.asksPerWeek)} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

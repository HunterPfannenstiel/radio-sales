"use client";

import { CheckIcon, PencilIcon, PhoneIcon, TargetIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CadenceField } from "./CadenceField";
import { MonthlyGoalField } from "./MonthlyGoalField";
import { fmtCurrency, initials } from "./format";
import { useEditableGoal } from "./hooks/useEditableGoal";
import type { GoalRep } from "./hooks/mockGoalReps";
import type { GoalValues } from "./hooks/useGoalRoster";

export function GoalRepTableRow({
  rep,
  onSave,
}: {
  rep: GoalRep;
  onSave: (id: string, values: GoalValues) => void;
}) {
  const editable = useEditableGoal(rep, onSave);

  return (
    <TableRow className={cn(editable.isEditing && "bg-muted/30")}>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar size="lg">
            <AvatarFallback>{initials(rep.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{rep.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        {editable.isEditing ? (
          <MonthlyGoalField
            value={editable.monthlyGoal}
            onChange={editable.setMonthlyGoal}
            error={editable.errors.monthlyGoal}
          />
        ) : (
          fmtCurrency(rep.monthlyGoal)
        )}
      </TableCell>
      <TableCell className="text-right">
        {editable.isEditing ? (
          <CadenceField
            icon={PhoneIcon}
            label="Calls per week"
            value={editable.callsPerWeek}
            onChange={editable.setCallsPerWeek}
            error={editable.errors.callsPerWeek}
          />
        ) : (
          rep.callsPerWeek
        )}
      </TableCell>
      <TableCell className="text-right">
        {editable.isEditing ? (
          <CadenceField
            icon={TargetIcon}
            label="Asks per week"
            value={editable.asksPerWeek}
            onChange={editable.setAsksPerWeek}
            error={editable.errors.asksPerWeek}
          />
        ) : (
          rep.asksPerWeek
        )}
      </TableCell>
      <TableCell>
        {editable.isEditing ? (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Save ${rep.name}'s goals`}
              onClick={editable.save}
            >
              <CheckIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cancel editing"
              onClick={editable.cancel}
            >
              <XIcon />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit ${rep.name}'s goals`}
            onClick={editable.startEdit}
          >
            <PencilIcon />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

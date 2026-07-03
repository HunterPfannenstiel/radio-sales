"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { GoalRep } from "./mockGoalReps";
import type { GoalValues } from "./useGoalRoster";

type FieldErrors = Partial<Record<keyof GoalValues, string>>;

export function useEditableGoal(
  rep: GoalRep,
  onSave: (id: string, values: GoalValues) => void
) {
  const [isEditing, setIsEditing] = useState(false);
  const [monthlyGoal, setMonthlyGoal] = useState(String(rep.monthlyGoal));
  const [callsPerWeek, setCallsPerWeek] = useState(String(rep.callsPerWeek));
  const [asksPerWeek, setAsksPerWeek] = useState(String(rep.asksPerWeek));
  const [errors, setErrors] = useState<FieldErrors>({});

  function startEdit() {
    setMonthlyGoal(String(rep.monthlyGoal));
    setCallsPerWeek(String(rep.callsPerWeek));
    setAsksPerWeek(String(rep.asksPerWeek));
    setErrors({});
    setIsEditing(true);
  }

  function cancel() {
    setErrors({});
    setIsEditing(false);
  }

  function save() {
    const goalValue = Number(monthlyGoal);
    const callsValue = Number(callsPerWeek);
    const asksValue = Number(asksPerWeek);

    const nextErrors: FieldErrors = {};
    if (!monthlyGoal.trim() || Number.isNaN(goalValue) || goalValue <= 0) {
      nextErrors.monthlyGoal = "Enter a goal greater than $0.";
    }
    if (
      !callsPerWeek.trim() ||
      Number.isNaN(callsValue) ||
      callsValue < 0 ||
      !Number.isInteger(callsValue)
    ) {
      nextErrors.callsPerWeek = "Enter a whole number of calls.";
    }
    if (
      !asksPerWeek.trim() ||
      Number.isNaN(asksValue) ||
      asksValue < 0 ||
      !Number.isInteger(asksValue)
    ) {
      nextErrors.asksPerWeek = "Enter a whole number of asks.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave(rep.id, {
      monthlyGoal: goalValue,
      callsPerWeek: callsValue,
      asksPerWeek: asksValue,
    });
    setErrors({});
    setIsEditing(false);
    toast.success(`${rep.name.split(" ")[0]}'s goals updated`);
  }

  return {
    isEditing,
    monthlyGoal,
    callsPerWeek,
    asksPerWeek,
    errors,
    setMonthlyGoal,
    setCallsPerWeek,
    setAsksPerWeek,
    startEdit,
    cancel,
    save,
  };
}

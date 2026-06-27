"use client";

import { useState } from "react";

interface GoalValues {
  monthlyGoal: number;
  weeklyCalls: number;
  weeklyAsks: number;
}

const INITIAL: GoalValues = { monthlyGoal: 80_000, weeklyCalls: 45, weeklyAsks: 20 };

export function useGoalPanel() {
  const [saved, setSaved] = useState<GoalValues>(INITIAL);
  const [draft, setDraft] = useState<GoalValues>(INITIAL);

  const isDirty =
    saved.monthlyGoal !== draft.monthlyGoal ||
    saved.weeklyCalls !== draft.weeklyCalls ||
    saved.weeklyAsks !== draft.weeklyAsks;

  function updateDraft(field: keyof GoalValues, raw: string) {
    const n = parseInt(raw.replace(/\D/g, ""), 10);
    setDraft((prev) => ({ ...prev, [field]: isNaN(n) ? 0 : n }));
  }

  function save() {
    setSaved(draft);
  }

  function reset() {
    setDraft(saved);
  }

  return { saved, draft, isDirty, updateDraft, save, reset };
}

"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useFetch } from "@/hooks/useFetch"
import { useRequest } from "@/hooks/useRequest"

type GoalsData = {
  monthlyGoalAmount: number
  weeklyCallTarget: number
  weeklyAskTarget: number
} | null

function sanitizeDigits(value: string): string {
  return value.replace(/[^0-9]/g, "")
}

export function useGoalsForm() {
  const { data, initialLoading } = useFetch<GoalsData>("/api/goals")
  const { execute, loading: saving, error } = useRequest()

  const [monthlySalesGoal, setMonthlySalesGoal] = useState("")
  const [weeklyAsks, setWeeklyAsks] = useState("")
  const [weeklyCalls, setWeeklyCalls] = useState("")

  useEffect(() => {
    if (!data) return
    setMonthlySalesGoal(String(data.monthlyGoalAmount))
    setWeeklyAsks(String(data.weeklyAskTarget))
    setWeeklyCalls(String(data.weeklyCallTarget))
  }, [data])

  function handleMonthlySalesGoalChange(value: string) {
    setMonthlySalesGoal(sanitizeDigits(value))
  }

  function handleWeeklyAsksChange(value: string) {
    setWeeklyAsks(sanitizeDigits(value))
  }

  function handleWeeklyCallsChange(value: string) {
    setWeeklyCalls(sanitizeDigits(value))
  }

  async function handleSave() {
    const result = await execute(
      "/api/goals",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyGoalAmount: Number(monthlySalesGoal),
          weeklyCallTarget: Number(weeklyCalls),
          weeklyAskTarget: Number(weeklyAsks),
        }),
      },
      { toastOnError: false }
    )

    if (result !== null) {
      toast.success("Goals updated")
    }
  }

  return {
    monthlySalesGoal,
    weeklyAsks,
    weeklyCalls,
    loading: initialLoading,
    saving,
    error,
    handleMonthlySalesGoalChange,
    handleWeeklyAsksChange,
    handleWeeklyCallsChange,
    handleSave,
  }
}

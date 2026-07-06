"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useGoalsForm } from "./hooks/useGoalsForm"

export function GoalsForm() {
  const {
    monthlySalesGoal,
    weeklyAsks,
    weeklyCalls,
    loading,
    saving,
    error,
    handleMonthlySalesGoalChange,
    handleWeeklyAsksChange,
    handleWeeklyCallsChange,
    handleSave,
  } = useGoalsForm()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          My Goals
          <Badge variant="secondary">Beta Only</Badge>
        </CardTitle>
        <CardDescription>
          Goal setting is in beta — changes here are for your reference only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="monthly-sales-goal">Monthly Sales Goal</FieldLabel>
            <InputGroup>
              <InputGroupAddon>$</InputGroupAddon>
              <InputGroupInput
                id="monthly-sales-goal"
                inputMode="numeric"
                value={monthlySalesGoal}
                onChange={(e) => handleMonthlySalesGoalChange(e.target.value)}
                disabled={loading}
              />
            </InputGroup>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="weekly-asks">Weekly Asks</FieldLabel>
              <Input
                id="weekly-asks"
                inputMode="numeric"
                value={weeklyAsks}
                onChange={(e) => handleWeeklyAsksChange(e.target.value)}
                disabled={loading}
              />
              <FieldDescription>per week</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="weekly-calls">Weekly Calls</FieldLabel>
              <Input
                id="weekly-calls"
                inputMode="numeric"
                value={weeklyCalls}
                onChange={(e) => handleWeeklyCallsChange(e.target.value)}
                disabled={loading}
              />
              <FieldDescription>per week</FieldDescription>
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-col items-end gap-2">
        <Button onClick={handleSave} disabled={loading || saving}>
          {saving ? (
            <>
              <Spinner />
              Saving…
            </>
          ) : (
            "Save Goals"
          )}
        </Button>
        {error && (
          <p style={{ fontSize: "var(--font-size-body)", color: "var(--color-status-warning)" }}>
            {error}
          </p>
        )}
      </CardFooter>
    </Card>
  )
}

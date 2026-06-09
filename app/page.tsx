"use client"

import React, { useState, useCallback } from "react"
import { PhoneCall, Target, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useQuickLog } from "@/components/QuickLogContext"
import { useFetch } from "@/hooks/useFetch"
import { PeriodNavigator } from "@/components/PeriodNavigator"

// ---------------------------------------------------------------------------
// Dashboard data type (mirrors DashboardDTO from server/queries/DashboardQuery)
// ---------------------------------------------------------------------------

type DashboardData = {
  moneyPace: {
    soldAmount: number
    projectedAmount: number
    goalAmount: number
    soldPercent: number
    paceStatus: "ahead" | "on_pace" | "behind" | "goal_reached"
  }
  calls: { count: number; target: number; paceStatus: "on_pace" | "behind" }
  asks: { count: number; target: number; paceStatus: "on_pace" | "behind" }
  daysRemainingInWeek: number
  weekNumber: number
}

type PaceStatus = "ahead" | "on_pace" | "behind" | "goal_reached"
type ActivityPaceStatus = "on_pace" | "behind"

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)
}

/** Returns { year, month (0-based), week } for the ISO week number */
function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

/** Returns the Monday date of a given ISO week number + year */
function getMondayOfWeek(year: number, week: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayOfWeek = jan4.getUTCDay() || 7
  const firstMonday = new Date(jan4)
  firstMonday.setUTCDate(jan4.getUTCDate() + (1 - dayOfWeek))
  const monday = new Date(firstMonday)
  monday.setUTCDate(firstMonday.getUTCDate() + (week - 1) * 7)
  return monday
}

function paceStatusToColor(status: PaceStatus): string {
  switch (status) {
    case "ahead":
      return "var(--color-status-success)"
    case "on_pace":
      return "var(--color-status-info)"
    case "behind":
      return "var(--color-status-warning)"
    case "goal_reached":
      return "var(--color-status-achieved)"
  }
}

function activityStatusToColor(status: ActivityPaceStatus): string {
  return status === "on_pace"
    ? "var(--color-status-success)"
    : "var(--color-status-warning)"
}

function paceStatusLabel(status: PaceStatus): string {
  switch (status) {
    case "ahead":
      return "Ahead"
    case "on_pace":
      return "On Pace"
    case "behind":
      return "Behind"
    case "goal_reached":
      return "Goal Reached"
  }
}

// ---------------------------------------------------------------------------
// LevelMeter
// ---------------------------------------------------------------------------

function LevelMeter({ ratio, color }: { ratio: number; color: string }) {
  const SEGMENTS = 20
  const filled = Math.round(ratio * SEGMENTS)
  return (
    <div className="flex gap-px w-full">
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <div
          key={i}
          className="flex-1"
          style={{
            height: "10px",
            background: i < filled ? color : "var(--color-surface-subtle)",
          }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// MoneyPaceCard
// ---------------------------------------------------------------------------

interface MoneyPaceCardProps {
  monthLabel: string
  soldAmount: number
  projectedAmount: number
  goalAmount: number
  soldPercent: number
  paceStatus: PaceStatus
}

function MoneyPaceCard({
  monthLabel,
  soldAmount,
  projectedAmount,
  goalAmount,
  soldPercent,
  paceStatus,
}: MoneyPaceCardProps) {
  const statusColor = paceStatusToColor(paceStatus)
  const gap = goalAmount - soldAmount
  const goalReached = soldPercent >= 100

  // Empty state — no goal set
  if (goalAmount === 0) {
    return (
      <div
        className="w-full rounded-[--radius-card] border p-6 flex flex-col items-center gap-3 text-center"
        style={{
          background: "var(--color-surface-card)",
          borderColor: "var(--color-border-default)",
        }}
      >
        <TrendingUp
          style={{
            width: "var(--icon-size-xl)",
            height: "var(--icon-size-xl)",
            color: "var(--color-text-disabled)",
          }}
        />
        <h3
          className="font-bold"
          style={{ fontSize: "var(--font-size-h3)", color: "var(--color-text-primary)" }}
        >
          No goal set yet
        </h3>
        <p style={{ fontSize: "var(--font-size-body)", color: "var(--color-text-secondary)" }}>
          Your manager will set your monthly sales goal.
        </p>
      </div>
    )
  }

  const meterColor = goalReached
    ? "var(--color-status-achieved)"
    : statusColor
  const heroColor = goalReached
    ? "var(--color-status-achieved)"
    : statusColor

  return (
    <div
      className={`w-full rounded-[--radius-card] p-5 flex flex-col gap-4${goalReached ? " goal-reached-pulse" : ""}`}
      style={{
        background: "var(--color-surface-card)",
        borderLeft: "4px solid var(--color-accent-primary)",
        boxShadow: "0 0 0 1px var(--color-border-default)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h3
          className="font-bold"
          style={{ fontSize: "var(--font-size-h3)", color: "var(--color-text-primary)" }}
        >
          Money Pace · {monthLabel}
        </h3>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
          style={{
            background: statusColor,
            color: "var(--color-text-inverse)",
            fontSize: "var(--font-size-small)",
          }}
        >
          {paceStatusLabel(paceStatus)}
        </span>
      </div>

      {/* Primary number */}
      <div className="flex flex-col gap-0.5">
        <span
          className="font-bold leading-none"
          style={{ fontSize: "var(--font-size-hero)", color: heroColor }}
        >
          {soldPercent}%
        </span>
        <span
          style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)" }}
        >
          Sold to Goal
        </span>
      </div>

      {/* Level meter */}
      <LevelMeter ratio={Math.min(soldPercent / 100, 1)} color={meterColor} />

      {/* Supporting figures */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span
            className="font-medium"
            style={{ fontSize: "var(--font-size-body)", color: "var(--color-text-primary)" }}
          >
            Sold {formatCurrency(soldAmount)}/mo
            <span style={{ color: "var(--color-text-secondary)" }}>
              {" "}· Projected {formatCurrency(projectedAmount)}
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span
            className="font-medium"
            style={{ fontSize: "var(--font-size-body)", color: "var(--color-text-primary)" }}
          >
            Goal {formatCurrency(goalAmount)}/mo
            <span
              style={{
                color: goalReached ? "var(--color-status-achieved)" : "var(--color-text-secondary)",
              }}
            >
              {goalReached
                ? " · Goal reached"
                : ` · Gap −${formatCurrency(gap)} to goal`}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ActivityCard
// ---------------------------------------------------------------------------

interface ActivityCardProps {
  type: "calls" | "asks"
  count: number
  target: number
  paceStatus: ActivityPaceStatus
  weekNumber: number
  daysRemaining: number
}

function ActivityCard({
  type,
  count,
  target,
  paceStatus,
  weekNumber,
  daysRemaining,
}: ActivityCardProps) {
  const label = type === "calls" ? "Calls" : "Asks"
  const statusColor = activityStatusToColor(paceStatus)
  const ratio = target > 0 ? Math.min(count / target, 1) : 0

  // Empty state — no targets set
  if (target === 0) {
    return (
      <div
        className="flex-1 rounded-[--radius-card] border p-5 flex flex-col items-center gap-2 text-center"
        style={{
          background: "var(--color-surface-card)",
          borderColor: "var(--color-border-default)",
        }}
      >
        <Target
          style={{
            width: "var(--icon-size-xl)",
            height: "var(--icon-size-xl)",
            color: "var(--color-text-disabled)",
            strokeWidth: 2.5,
          }}
        />
        <h3
          className="font-bold"
          style={{ fontSize: "var(--font-size-h3)", color: "var(--color-text-primary)" }}
        >
          No targets set yet
        </h3>
        <p style={{ fontSize: "var(--font-size-body)", color: "var(--color-text-secondary)" }}>
          Your manager will set your weekly call and ask targets.
        </p>
      </div>
    )
  }

  // "Not started" badge state — target set but no activity logged
  const notStarted = count === 0

  // Weekday progress dots — 5 dots Mon–Fri
  // elapsed = 5 - daysRemaining (clamped to [0, 5])
  const elapsed = Math.min(5, Math.max(0, 5 - daysRemaining))
  const dots = Array.from({ length: 5 }, (_, i) => i < elapsed ? "●" : "○")

  const footerText = daysRemaining <= 0 ? "Week complete" : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`

  return (
    <div
      className="flex-1 rounded-[--radius-card] border p-5 flex flex-col gap-4"
      style={{
        background: "var(--color-surface-card)",
        borderColor: "var(--color-border-default)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h3
          className="font-bold"
          style={{ fontSize: "var(--font-size-h3)", color: "var(--color-text-primary)" }}
        >
          {label} · Week {weekNumber}
        </h3>
        {notStarted ? (
          <span
            className="shrink-0"
            style={{
              fontSize: "var(--font-size-small)",
              color: "var(--color-text-secondary)",
            }}
          >
            Not started
          </span>
        ) : (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
            style={{
              background: statusColor,
              color: "var(--color-text-inverse)",
              fontSize: "var(--font-size-small)",
            }}
          >
            {paceStatus === "on_pace" ? "On Pace" : "Behind"}
          </span>
        )}
      </div>

      {/* Primary figures */}
      <div className="flex items-baseline gap-1">
        <span
          className="font-bold leading-none"
          style={{ fontSize: "var(--font-size-h1)", color: statusColor }}
        >
          {count}
        </span>
        <span style={{ fontSize: "var(--font-size-h2)", color: "var(--color-text-secondary)" }}>
          / {target}
        </span>
      </div>
      <span
        style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)", marginTop: "-0.75rem" }}
      >
        this week
      </span>

      {/* Level meter */}
      <LevelMeter ratio={ratio} color={statusColor} />

      {/* Weekday progress dots */}
      <div
        className="flex items-center"
        style={{ gap: "var(--spacing-xs)" }}
      >
        {dots.map((dot, i) => (
          <span
            key={i}
            style={{
              fontSize: "var(--font-size-small)",
              color: i < elapsed ? statusColor : "var(--color-text-disabled)",
              lineHeight: 1,
            }}
          >
            {dot}
          </span>
        ))}
      </div>

      {/* Footer */}
      <span
        style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)" }}
      >
        {footerText}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ActivityPaceSection
// ---------------------------------------------------------------------------

interface ActivityPaceSectionProps {
  calls: DashboardData["calls"]
  asks: DashboardData["asks"]
  weekNumber: number
  daysRemainingInWeek: number
}

function ActivityPaceSection({
  calls,
  asks,
  weekNumber,
  daysRemainingInWeek,
}: ActivityPaceSectionProps) {
  const { open } = useQuickLog()
  const hasActivity = calls.count > 0 || asks.count > 0
  const hasTargets = calls.target > 0 || asks.target > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <ActivityCard
          type="calls"
          count={calls.count}
          target={calls.target}
          paceStatus={calls.paceStatus}
          weekNumber={weekNumber}
          daysRemaining={daysRemainingInWeek}
        />
        <ActivityCard
          type="asks"
          count={asks.count}
          target={asks.target}
          paceStatus={asks.paceStatus}
          weekNumber={weekNumber}
          daysRemaining={daysRemainingInWeek}
        />
      </div>

      {/* First-activity CTA — only shown when goals are set but no activity yet */}
      {hasTargets && !hasActivity && (
        <div
          className="flex flex-col items-center gap-3 py-4 text-center"
        >
          <p style={{ fontSize: "var(--font-size-body)", color: "var(--color-text-secondary)" }}>
            Log your first call to start tracking your pace.
          </p>
          <Button onClick={() => open()}>
            <PhoneCall data-icon="inline-start" />
            Log a call
          </Button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// DashboardPage
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const today = new Date()

  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedWeekYear, setSelectedWeekYear] = useState(today.getFullYear())
  const [selectedWeek, setSelectedWeek] = useState(getISOWeekNumber(today))

  const handleMonthChange = useCallback((year: number, month: number) => {
    setSelectedYear(year)
    setSelectedMonth(month)
    const firstDay = new Date(year, month, 1)
    const firstWeek = getISOWeekNumber(firstDay)
    setSelectedWeekYear(firstDay.getFullYear())
    setSelectedWeek(firstWeek)
  }, [])

  const handleWeekChange = useCallback((weekYear: number, week: number) => {
    setSelectedWeekYear(weekYear)
    setSelectedWeek(week)
    const monday = getMondayOfWeek(weekYear, week)
    const thursday = new Date(monday)
    thursday.setUTCDate(monday.getUTCDate() + 3)
    setSelectedYear(thursday.getUTCFullYear())
    setSelectedMonth(thursday.getUTCMonth())
  }, [])

  const monthParam = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`
  const apiUrl = `/api/dashboard?month=${monthParam}&weekYear=${selectedWeekYear}&weekNumber=${selectedWeek}`
  const { data, loading, error } = useFetch<DashboardData>(apiUrl)

  const monthLabel = new Date(selectedYear, selectedMonth, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <h1
        className="font-bold tracking-tight"
        style={{ fontSize: "var(--font-size-h2)", color: "var(--color-text-primary)" }}
      >
        My Dashboard
      </h1>

      <PeriodNavigator
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedWeek={selectedWeek}
        selectedWeekYear={selectedWeekYear}
        onMonthChange={handleMonthChange}
        onWeekChange={handleWeekChange}
      />

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner className="size-6" style={{ color: "var(--color-text-secondary)" }} />
        </div>
      )}

      {error && (
        <p style={{ fontSize: "var(--font-size-body)", color: "var(--color-status-warning)" }}>
          Failed to load dashboard data.
        </p>
      )}

      {data && (
        <>
          <MoneyPaceCard
            monthLabel={monthLabel}
            soldAmount={data.moneyPace.soldAmount}
            projectedAmount={data.moneyPace.projectedAmount}
            goalAmount={data.moneyPace.goalAmount}
            soldPercent={data.moneyPace.soldPercent}
            paceStatus={data.moneyPace.paceStatus}
          />
          <ActivityPaceSection
            calls={data.calls}
            asks={data.asks}
            weekNumber={data.weekNumber}
            daysRemainingInWeek={data.daysRemainingInWeek}
          />
        </>
      )}
    </div>
  )
}

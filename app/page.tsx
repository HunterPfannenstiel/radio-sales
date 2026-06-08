"use client"

import React, { useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, PhoneCall, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useQuickLog } from "@/components/QuickLogContext"
import { useFetch } from "@/hooks/useFetch"

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

/** Format a date range as "Mon D–D" or "Mon D – Mon D" */
function formatWeekRange(monday: Date): string {
  const friday = new Date(monday)
  friday.setUTCDate(monday.getUTCDate() + 4)
  const monthAbbr = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })
  const day = (d: Date) => d.getUTCDate()
  if (monday.getUTCMonth() === friday.getUTCMonth()) {
    return `${monthAbbr(monday)} ${day(monday)}–${day(friday)}`
  }
  return `${monthAbbr(monday)} ${day(monday)} – ${monthAbbr(friday)} ${day(friday)}`
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
// PeriodNavigator
// ---------------------------------------------------------------------------

interface PeriodNavigatorProps {
  selectedYear: number
  selectedMonth: number // 0-based
  selectedWeek: number // ISO week number
  selectedWeekYear: number
  onMonthChange: (year: number, month: number) => void
  onWeekChange: (weekYear: number, week: number) => void
}

function PeriodNavigator({
  selectedYear,
  selectedMonth,
  selectedWeek,
  selectedWeekYear,
  onMonthChange,
  onWeekChange,
}: PeriodNavigatorProps) {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  const currentWeek = getISOWeekNumber(today)
  const currentWeekYear = today.getFullYear()

  const isCurrentMonth = selectedYear === currentYear && selectedMonth === currentMonth
  const isCurrentWeek = selectedWeekYear === currentWeekYear && selectedWeek === currentWeek

  const monthLabel = new Date(selectedYear, selectedMonth, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const weekMonday = getMondayOfWeek(selectedWeekYear, selectedWeek)
  const weekRange = formatWeekRange(weekMonday)

  function prevMonth() {
    let y = selectedYear
    let m = selectedMonth - 1
    if (m < 0) { m = 11; y -= 1 }
    onMonthChange(y, m)
  }

  function nextMonth() {
    if (isCurrentMonth) return
    let y = selectedYear
    let m = selectedMonth + 1
    if (m > 11) { m = 0; y += 1 }
    onMonthChange(y, m)
  }

  function prevWeek() {
    const mon = getMondayOfWeek(selectedWeekYear, selectedWeek)
    mon.setUTCDate(mon.getUTCDate() - 7)
    const w = getISOWeekNumber(mon)
    onWeekChange(mon.getUTCFullYear(), w)
  }

  function nextWeek() {
    if (isCurrentWeek) return
    const mon = getMondayOfWeek(selectedWeekYear, selectedWeek)
    mon.setUTCDate(mon.getUTCDate() + 7)
    const w = getISOWeekNumber(mon)
    onWeekChange(mon.getUTCFullYear(), w)
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Month row */}
      <div className="flex items-center gap-2">
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="flex items-center justify-center size-7 rounded hover:bg-accent transition-colors"
        >
          <ChevronLeft className="size-4" style={{ color: "var(--color-text-secondary)" }} />
        </button>
        <span
          className="text-sm font-medium min-w-[10ch] text-center"
          style={{ color: "var(--color-text-primary)" }}
        >
          {monthLabel}
        </span>
        {isCurrentMonth && (
          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded"
            style={{
              background: "var(--color-status-info)",
              color: "var(--color-text-inverse)",
              fontSize: "var(--font-size-micro)",
            }}
          >
            NOW
          </span>
        )}
        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          aria-label="Next month"
          className="flex items-center justify-center size-7 rounded hover:bg-accent transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="size-4" style={{ color: "var(--color-text-secondary)" }} />
        </button>
      </div>

      {/* Week row */}
      <div className="flex items-center gap-2 pl-0.5">
        <button
          onClick={prevWeek}
          aria-label="Previous week"
          className="flex items-center justify-center size-7 rounded hover:bg-accent transition-colors"
        >
          <ChevronLeft className="size-4" style={{ color: "var(--color-text-secondary)" }} />
        </button>
        <span
          className="text-xs min-w-[14ch] text-center"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Week {selectedWeek} · {weekRange}
        </span>
        {isCurrentWeek && (
          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded"
            style={{
              background: "var(--color-status-info)",
              color: "var(--color-text-inverse)",
              fontSize: "var(--font-size-micro)",
            }}
          >
            NOW
          </span>
        )}
        <button
          onClick={nextWeek}
          disabled={isCurrentWeek}
          aria-label="Next week"
          className="flex items-center justify-center size-7 rounded hover:bg-accent transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="size-4" style={{ color: "var(--color-text-secondary)" }} />
        </button>
      </div>
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

  return (
    <div
      className="w-full rounded-[--radius-card] border p-5 flex flex-col gap-4"
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
          style={{ fontSize: "var(--font-size-h1)", color: statusColor }}
        >
          {soldPercent}%
        </span>
        <span
          style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)" }}
        >
          Sold to Goal
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: "var(--color-surface-subtle)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(soldPercent, 100)}%`,
            background: statusColor,
          }}
        />
      </div>

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
  const badgeLabel = paceStatus === "on_pace" ? "On Pace" : "Behind"
  const ratio = target > 0 ? Math.min(count / target, 1) : 0

  // Empty state — no targets set
  if (target === 0) {
    return (
      <div
        className="flex-1 rounded-[--radius-card] border p-5 flex flex-col gap-2"
        style={{
          background: "var(--color-surface-card)",
          borderColor: "var(--color-border-default)",
        }}
      >
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
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
          style={{
            background: statusColor,
            color: "var(--color-text-inverse)",
            fontSize: "var(--font-size-small)",
          }}
        >
          {badgeLabel}
        </span>
      </div>

      {/* Primary figures */}
      <div className="flex items-baseline gap-1">
        <span
          className="font-bold leading-none"
          style={{ fontSize: "var(--font-size-h1)", color: "var(--color-text-primary)" }}
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

      {/* Progress bar */}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: "var(--color-surface-subtle)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${ratio * 100}%`,
            background: statusColor,
          }}
        />
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

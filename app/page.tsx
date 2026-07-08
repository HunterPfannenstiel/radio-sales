"use client"

import React, { useEffect, useState } from "react"
import { Target, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { useFetch } from "@/hooks/useFetch"
import { useQuickLog } from "@/components/QuickLogContext"
import { DateNavigator } from "@/components/DateNavigator/DateNavigator"
import { PageHeader } from "@/components/PageHeader"
import { type PaceStatus, type ActivityPaceStatus } from "@/server/queries/DashboardQuery"
import { CLOSING_RATIO } from "@/lib/goalMath"

// ---------------------------------------------------------------------------
// Dashboard data type (mirrors DashboardDTO from server/queries/DashboardQuery)
// ---------------------------------------------------------------------------

type PeriodState = "current" | "past" | "future"

type DashboardData = {
  moneyPace: {
    soldAmount: number
    projectedAmount: number
    goalAmount: number
    soldPercent: number
    paceStatus: PaceStatus
  }
  calls: { count: number; target: number; paceStatus: ActivityPaceStatus }
  asks: { count: number; target: number; paceStatus: ActivityPaceStatus }
  daysRemainingInWeek: number
  weekNumber: number
  weeklyCloseTarget: number
  weeklyPresentTarget: number
}

const PACE_STATUS_LABELS: Record<PaceStatus | ActivityPaceStatus, string> = {
  goal_reached: "Goal Reached",
  ahead:        "Ahead",
  on_pace:      "On Pace",
  behind:       "Behind",
  missed:       "Missed",
}

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

function getMondayOfCurrentWeek(): Date {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
  monday.setHours(0, 0, 0, 0)
  return monday
}

function getMonthPeriodState(monthDate: Date, today: Date): PeriodState {
  const asTotalMonths = (d: Date) => d.getFullYear() * 12 + d.getMonth()
  const target = asTotalMonths(monthDate)
  const current = asTotalMonths(today)
  if (target === current) return "current"
  return target < current ? "past" : "future"
}

function getWeekPeriodState(monday: Date, currentMonday: Date): PeriodState {
  if (monday.getTime() === currentMonday.getTime()) return "current"
  return monday.getTime() < currentMonday.getTime() ? "past" : "future"
}

function paceStatusToColor(status: PaceStatus | ActivityPaceStatus): string {
  switch (status) {
    case "ahead":
    case "on_pace":
      return "var(--color-status-success)"
    case "behind":
    case "missed":
      return "var(--color-status-warning)"
    case "goal_reached":
      return "var(--color-status-achieved)"
  }
}

// ---------------------------------------------------------------------------
// MoneyPaceCard
// ---------------------------------------------------------------------------

interface MoneyPaceCardProps {
  soldAmount: number
  projectedAmount: number
  goalAmount: number
  soldPercent: number
  paceStatus: PaceStatus
  periodState: PeriodState
  refreshing?: boolean
}

function MoneyPaceCard({
  soldAmount,
  projectedAmount,
  goalAmount,
  soldPercent,
  paceStatus,
  periodState,
  refreshing = false,
}: MoneyPaceCardProps) {
  const statusColor = paceStatusToColor(paceStatus)
  const gap = goalAmount - soldAmount
  const goalReached = soldPercent >= 100
  const showBadge = periodState === "current" || (periodState === "past" && paceStatus === "goal_reached")

  // Empty state — no goal set
  if (goalAmount === 0) {
    return (
      <div
        className="w-full rounded-[var(--radius-card)] border p-6 flex flex-col items-center gap-3 text-center"
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

  const meterColor = periodState === "future"
    ? "var(--color-border-strong)"
    : goalReached
      ? "var(--color-status-achieved)"
      : periodState === "current"
        ? statusColor
        : "var(--color-border-strong)"
  const heroColor = periodState === "future"
    ? "var(--color-text-secondary)"
    : goalReached
      ? "var(--color-status-achieved)"
      : periodState === "current"
        ? statusColor
        : "var(--color-text-secondary)"

  return (
    <div
      className={`w-full rounded-[var(--radius-card)] p-5 flex flex-col gap-4${goalReached && periodState === "current" ? " goal-reached-pulse" : ""}`}
      style={{
        background: "var(--color-surface-card)",
        boxShadow: "0 0 0 1px var(--color-border-default)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3
            className="font-bold"
            style={{ fontSize: "var(--font-size-h3)", color: "var(--color-text-primary)" }}
          >
            Money Pace
          </h3>
          {refreshing && <Spinner className="size-3.5" style={{ color: "var(--color-text-secondary)" }} />}
        </div>
        {showBadge && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
            style={{
              background: statusColor,
              color: "var(--color-text-inverse)",
              fontSize: "var(--font-size-small)",
            }}
          >
            {PACE_STATUS_LABELS[paceStatus]}
          </span>
        )}
      </div>

      <div
        className="flex flex-col gap-4"
        style={{ opacity: refreshing ? 0.4 : 1, transition: "opacity 0.2s ease" }}
      >
        {/* Primary number */}
        <div className="flex items-end justify-between gap-4">
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
          {!goalReached && (
            <div className="flex flex-col gap-0.5 items-end">
              <span
                data-testid="money-pace-gap-value"
                className="font-bold leading-none"
                style={{ fontSize: "var(--font-size-h1)", color: "var(--color-text-primary)" }}
              >
                {formatCurrency(gap)}
              </span>
              <span
                style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)" }}
              >
                to close
              </span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <Progress
          value={Math.min(soldPercent, 100)}
          indicatorStyle={{ background: meterColor }}
        />

        {/* Supporting figures */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "SOLD", value: formatCurrency(soldAmount) },
              { label: "GOAL", value: formatCurrency(goalAmount) },
              { label: "PROJECTED", value: formatCurrency(projectedAmount) },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span
                  style={{
                    fontSize: "var(--font-size-micro)",
                    color: "var(--color-text-secondary)",
                    letterSpacing: "0.06em",
                    fontFamily: "var(--font-family-heading)",
                  }}
                >
                  {label}
                </span>
                <span
                  data-testid={`money-pace-${label.toLowerCase()}-value`}
                  className="font-bold"
                  style={{
                    fontSize: "var(--font-size-body)",
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-family-heading)",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
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
  daysRemaining: number
  periodState: PeriodState
  refreshing?: boolean
  weeklyCloseTarget?: number
  weeklyPresentTarget?: number
}

function ActivityCard({
  type,
  count,
  target,
  paceStatus,
  daysRemaining,
  periodState,
  refreshing = false,
  weeklyCloseTarget,
  weeklyPresentTarget,
}: ActivityCardProps) {
  const label = type === "calls" ? "Calls" : "Asks"
  const statusColor = paceStatusToColor(paceStatus)
  const ratio = target > 0 ? Math.min(count / target, 1) : 0
  const goalReached = paceStatus === "goal_reached"
  const showBadge = periodState === "current" || (periodState === "past" && goalReached)
  const numberColor = periodState === "future"
    ? "var(--color-text-secondary)"
    : goalReached
      ? "var(--color-status-achieved)"
      : periodState === "current"
        ? statusColor
        : "var(--color-text-secondary)"
  const progressColor = periodState === "future"
    ? "var(--color-border-strong)"
    : goalReached
      ? "var(--color-status-achieved)"
      : periodState === "current"
        ? statusColor
        : "var(--color-border-strong)"

  // Empty state — no targets set
  if (target === 0) {
    return (
      <div
        className="flex-1 rounded-[var(--radius-card)] border p-5 flex flex-col items-center gap-2 text-center"
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

  const footerText = daysRemaining <= 0 ? "Week complete" : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`

  return (
    <div
      data-testid={`${type}-card`}
      className="flex-1 rounded-[var(--radius-card)] border p-5 flex flex-col gap-4"
      style={{
        background: "var(--color-surface-card)",
        borderColor: "var(--color-border-default)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3
            className="font-bold"
            style={{ fontSize: "var(--font-size-h3)", color: "var(--color-text-primary)" }}
          >
            {label}
          </h3>
          {refreshing && <Spinner className="size-3.5" style={{ color: "var(--color-text-secondary)" }} />}
        </div>
        {showBadge && (
          periodState === "current" && notStarted ? (
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
              {PACE_STATUS_LABELS[paceStatus]}
            </span>
          )
        )}
      </div>

      <div
        className="flex flex-col gap-4"
        style={{ opacity: refreshing ? 0.4 : 1, transition: "opacity 0.2s ease" }}
      >
        {/* Primary figures */}
        <div className="flex items-baseline gap-1">
          <span
            className="font-bold leading-none"
            style={{ fontSize: "var(--font-size-h1)", color: numberColor }}
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
        <Progress value={ratio * 100} indicatorStyle={{ background: progressColor }} />

        {/* Footer */}
        <span
          style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)" }}
        >
          {footerText}
        </span>

        {type === "asks" &&
          periodState === "current" &&
          weeklyCloseTarget != null &&
          weeklyCloseTarget > 0 &&
          weeklyPresentTarget != null &&
          weeklyPresentTarget > 0 && (
            <>
              <span
                style={{
                  fontSize: "var(--font-size-small)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Close{" "}
                <span
                  className="font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {formatCurrency(weeklyCloseTarget)}
                </span>
                /wk to hit your goal
              </span>
              <span
                style={{
                  fontSize: "var(--font-size-small)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Present{" "}
                <span
                  className="font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {formatCurrency(weeklyPresentTarget)}
                </span>
                /wk to hit your goal (assuming a {Math.round(CLOSING_RATIO * 100)}% closing ratio)
              </span>
            </>
          )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ActivityPaceSection
// ---------------------------------------------------------------------------

interface ActivityPaceSectionProps {
  calls: DashboardData["calls"]
  asks: DashboardData["asks"]
  daysRemainingInWeek: number
  periodState: PeriodState
  weeklyCloseTarget?: number
  weeklyPresentTarget?: number
  refreshing?: boolean
}

function ActivityPaceSection({
  calls,
  asks,
  daysRemainingInWeek,
  periodState,
  weeklyCloseTarget,
  weeklyPresentTarget,
  refreshing = false,
}: ActivityPaceSectionProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <ActivityCard
        type="calls"
        count={calls.count}
        target={calls.target}
        paceStatus={calls.paceStatus}
        daysRemaining={daysRemainingInWeek}
        periodState={periodState}
        refreshing={refreshing}
      />
      <ActivityCard
        type="asks"
        count={asks.count}
        target={asks.target}
        paceStatus={asks.paceStatus}
        daysRemaining={daysRemainingInWeek}
        periodState={periodState}
        weeklyCloseTarget={weeklyCloseTarget}
        weeklyPresentTarget={weeklyPresentTarget}
        refreshing={refreshing}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// DashboardPage
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [selectedMonday, setSelectedMonday] = useState<Date>(getMondayOfCurrentWeek)
  const weekState = getWeekPeriodState(selectedMonday, getMondayOfCurrentWeek())

  const thursday = new Date(selectedMonday)
  thursday.setDate(selectedMonday.getDate() + 3)
  const monthParam = `${thursday.getFullYear()}-${String(thursday.getMonth() + 1).padStart(2, "0")}`
  const now = new Date()
  const monthState = getMonthPeriodState(thursday, now)
  const weekYear = thursday.getFullYear()
  const weekNumber = getISOWeekNumber(selectedMonday)
  const apiUrl = `/api/dashboard?month=${monthParam}&weekYear=${weekYear}&weekNumber=${weekNumber}`
  const { data, initialLoading, refreshing, error, refetch } = useFetch<DashboardData>(apiUrl)
  const { onCallLogged } = useQuickLog()

  useEffect(() => onCallLogged(refetch), [onCallLogged, refetch])

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <PageHeader title="My Dashboard" />

      <DateNavigator date={selectedMonday} onChange={setSelectedMonday} />

      {initialLoading && (
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
            soldAmount={data.moneyPace.soldAmount}
            projectedAmount={data.moneyPace.projectedAmount}
            goalAmount={data.moneyPace.goalAmount}
            soldPercent={data.moneyPace.soldPercent}
            paceStatus={data.moneyPace.paceStatus}
            periodState={monthState}
            refreshing={refreshing}
          />
          <ActivityPaceSection
            calls={data.calls}
            asks={data.asks}
            daysRemainingInWeek={data.daysRemainingInWeek}
            periodState={weekState}
            weeklyCloseTarget={data.weeklyCloseTarget}
            weeklyPresentTarget={data.weeklyPresentTarget}
            refreshing={refreshing}
          />
        </>
      )}
    </div>
  )
}

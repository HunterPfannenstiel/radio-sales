"use client"

import React, { useState } from "react"
import { Target, TrendingUp } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useFetch } from "@/hooks/useFetch"
import { DateNavigator } from "@/components/DateNavigator/DateNavigator"
import { PageHeader } from "@/components/PageHeader"

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

function getMondayOfCurrentWeek(): Date {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
  monday.setHours(0, 0, 0, 0)
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

function LevelMeter({ ratio, color, segments = 20 }: { ratio: number; color: string; segments?: number }) {
  const filled = Math.round(ratio * segments)
  return (
    <div className="flex gap-px w-full">
      {Array.from({ length: segments }, (_, i) => (
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
  soldAmount: number
  projectedAmount: number
  goalAmount: number
  soldPercent: number
  paceStatus: PaceStatus
  isCurrentMonth: boolean
}

function MoneyPaceCard({
  soldAmount,
  projectedAmount,
  goalAmount,
  soldPercent,
  paceStatus,
  isCurrentMonth,
}: MoneyPaceCardProps) {
  const statusColor = paceStatusToColor(paceStatus)
  const gap = goalAmount - soldAmount
  const goalReached = soldPercent >= 100

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

  const meterColor = goalReached
    ? "var(--color-status-achieved)"
    : statusColor
  const heroColor = goalReached
    ? "var(--color-status-achieved)"
    : statusColor

  return (
    <div
      className={`w-full rounded-[var(--radius-card)] p-5 flex flex-col gap-4${goalReached ? " goal-reached-pulse" : ""}`}
      style={{
        background: "var(--color-surface-card)",
        boxShadow: "0 0 0 1px var(--color-border-default)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h3
          className="font-bold"
          style={{ fontSize: "var(--font-size-h3)", color: "var(--color-text-primary)" }}
        >
          Money Pace
        </h3>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
          style={{
            background: statusColor,
            color: "var(--color-text-inverse)",
            fontSize: "var(--font-size-small)",
          }}
        >
          {isCurrentMonth
            ? paceStatusLabel(paceStatus)
            : paceStatus === "behind" ? "Missed" : "Hit"}
        </span>
      </div>

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

      {/* Level meter */}
      <LevelMeter ratio={Math.min(soldPercent / 100, 1)} color={meterColor} />

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
  isCurrentWeek: boolean
}

function ActivityCard({
  type,
  count,
  target,
  paceStatus,
  daysRemaining,
  isCurrentWeek,
}: ActivityCardProps) {
  const label = type === "calls" ? "Calls" : "Asks"
  const statusColor = activityStatusToColor(paceStatus)
  const ratio = target > 0 ? Math.min(count / target, 1) : 0

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
      className="flex-1 rounded-[var(--radius-card)] border p-5 flex flex-col gap-4"
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
          {label}
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
            {isCurrentWeek
              ? paceStatus === "on_pace" ? "On Pace" : "Behind"
              : paceStatus === "on_pace" ? "Hit" : "Missed"}
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
      <LevelMeter ratio={ratio} color={statusColor} segments={target} />

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
  daysRemainingInWeek: number
  isCurrentWeek: boolean
}

function ActivityPaceSection({
  calls,
  asks,
  daysRemainingInWeek,
  isCurrentWeek,
}: ActivityPaceSectionProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <ActivityCard
        type="calls"
        count={calls.count}
        target={calls.target}
        paceStatus={calls.paceStatus}
        daysRemaining={daysRemainingInWeek}
        isCurrentWeek={isCurrentWeek}
      />
      <ActivityCard
        type="asks"
        count={asks.count}
        target={asks.target}
        paceStatus={asks.paceStatus}
        daysRemaining={daysRemainingInWeek}
        isCurrentWeek={isCurrentWeek}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// DashboardPage
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [selectedMonday, setSelectedMonday] = useState<Date>(getMondayOfCurrentWeek)
  const isCurrentWeek = selectedMonday.getTime() === getMondayOfCurrentWeek().getTime()

  const thursday = new Date(selectedMonday)
  thursday.setDate(selectedMonday.getDate() + 3)
  const monthParam = `${thursday.getFullYear()}-${String(thursday.getMonth() + 1).padStart(2, "0")}`
  const now = new Date()
  const isCurrentMonth = thursday.getFullYear() === now.getFullYear() && thursday.getMonth() === now.getMonth()
  const weekYear = thursday.getFullYear()
  const weekNumber = getISOWeekNumber(selectedMonday)
  const apiUrl = `/api/dashboard?month=${monthParam}&weekYear=${weekYear}&weekNumber=${weekNumber}`
  const { data, loading, error } = useFetch<DashboardData>(apiUrl)

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <PageHeader title="My Dashboard" />

      <DateNavigator date={selectedMonday} onChange={setSelectedMonday} />

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
            soldAmount={data.moneyPace.soldAmount}
            projectedAmount={data.moneyPace.projectedAmount}
            goalAmount={data.moneyPace.goalAmount}
            soldPercent={data.moneyPace.soldPercent}
            paceStatus={data.moneyPace.paceStatus}
            isCurrentMonth={isCurrentMonth}
          />
          <ActivityPaceSection
            calls={data.calls}
            asks={data.asks}
            daysRemainingInWeek={data.daysRemainingInWeek}
            isCurrentWeek={isCurrentWeek}
          />
        </>
      )}
    </div>
  )
}

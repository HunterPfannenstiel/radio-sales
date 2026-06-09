"use client"

import React from "react"
import { ChevronLeft, ChevronRight, PhoneCall, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// ---------------------------------------------------------------------------
// Utilities (duplicated from page.tsx to keep this component self-contained)
// ---------------------------------------------------------------------------

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function getMondayOfWeek(year: number, week: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayOfWeek = jan4.getUTCDay() || 7
  const firstMonday = new Date(jan4)
  firstMonday.setUTCDate(jan4.getUTCDate() + (1 - dayOfWeek))
  const monday = new Date(firstMonday)
  monday.setUTCDate(firstMonday.getUTCDate() + (week - 1) * 7)
  return monday
}

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

// ---------------------------------------------------------------------------
// PeriodNavigator
// ---------------------------------------------------------------------------

export interface PeriodNavigatorProps {
  selectedYear: number
  selectedMonth: number // 0-based
  selectedWeek: number // ISO week number
  selectedWeekYear: number
  onMonthChange: (year: number, month: number) => void
  onWeekChange: (weekYear: number, week: number) => void
}

export function PeriodNavigator({
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
  const isLive = isCurrentMonth && isCurrentWeek

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

  function jumpToToday() {
    onMonthChange(currentYear, currentMonth)
    onWeekChange(currentWeekYear, currentWeek)
  }

  return (
    <div
      className="flex flex-col rounded-[var(--radius-card)]"
      style={{
        background: "var(--color-surface-subtle)",
        padding: "var(--spacing-sm)",
        borderLeft: isLive
          ? "4px solid var(--color-accent-primary)"
          : "1px solid var(--color-border-default)",
        borderRight: "1px solid var(--color-border-default)",
        borderTop: "1px solid var(--color-border-default)",
        borderBottom: "1px solid var(--color-border-default)",
      }}
    >
      {/* Month row */}
      <div className="flex items-center gap-2">
        <TrendingUp
          style={{
            width: "var(--icon-size-sm)",
            height: "var(--icon-size-sm)",
            color: "var(--color-text-secondary)",
            flexShrink: 0,
          }}
        />
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="flex items-center justify-center size-7 rounded hover:bg-accent transition-colors"
        >
          <ChevronLeft className="size-4" style={{ color: "var(--color-text-secondary)" }} />
        </button>
        <span
          className="font-heading font-bold text-center"
          style={{
            fontSize: "var(--font-size-h3)",
            color: "var(--color-text-primary)",
            minWidth: "12ch",
          }}
        >
          {monthLabel}
        </span>
        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          aria-label="Next month"
          className="flex items-center justify-center size-7 rounded hover:bg-accent transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="size-4" style={{ color: "var(--color-text-secondary)" }} />
        </button>
      </div>

      {/* Row divider */}
      <Separator
        className="my-1"
        style={{ background: "var(--color-border-subtle)" }}
      />

      {/* Week row */}
      <div className="flex items-center gap-2">
        <PhoneCall
          style={{
            width: "var(--icon-size-sm)",
            height: "var(--icon-size-sm)",
            color: "var(--color-text-secondary)",
            flexShrink: 0,
          }}
        />
        <button
          onClick={prevWeek}
          aria-label="Previous week"
          className="flex items-center justify-center size-7 rounded hover:bg-accent transition-colors"
        >
          <ChevronLeft className="size-4" style={{ color: "var(--color-text-secondary)" }} />
        </button>
        <span
          className="text-center"
          style={{
            fontFamily: "var(--font-family-base)",
            fontSize: "var(--font-size-small)",
            color: "var(--color-text-secondary)",
            minWidth: "16ch",
          }}
        >
          Week {selectedWeek} · {weekRange}
        </span>
        <button
          onClick={nextWeek}
          disabled={isCurrentWeek}
          aria-label="Next week"
          className="flex items-center justify-center size-7 rounded hover:bg-accent transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="size-4" style={{ color: "var(--color-text-secondary)" }} />
        </button>
      </div>

      {/* Today reset button — only visible when not both current periods */}
      {!isLive && (
        <>
          <Separator
            className="mt-1"
            style={{ background: "var(--color-border-subtle)" }}
          />
          <div className="flex justify-end pt-1">
            <Button
              variant="ghost"
              size="xs"
              onClick={jumpToToday}
              style={{ color: "var(--color-text-secondary)" }}
            >
              Today
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

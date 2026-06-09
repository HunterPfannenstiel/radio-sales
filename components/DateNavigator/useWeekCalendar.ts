'use client'
import { useState } from 'react'

export interface WeekRow {
  weekNumber: number
  monday: Date
  dateSpan: string
  relativeLabel?: string
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function getMondayOf(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDateSpan(monday: Date): string {
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const monStr = monday.toLocaleString('default', { month: 'short', day: 'numeric' })
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monStr} – ${sunday.getDate()}`
  }
  const sunStr = sunday.toLocaleString('default', { month: 'short', day: 'numeric' })
  return `${monStr} – ${sunStr}`
}

function getRelativeLabel(monday: Date, todayMonday: Date): string | undefined {
  const diffMs = todayMonday.getTime() - monday.getTime()
  const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000))
  if (diffWeeks === 0) return 'This week'
  if (diffWeeks === 1) return 'Last week'
  if (diffWeeks === 2) return '2 weeks ago'
  return undefined
}

export function useWeekCalendar(selectedDate: Date) {
  const today = new Date()
  const todayMonday = getMondayOf(today)

  const [displayDate, setDisplayDate] = useState(() => new Date(selectedDate))

  const firstOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1)
  const lastOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0)

  const weeks: WeekRow[] = []
  const cursor = getMondayOf(firstOfMonth)

  while (cursor <= lastOfMonth) {
    const monday = new Date(cursor)
    weeks.push({
      weekNumber: getISOWeekNumber(monday),
      monday,
      dateSpan: formatDateSpan(monday),
      relativeLabel: getRelativeLabel(monday, todayMonday),
    })
    cursor.setDate(cursor.getDate() + 7)
  }

  const selectedWeekNumber = getISOWeekNumber(selectedDate)
  const todayWeekNumber = getISOWeekNumber(today)
  const currentMonthLabel = displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const thisWeekMonday = new Date(todayMonday)
  const lastWeekMonday = new Date(todayMonday)
  lastWeekMonday.setDate(todayMonday.getDate() - 7)

  const goToPrevMonth = () =>
    setDisplayDate((d) => { const n = new Date(d); n.setMonth(d.getMonth() - 1); return n })

  const goToNextMonth = () =>
    setDisplayDate((d) => { const n = new Date(d); n.setMonth(d.getMonth() + 1); return n })

  const goToDate = (date: Date) =>
    setDisplayDate(new Date(date.getFullYear(), date.getMonth(), 1))

  return {
    weeks,
    selectedWeekNumber,
    todayWeekNumber,
    currentMonthLabel,
    thisWeekMonday,
    lastWeekMonday,
    goToPrevMonth,
    goToNextMonth,
    goToDate,
  }
}

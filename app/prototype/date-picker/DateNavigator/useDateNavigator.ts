'use client'
import { useState } from 'react'

function getMondayOfCurrentWeek(): Date {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
  monday.setHours(0, 0, 0, 0)
  return monday
}

function getRelativeLabel(selectedMonday: Date, todayMonday: Date): string | undefined {
  const diffWeeks = Math.round(
    (todayMonday.getTime() - selectedMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)
  )
  if (diffWeeks === 0) return 'This week'
  if (diffWeeks === 1) return 'Last week'
  if (diffWeeks === 2) return '2 weeks ago'
  return undefined
}

export function useDateNavigator() {
  const thisWeekMonday = getMondayOfCurrentWeek()
  const [selectedDate, setSelectedDate] = useState<Date>(thisWeekMonday)
  const [isOpen, setIsOpen] = useState(false)

  const isCurrentWeek = selectedDate.getTime() === thisWeekMonday.getTime()
  const relativeLabel = getRelativeLabel(selectedDate, thisWeekMonday)

  function goToPrevWeek() {
    setSelectedDate((d) => {
      const next = new Date(d)
      next.setDate(d.getDate() - 7)
      return next
    })
  }

  function goToNextWeek() {
    setSelectedDate((d) => {
      const next = new Date(d)
      next.setDate(d.getDate() + 7)
      return next
    })
  }

  function goToCurrentWeek() {
    setSelectedDate(getMondayOfCurrentWeek())
  }

  return {
    selectedDate,
    setSelectedDate,
    isOpen,
    isCurrentWeek,
    relativeLabel,
    openCalendar: () => setIsOpen(true),
    closeCalendar: () => setIsOpen(false),
    goToPrevWeek,
    goToNextWeek,
    goToCurrentWeek,
  }
}

'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWeekCalendar } from './useWeekCalendar'

interface WeekCalendarProps {
  selectedDate: Date
  onSelectWeek: (monday: Date) => void
}

export function WeekCalendar({ selectedDate, onSelectWeek }: WeekCalendarProps) {
  const {
    weeks,
    selectedWeekNumber,
    todayWeekNumber,
    currentMonthLabel,
    thisWeekMonday,
    lastWeekMonday,
    goToPrevMonth,
    goToNextMonth,
    goToDate,
  } = useWeekCalendar(selectedDate)

  return (
    <div className="w-80 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-base font-semibold">{currentMonthLabel}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 border-b pb-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          disabled={!thisWeekMonday}
          onClick={() => { if (thisWeekMonday) { goToDate(thisWeekMonday); onSelectWeek(thisWeekMonday) } }}
        >
          This week
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          disabled={!lastWeekMonday}
          onClick={() => { if (lastWeekMonday) { goToDate(lastWeekMonday); onSelectWeek(lastWeekMonday) } }}
        >
          Last week
        </Button>
      </div>

      <div className="flex flex-col gap-0.5">
        {weeks.map((week) => (
          <button
            key={week.weekNumber}
            onClick={() => onSelectWeek(week.monday)}
            className={[
              'flex items-center gap-2 px-2 py-2.5 rounded w-full text-left transition-colors hover:bg-accent',
              week.weekNumber === selectedWeekNumber ? 'bg-accent' : '',
            ].join(' ')}
          >
            <span
              className={
                week.relativeLabel
                  ? 'text-xs font-medium text-primary w-20 shrink-0'
                  : 'text-xs text-muted-foreground tabular-nums w-20 shrink-0'
              }
            >
              {week.relativeLabel ?? `W${week.weekNumber}`}
            </span>

            <span className="flex-1" />

            {week.weekNumber === todayWeekNumber && (
              <span className="text-[10px] font-medium bg-primary text-primary-foreground rounded px-1.5 py-0.5 leading-none">
                Today
              </span>
            )}

            <span className="text-xs text-muted-foreground tabular-nums">
              {week.dateSpan}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

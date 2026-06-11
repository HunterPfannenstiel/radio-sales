'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { WeekCalendar } from './WeekCalendar'
import { useTodayDate } from '@/hooks/useTodayDate'

interface DateNavigatorProps {
  date: Date
  onChange: (monday: Date) => void
}

function getMondayOf(date: Date): Date {
  const day = date.getDay()
  const monday = new Date(date)
  monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
  monday.setHours(0, 0, 0, 0)
  return monday
}

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F'] as const

function WeekDayStrip({ monday }: { monday: Date }) {
  const today = useTodayDate()

  return (
    <div className="flex gap-6 px-1 justify-center">
      {WEEKDAY_LABELS.map((label, i) => {
        const day = new Date(monday)
        day.setDate(monday.getDate() + i)
        const isToday = today !== null && day.getTime() === today.getTime()
        const filled = today !== null && day.getTime() <= today.getTime()

        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <span
              style={{
                fontSize: 'var(--font-size-small)',
                fontWeight: isToday ? 600 : undefined,
                color: isToday ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
              }}
            >
              {label}
            </span>
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: filled
                  ? isToday
                    ? 'var(--color-accent-primary)'
                    : 'var(--color-text-secondary)'
                  : 'transparent',
                border: filled ? 'none' : '1px solid var(--color-border-default)',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export function DateNavigator({ date, onChange }: DateNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const today = useTodayDate()

  const isCurrentWeek = today !== null && date.getTime() === getMondayOf(today).getTime()

  const weekEnd = new Date(date)
  weekEnd.setDate(date.getDate() + 6)

  const weekLabel =
    date.getMonth() === weekEnd.getMonth()
      ? `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}–${weekEnd.getDate()}`
      : `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()} – ${weekEnd.toLocaleString('default', { month: 'short' })} ${weekEnd.getDate()}`


  function handlePrevWeek() {
    const next = new Date(date)
    next.setDate(date.getDate() - 7)
    onChange(next)
  }

  function handleNextWeek() {
    const next = new Date(date)
    next.setDate(date.getDate() + 7)
    onChange(next)
  }

  function handleSelectWeek(monday: Date) {
    onChange(monday)
    setIsOpen(false)
  }

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <div className="inline-flex items-center border rounded-lg px-1 w-full">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handlePrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 flex justify-center">
            <Button variant="ghost" className="px-2 text-sm font-medium gap-1.5" onClick={() => setIsOpen(true)}>
              {isCurrentWeek && (
                <span className="text-xs leading-none" style={{ color: 'var(--color-accent-primary)' }}>●</span>
              )}
              {weekLabel}
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <WeekDayStrip monday={date} />
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) setIsOpen(false) }}>
        <DialogContent showCloseButton={false} className="w-auto max-w-none p-4">
          <WeekCalendar selectedDate={date} onSelectWeek={handleSelectWeek} />
        </DialogContent>
      </Dialog>
    </>
  )
}

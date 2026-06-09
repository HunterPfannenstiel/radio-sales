'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { WeekCalendar } from './WeekCalendar'

interface DateNavigatorProps {
  date: Date
  onChange: (monday: Date) => void
}

function getMondayOfCurrentWeek(): Date {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
  monday.setHours(0, 0, 0, 0)
  return monday
}

export function DateNavigator({ date, onChange }: DateNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const isCurrentWeek = date.getTime() === getMondayOfCurrentWeek().getTime()

  const weekEnd = new Date(date)
  weekEnd.setDate(date.getDate() + 6)

  const weekLabel =
    date.getMonth() === weekEnd.getMonth()
      ? `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()} – ${weekEnd.getDate()}`
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
      <div className="inline-flex items-center border rounded-lg px-1 w-52">
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

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) setIsOpen(false) }}>
        <DialogContent showCloseButton={false} className="w-auto max-w-none p-4">
          <WeekCalendar selectedDate={date} onSelectWeek={handleSelectWeek} />
        </DialogContent>
      </Dialog>
    </>
  )
}

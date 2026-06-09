'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { WeekCalendar } from '../WeekCalendar/WeekCalendar'
import { useDateNavigator } from './useDateNavigator'

export function DateNavigator() {
  const {
    selectedDate,
    setSelectedDate,
    isOpen,
    isCurrentWeek,
    openCalendar,
    closeCalendar,
    goToPrevWeek,
    goToNextWeek,
  } = useDateNavigator()

  const weekEnd = new Date(selectedDate)
  weekEnd.setDate(selectedDate.getDate() + 6)

  const weekLabel =
    selectedDate.getMonth() === weekEnd.getMonth()
      ? `${selectedDate.toLocaleString('default', { month: 'short' })} ${selectedDate.getDate()} – ${weekEnd.getDate()}`
      : `${selectedDate.toLocaleString('default', { month: 'short' })} ${selectedDate.getDate()} – ${weekEnd.toLocaleString('default', { month: 'short' })} ${weekEnd.getDate()}`

  function handleSelectWeek(monday: Date) {
    setSelectedDate(monday)
    closeCalendar()
  }

  return (
    <>
      <div className="inline-flex items-center border rounded-lg px-1 w-52">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={goToPrevWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 flex justify-center">
          <Button variant="ghost" className="px-2 text-sm font-medium gap-1.5" onClick={openCalendar}>
            {isCurrentWeek && (
              <span className="text-xs leading-none" style={{ color: 'var(--color-accent-primary)' }}>●</span>
            )}
            {weekLabel}
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={goToNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeCalendar() }}>
        <DialogContent showCloseButton={false} className="w-auto max-w-none p-4">
          <WeekCalendar selectedDate={selectedDate} onSelectWeek={handleSelectWeek} />
        </DialogContent>
      </Dialog>
    </>
  )
}

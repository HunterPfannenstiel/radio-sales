'use client'
import { useState } from 'react'
import { DateNavigator } from './DateNavigator/DateNavigator'
import { WeekCalendar } from './WeekCalendar/WeekCalendar'

function getMondayOfCurrentWeek(): Date {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
  monday.setHours(0, 0, 0, 0)
  return monday
}

export default function DatePickerPrototypePage() {
  const [selectedDate, setSelectedDate] = useState(getMondayOfCurrentWeek)

  return (
    <div className="p-8 flex flex-col gap-10">
      <section className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">DateNavigator</p>
        {/* Implementation note: selectedDate lives inside DateNavigator for the prototype.
            In production, lift it to the dashboard page so other components respond to week changes. */}
        <DateNavigator />
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">WeekCalendar</p>
        <div className="inline-flex border rounded-lg p-4">
          <WeekCalendar selectedDate={selectedDate} onSelectWeek={setSelectedDate} />
        </div>
      </section>
    </div>
  )
}

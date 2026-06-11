'use client'
import { useState, useEffect } from 'react'

// Returns null during SSR/hydration so server and client render identically,
// then resolves to the browser's local date after mount.
export function useTodayDate(): Date | null {
  const [today, setToday] = useState<Date | null>(null)
  useEffect(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    setToday(t)
  }, [])
  return today
}

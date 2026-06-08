"use client"

import React, { createContext, useContext, useState } from "react"

type QuickLogPrefill = {
  businessId?: string
  businessName?: string
}

type QuickLogContextValue = {
  isOpen: boolean
  prefill: QuickLogPrefill | null
  open: (prefill?: QuickLogPrefill) => void
  close: () => void
}

const QuickLogContext = createContext<QuickLogContextValue | null>(null)

export function QuickLogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [prefill, setPrefill] = useState<QuickLogPrefill | null>(null)

  function open(prefill?: QuickLogPrefill) {
    setPrefill(prefill ?? null)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
    setPrefill(null)
  }

  return (
    <QuickLogContext.Provider value={{ isOpen, prefill, open, close }}>
      {children}
    </QuickLogContext.Provider>
  )
}

export function useQuickLog(): QuickLogContextValue {
  const ctx = useContext(QuickLogContext)
  if (!ctx) throw new Error("useQuickLog must be used within QuickLogProvider")
  return ctx
}

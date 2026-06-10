"use client"

import React, { createContext, useCallback, useContext, useRef, useState } from "react"

type QuickLogPrefill = {
  businessId?: string
  businessName?: string
}

type QuickLogContextValue = {
  isOpen: boolean
  prefill: QuickLogPrefill | null
  open: (prefill?: QuickLogPrefill) => void
  close: () => void
  onCallLogged: (fn: () => void) => () => void
  notifyCallLogged: () => void
}

const QuickLogContext = createContext<QuickLogContextValue | null>(null)

export function QuickLogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [prefill, setPrefill] = useState<QuickLogPrefill | null>(null)
  const listenersRef = useRef<Set<() => void>>(new Set())

  function open(prefill?: QuickLogPrefill) {
    setPrefill(prefill ?? null)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
    setPrefill(null)
  }

  const onCallLogged = useCallback((fn: () => void) => {
    listenersRef.current.add(fn)
    return () => { listenersRef.current.delete(fn) }
  }, [])

  const notifyCallLogged = useCallback(() => {
    listenersRef.current.forEach((fn) => fn())
  }, [])

  return (
    <QuickLogContext.Provider value={{ isOpen, prefill, open, close, onCallLogged, notifyCallLogged }}>
      {children}
    </QuickLogContext.Provider>
  )
}

export function useQuickLog(): QuickLogContextValue {
  const ctx = useContext(QuickLogContext)
  if (!ctx) throw new Error("useQuickLog must be used within QuickLogProvider")
  return ctx
}

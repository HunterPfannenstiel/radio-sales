"use client"

import React, { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Drawer, DrawerContent } from "@/components/ui/drawer"

interface BusinessViewProps {
  open: boolean
  onClose: () => void
  /** Accessible label for the overlay region */
  title: string
  children: React.ReactNode
  className?: string
}

export function BusinessView({
  open,
  onClose,
  title,
  children,
  className,
}: BusinessViewProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const panelRef = useRef<HTMLDivElement>(null)

  // Desktop: Escape key
  useEffect(() => {
    if (!isDesktop || !open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose, isDesktop])

  // Desktop: lock body scroll
  useEffect(() => {
    if (!isDesktop) return
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open, isDesktop])

  // Desktop: focus trap
  useEffect(() => {
    if (!isDesktop || !open || !panelRef.current) return
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length > 0) focusable[0].focus()
  }, [open, isDesktop])

  // Mobile: vaul drawer handles drag, scroll lock, backdrop, and focus
  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
        <DrawerContent
          aria-label={title}
          className={cn("h-[85vh] flex flex-col overflow-hidden", className)}
          style={{
            borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
            border: "1px solid var(--color-border-default)",
          }}
        >
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  // Desktop: slide-over panel from the right
  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 transition-opacity motion-reduce:transition-none",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{
          background: "oklch(0.145 0 0 / 40%)",
          transitionDuration: "var(--duration-base)",
          transitionTimingFunction: open ? "ease-out" : "ease-in",
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden motion-reduce:transition-none",
          "inset-y-0 right-0 w-[40vw] min-w-[360px] max-w-[480px]",
          className
        )}
        style={{
          background: "var(--color-surface-card)",
          border: "1px solid var(--color-border-default)",
          borderRadius: "var(--radius-xl) 0 0 var(--radius-xl)",
          boxShadow: "0 8px 32px oklch(0.145 0 0 / 12%)",
          transform: open ? "translate3d(0, 0, 0)" : "translate3d(100%, 0, 0)",
          transition: `transform var(--duration-base) ${open ? "ease-out" : "ease-in"}`,
        }}
      >
        {/* Close button */}
        <div className="flex justify-end px-4 pt-4 shrink-0">
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center rounded-md transition-colors"
            style={{
              width: "var(--touch-target-min)",
              height: "var(--touch-target-min)",
              color: "var(--color-text-secondary)",
              transitionDuration: "var(--duration-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-surface-subtle)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
            }}
          >
            <X size={16} aria-hidden />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}

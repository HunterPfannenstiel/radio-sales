"use client"

import React, { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/useMediaQuery"

// ---------------------------------------------------------------------------
// BusinessView
//
// Reusable overlay container. Renders as:
//   - Desktop: slide-over panel from the right edge (~40% viewport, max 480px,
//     min 360px). Left corners rounded (--radius-xl), right corners flush.
//   - Mobile: bottom sheet (~85vh). Top corners rounded (--radius-xl).
//
// Entry / exit animations use --duration-base (200ms).
// Backdrop fades simultaneously.
// prefers-reduced-motion: transitions collapse to near-zero.
// ---------------------------------------------------------------------------

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

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Focus trap — move focus into panel when it opens
  useEffect(() => {
    if (open && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length > 0) {
        focusable[0].focus()
      }
    }
  }, [open])

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
          // Desktop: slide-over from right
          isDesktop
            ? "inset-y-0 right-0 w-[40vw] min-w-[360px] max-w-[480px]"
            : // Mobile: bottom sheet
              "inset-x-0 bottom-0 h-[85vh]",
          className
        )}
        style={{
          background: "var(--color-surface-card)",
          border: "1px solid var(--color-border-default)",
          borderRadius: isDesktop
            ? "var(--radius-xl) 0 0 var(--radius-xl)"
            : "var(--radius-xl) var(--radius-xl) 0 0",
          boxShadow: "0 8px 32px oklch(0.145 0 0 / 12%)",
          // Animation
          transform: open
            ? "translate3d(0, 0, 0)"
            : isDesktop
              ? "translate3d(100%, 0, 0)"
              : "translate3d(0, 100%, 0)",
          transition: `transform var(--duration-base) ${open ? "ease-out" : "ease-in"}`,
        }}
      >
        {/* Mobile drag handle */}
        {!isDesktop && (
          <div
            aria-hidden
            className="flex justify-center pt-3 pb-1 shrink-0"
          >
            <div
              className="rounded-full"
              style={{
                width: "32px",
                height: "4px",
                background: "var(--color-border-default)",
              }}
            />
          </div>
        )}

        {/* Desktop close button */}
        {isDesktop && (
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
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}

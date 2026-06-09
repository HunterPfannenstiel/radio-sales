"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useQuickLog } from "@/components/QuickLogContext"

export type BusinessCardData = {
  id: string
  name: string
  stage: string
  nextStepText: string
  lastContactedAt: string | null
}

const STAGE_LABELS: Record<string, string> = {
  approach: "Approach",
  uncover: "Uncover",
  present: "Present",
  close: "Close",
  service_upsell: "Service / Upsell",
}

const STAGE_DOT_COLORS: Record<string, string> = {
  approach: "var(--color-status-info)",
  uncover: "var(--color-accent-secondary)",
  present: "var(--color-status-achieved)",
  close: "var(--color-status-success)",
  service_upsell: "var(--color-status-success)",
}

interface BusinessCardProps {
  business: BusinessCardData
  /** Called when the card body is tapped/clicked — opens the business view overlay */
  onPress?: (business: BusinessCardData) => void
}

export function BusinessCard({ business, onPress }: BusinessCardProps) {
  const { open } = useQuickLog()
  const stageLabel = STAGE_LABELS[business.stage] ?? business.stage
  const dotColor = STAGE_DOT_COLORS[business.stage] ?? "var(--color-text-secondary)"

  function handleLogCall(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    open({ businessId: business.id, businessName: business.name })
  }

  function handleCardPress(e: React.MouseEvent) {
    e.preventDefault()
    onPress?.(business)
  }

  return (
    <a
      href="#"
      onClick={handleCardPress}
      className="block rounded-[var(--radius-card)] border transition-[background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        background: "var(--color-surface-card)",
        borderColor: "var(--color-border-default)",
        transitionDuration: "var(--duration-fast)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--color-surface-subtle)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--color-surface-card)"
      }}
      aria-label={`Open business view for ${business.name}`}
    >
      {/* Card body — all padding lives here */}
      <div className="p-4">
        {/* Header row: name + stage badge */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3
            className="font-bold truncate flex-1 min-w-0"
            style={{
              fontSize: "var(--font-size-h3)",
              lineHeight: "var(--line-height-heading)",
              color: "var(--color-text-primary)",
            }}
          >
            {business.name}
          </h3>

          {/* Stage badge — display only, no chevron */}
          <span
            className="shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{
              fontSize: "var(--font-size-small)",
              fontWeight: "var(--font-weight-medium)",
              background: "var(--color-surface-subtle)",
              color: "var(--color-text-primary)",
              borderColor: "var(--color-border-default)",
              border: "1px solid var(--color-border-default)",
            }}
          >
            <span
              className="inline-block rounded-full shrink-0"
              style={{
                width: "var(--icon-size-xs)",
                height: "var(--icon-size-xs)",
                background: dotColor,
              }}
              aria-hidden
            />
            {stageLabel}
          </span>
        </div>

        {/* Body: next step text — 2-line clamp */}
        <p
          className="line-clamp-2"
          style={{
            fontSize: "var(--font-size-body)",
            lineHeight: "var(--line-height-body)",
            color: "var(--color-text-secondary)",
            fontWeight: "var(--font-weight-regular)",
          }}
        >
          {business.nextStepText}
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "var(--color-border-subtle)",
        }}
        aria-hidden
      />

      {/* Footer */}
      <div className="flex justify-end px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogCall}
          aria-label={`Log call for ${business.name}`}
        >
          Log call
        </Button>
      </div>
    </a>
  )
}

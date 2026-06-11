"use client"

import React from "react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type InteractionOutcome = "sold" | "not_sold" | "follow_up"

export interface InteractionEntry {
  id: string
  date: Date
  stage: string
  outcome: InteractionOutcome
  ask?: {
    amount: number
    term: string
    confidence: string
  }
  nextStep: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const OUTCOME_LABELS: Record<InteractionOutcome, string> = {
  sold: "Sold",
  not_sold: "Not sold",
  follow_up: "Follow up",
}

const STAGE_LABELS: Record<string, string> = {
  approach: "Approach",
  uncover: "Uncover",
  present: "Present",
  close: "Close",
  service: "Service",
}


function formatEntryDate(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const entryDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (entryDay.getTime() === today.getTime()) return "Today"
  if (entryDay.getTime() === yesterday.getTime()) return "Yesterday"

  const sameYear = date.getFullYear() === now.getFullYear()
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  })
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

// ---------------------------------------------------------------------------
// OutcomeIndicator
// ---------------------------------------------------------------------------

interface OutcomeIndicatorProps {
  outcome: InteractionOutcome
}

function OutcomeIndicator({ outcome }: OutcomeIndicatorProps) {
  if (outcome === "sold") {
    return (
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "var(--color-status-success)",
          flexShrink: 0,
          marginTop: "1px",
        }}
      />
    )
  }

  if (outcome === "not_sold") {
    return (
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "10px",
          height: "10px",
          flexShrink: 0,
          fontSize: "10px",
          lineHeight: 1,
          fontWeight: "var(--font-weight-bold)",
          color: "var(--color-status-warning)",
        }}
      >
        ×
      </span>
    )
  }

  // follow_up — no visual indicator
  return null
}


// ---------------------------------------------------------------------------
// InteractionHistoryEntry
// ---------------------------------------------------------------------------

interface InteractionHistoryEntryProps {
  entry: InteractionEntry
  isMostRecent: boolean
}

function InteractionHistoryEntry({
  entry,
  isMostRecent,
}: InteractionHistoryEntryProps) {
  const outcomeLabel = OUTCOME_LABELS[entry.outcome]

  return (
    <div
      className="flex gap-0"
      style={{ paddingBottom: "var(--spacing-sm)" }}
    >
      {/* Timeline dot — sits in the gutter, aligned to the first line of content */}
      <div
        className="flex flex-col items-center shrink-0"
        style={{ width: "20px", marginTop: "3px" }}
        aria-hidden
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: isMostRecent
              ? "var(--color-accent-primary)"
              : "var(--color-border-default)",
            flexShrink: 0,
            zIndex: 1,
            position: "relative",
          }}
        />
      </div>

      {/* Entry content */}
      <div
        className="flex-1 flex flex-col"
        style={{
          gap: "2px",
          paddingLeft: "var(--spacing-md)",
          paddingTop: "0",
          paddingBottom: "var(--spacing-sm)",
        }}
      >
        {/* Date + stage row */}
        <div
          className="flex items-center gap-0"
          style={{ marginBottom: "2px" }}
        >
          <span
            style={{
              fontSize: "var(--font-size-small)",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--color-text-primary)",
              lineHeight: "var(--line-height-body)",
            }}
          >
            {formatEntryDate(entry.date)}
          </span>
          <span
            style={{
              fontSize: "var(--font-size-small)",
              color: "var(--color-text-secondary)",
              lineHeight: "var(--line-height-body)",
            }}
          >
            {" · "}{STAGE_LABELS[entry.stage] ?? entry.stage}
          </span>
        </div>

        {/* Outcome line */}
        <div
          className="flex items-center gap-1.5"
          style={{
            fontSize: "var(--font-size-body)",
            color:
              entry.outcome === "follow_up"
                ? "var(--color-text-secondary)"
                : "var(--color-text-primary)",
            lineHeight: "var(--line-height-body)",
          }}
        >
          <OutcomeIndicator outcome={entry.outcome} />
          <span
            style={{
              color:
                entry.outcome === "sold"
                  ? "var(--color-status-success)"
                  : entry.outcome === "not_sold"
                    ? "var(--color-status-warning)"
                    : "var(--color-text-secondary)",
              fontWeight:
                entry.outcome === "follow_up"
                  ? "var(--font-weight-regular)"
                  : "var(--font-weight-medium)",
            }}
          >
            {outcomeLabel}
          </span>
        </div>

        {/* Ask line — omitted when not present */}
        {entry.ask && (
          <div
            className="flex items-baseline gap-1"
            style={{ lineHeight: "var(--line-height-body)" }}
          >
            <span
              style={{
                fontSize: "var(--font-size-body)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--color-text-primary)",
              }}
            >
              {formatAmount(entry.ask.amount)}
            </span>
            <span
              style={{
                fontSize: "var(--font-size-small)",
                color: "var(--color-text-secondary)",
              }}
            >
              / {entry.ask.term} &middot; {entry.ask.confidence}
            </span>
          </div>
        )}

        {/* Next step line */}
        <p
          style={{
            fontSize: "var(--font-size-body)",
            fontWeight: "var(--font-weight-regular)",
            lineHeight: "var(--line-height-body)",
            color: "var(--color-text-primary)",
            marginTop: "2px",
          }}
        >
          {entry.nextStep}
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// EmptyState — follows design standards empty state template
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <p
      style={{
        fontSize: "var(--font-size-sm)",
        color: "var(--color-text-secondary)",
        padding: "var(--spacing-sm) 0",
      }}
    >
      No interactions yet
    </p>
  )
}

// ---------------------------------------------------------------------------
// InteractionHistory
// ---------------------------------------------------------------------------

export interface InteractionHistoryProps {
  entries: InteractionEntry[]
  isLoading?: boolean
  className?: string
}

export function InteractionHistory({
  entries,
  isLoading,
  className,
}: InteractionHistoryProps) {
  return (
    <section
      className={cn("flex flex-col", className)}
      style={{
        padding: "var(--spacing-md)",
        gap: "var(--spacing-sm)",
      }}
      aria-label="Interaction history"
    >
      {/* Section label */}
      <h3
        style={{
          fontSize: "var(--font-size-h3)",
          fontWeight: "var(--font-weight-bold)",
          lineHeight: "var(--line-height-heading)",
          color: "var(--color-text-primary)",
          marginBottom: (isLoading || entries.length > 0) ? "var(--spacing-sm)" : 0,
        }}
      >
        Interaction history
      </h3>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "var(--spacing-md) 0",
          }}
        >
          <span
            aria-label="Loading"
            style={{
              display: "inline-block",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              border: "2px solid var(--color-border-default)",
              borderTopColor: "var(--color-accent-primary)",
              animation: "spin 0.7s linear infinite",
            }}
          />
        </div>
      ) : entries.length === 0 ? (
        <EmptyState />
      ) : (
        /* Timeline list — continuous 1px vertical line in the gutter */
        <div
          className="relative flex flex-col"
          style={{ gap: 0 }}
        >
          {/* Continuous vertical line */}
          <div
            aria-hidden
            className="absolute"
            style={{
              left: "9px", // center of the 20px dot column, offset by 1px for the 2px line width
              top: "4px",
              bottom: "4px",
              width: "1px",
              background: "var(--color-border-subtle)",
              zIndex: 0,
            }}
          />

          {entries.map((entry, idx) => (
            <InteractionHistoryEntry
              key={entry.id}
              entry={entry}
              isMostRecent={idx === 0}
            />
          ))}
        </div>
      )}
    </section>
  )
}

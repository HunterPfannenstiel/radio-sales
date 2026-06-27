"use client"

import React, { useState, useCallback, useEffect } from "react"
import { ClipboardList, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BusinessView } from "@/components/BusinessView"
import { BusinessHeader, type BusinessViewData } from "@/app/whats-next/BusinessHeader"
import { type CurrentStage } from "@/lib/types"
import { InteractionHistory, type InteractionEntry } from "@/components/InteractionHistory"
import { Separator } from "@/components/ui/separator"
import { useQuickLog } from "@/components/QuickLogContext"
import { useFetch } from "@/hooks/useFetch"
import { PageHeader } from "@/components/PageHeader"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type WhatsNextAccount = {
  id: string
  name: string
  stage: string
  nextStepText: string
  lastContactedAt: string | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STAGE_LABELS: Record<string, string> = {
  approach: "Approach",
  uncover: "Uncover",
  present: "Present",
  close: "Close",
  service: "Service",
  service_upsell: "Service / Upsell",
}

const STAGE_DOT_COLORS: Record<string, string> = {
  approach: "var(--color-text-secondary)",
  uncover: "var(--color-status-info)",
  present: "var(--color-accent-primary)",
  close: "var(--color-status-success)",
  service: "var(--color-status-achieved)",
  service_upsell: "var(--color-status-achieved)",
}

/** Format date per spec: "Today" / "Yesterday" / "Jun 3" / "Jun 3, 2024" */
function formatLastContact(isoString: string | null, today: Date): string {
  if (!isoString) return "Never contacted"
  const date = new Date(isoString)
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffMs = todayMidnight.getTime() - dateMidnight.getTime()
  const diffDays = Math.round(diffMs / 86400000)

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"

  const sameYear = date.getFullYear() === today.getFullYear()
  const options: Intl.DateTimeFormatOptions = sameYear
    ? { month: "short", day: "numeric" }
    : { month: "short", day: "numeric", year: "numeric" }

  return date.toLocaleDateString("en-US", options)
}

/** Sort: most recently contacted first; no history → bottom, then alphabetical */
function sortAccounts(accounts: WhatsNextAccount[]): WhatsNextAccount[] {
  return [...accounts].sort((a, b) => {
    if (a.lastContactedAt === null && b.lastContactedAt === null) {
      return a.name.localeCompare(b.name)
    }
    if (a.lastContactedAt === null) return 1
    if (b.lastContactedAt === null) return -1
    return new Date(b.lastContactedAt).getTime() - new Date(a.lastContactedAt).getTime()
  })
}

function toBusinessViewData(account: WhatsNextAccount): BusinessViewData {
  const stageMap: Record<string, CurrentStage> = {
    approach: "approach",
    uncover: "uncover",
    present: "present",
    close: "close",
    service_upsell: "service",
    service: "service",
  }
  return {
    id: account.id,
    name: account.name,
    stage: stageMap[account.stage] ?? "approach",
    nextStepText: account.nextStepText || "No next step recorded.",
  }
}


// ---------------------------------------------------------------------------
// AccountCount — accessory for PageHeader
// ---------------------------------------------------------------------------

function AccountCount({ count }: { count: number }) {
  return (
    <>
      <span
        aria-hidden
        style={{
          color: "var(--color-accent-primary)",
          fontSize: "var(--font-size-h3)",
          lineHeight: 1,
        }}
      >
        ●
      </span>
      <span
        aria-label={`${count} ${count !== 1 ? "accounts" : "account"}`}
        style={{
          fontSize: "var(--font-size-body)",
          color: "var(--color-text-secondary)",
          fontWeight: "var(--font-weight-regular)",
        }}
      >
        {count} {count !== 1 ? "accounts" : "account"}
      </span>
    </>
  )
}

// ---------------------------------------------------------------------------
// WhatsNextCard — unique layout per spec
// ---------------------------------------------------------------------------

interface WhatsNextCardProps {
  account: WhatsNextAccount
  today: Date
  onCardClick: (account: WhatsNextAccount) => void
}

function WhatsNextCard({ account, today, onCardClick }: WhatsNextCardProps) {
  const stageLabel = STAGE_LABELS[account.stage] ?? account.stage
  const dotColor = STAGE_DOT_COLORS[account.stage] ?? "var(--color-text-secondary)"
  const lastContact = formatLastContact(account.lastContactedAt, today)

  function handleCardClick(e: React.MouseEvent) {
    e.preventDefault()
    onCardClick(account)
  }

  return (
    <div
      className="rounded-[var(--radius-card)] border overflow-hidden"
      style={{
        background: "var(--color-surface-card)",
        borderColor: "var(--color-border-default)",
      }}
    >
      {/* Clickable card body */}
      <a
        href="#"
        onClick={handleCardClick}
        className="block p-4 transition-[background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{
          transitionDuration: "var(--duration-fast)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--color-surface-subtle)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = ""
        }}
        aria-label={`Open business view for ${account.name}`}
      >
        {/* Header row: business name + stage badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            className="font-bold truncate flex-1 min-w-0"
            style={{
              fontSize: "var(--font-size-h3)",
              lineHeight: "var(--line-height-heading)",
              color: "var(--color-text-primary)",
            }}
          >
            {account.name}
          </h3>

          {/* Stage badge — display only */}
          <span
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 whitespace-nowrap border"
            style={{
              fontSize: "var(--font-size-small)",
              fontWeight: "var(--font-weight-medium)",
              background: `oklch(from ${dotColor} l c h / 12%)`,
              color: dotColor,
              borderColor: `oklch(from ${dotColor} l c h / 30%)`,
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

        {/* Next step text — left-border accent, 2-line clamp */}
        <p
          className="line-clamp-2 mb-2"
          style={{
            fontSize: "var(--font-size-body)",
            lineHeight: "var(--line-height-body)",
            color: "var(--color-text-primary)",
            fontWeight: "var(--font-weight-regular)",
            borderLeft: "2px solid oklch(from var(--color-accent-primary) l c h / 65%)",
            paddingLeft: "var(--spacing-sm)",
          }}
        >
          {account.nextStepText}
        </p>

        {/* Last contact date — right-aligned */}
        <div className="flex justify-end">
          <span
            style={{
              fontSize: "var(--font-size-small)",
              color: "var(--color-text-secondary)",
            }}
          >
            {lastContact}
          </span>
        </div>
      </a>

    </div>
  )
}

// ---------------------------------------------------------------------------
// WhatsNextSkeletonCard
// ---------------------------------------------------------------------------

function WhatsNextSkeletonCard() {
  return (
    <div
      className="rounded-[var(--radius-card)] border overflow-hidden"
      style={{
        background: "var(--color-surface-card)",
        borderColor: "var(--color-border-default)",
      }}
    >
      <div className="p-4">
        {/* Header row: wide name bar + small pill */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <Skeleton className="h-5 w-40 flex-1 max-w-[200px]" />
          <Skeleton className="h-5 w-20 rounded-full shrink-0" />
        </div>

        {/* Two narrow bars for next step text */}
        <div className="flex flex-col gap-1.5 mb-2 pl-3 border-l-2" style={{ borderColor: "oklch(from var(--color-accent-primary) l c h / 40%)" }}>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Thin date bar — right-aligned */}
        <div className="flex justify-end">
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// WhatsNextEmptyState
// ---------------------------------------------------------------------------

function WhatsNextEmptyState() {
  const { open } = useQuickLog()
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <ClipboardList
        style={{
          width: "var(--icon-size-xl)",
          height: "var(--icon-size-xl)",
          color: "var(--color-accent-primary)",
          opacity: 0.5,
        }}
        aria-hidden
      />
      <h3
        className="font-bold"
        style={{
          fontSize: "var(--font-size-h3)",
          lineHeight: "var(--line-height-heading)",
          color: "var(--color-text-primary)",
        }}
      >
        No accounts yet
      </h3>
      <p
        style={{
          fontSize: "var(--font-size-body)",
          color: "var(--color-text-secondary)",
          maxWidth: "28ch",
        }}
      >
        Log a call to start building your book.
      </p>
      <Button onClick={() => open()}>
        <PhoneCall data-icon="inline-start" />
        Log a call
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// WhatsNextList
// ---------------------------------------------------------------------------

interface WhatsNextListProps {
  accounts: WhatsNextAccount[]
  today: Date
  onCardClick: (account: WhatsNextAccount) => void
}

function WhatsNextList({ accounts, today, onCardClick }: WhatsNextListProps) {
  if (accounts.length === 0) {
    return <WhatsNextEmptyState />
  }

  const sorted = sortAccounts(accounts)

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((account) => (
        <WhatsNextCard
          key={account.id}
          account={account}
          today={today}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// BusinessViewContent — mounts per selected business, fetches its history
// ---------------------------------------------------------------------------

interface HistoryEntryResponse {
  id: string
  date: string
  stage: string
  outcome: "sold" | "not_sold" | "follow_up"
  ask?: { amount: number; term: string; confidence: string }
  nextStep: string
}

interface BusinessViewContentProps {
  business: BusinessViewData
  onStageChange: (stage: CurrentStage) => void
  onNextStepChange: (text: string) => void
}

function BusinessViewContent({ business, onStageChange, onNextStepChange }: BusinessViewContentProps) {
  const { data, initialLoading } = useFetch<HistoryEntryResponse[]>(`/api/businesses/${business.id}/history`)
  const entries: InteractionEntry[] = (data ?? []).map((e) => ({ ...e, date: new Date(e.date) }))

  return (
    <>
      <BusinessHeader
        business={business}
        onStageChange={onStageChange}
        onNextStepChange={onNextStepChange}
      />
      <Separator style={{ background: "var(--color-border-default)" }} />
      <InteractionHistory entries={entries} isLoading={initialLoading} />
    </>
  )
}

// ---------------------------------------------------------------------------
// WhatsNextPage
// ---------------------------------------------------------------------------

export default function WhatsNextPage() {
  const today = new Date()
  const { data, setData, loading, refetch } = useFetch<WhatsNextAccount[]>("/api/whats-next")
  const accounts = data ?? []

  const { open: openQuickLog, onCallLogged } = useQuickLog()

  useEffect(() => onCallLogged(refetch), [onCallLogged, refetch])

  const [selectedBusiness, setSelectedBusiness] = useState<BusinessViewData | null>(null)
  const isOverlayOpen = selectedBusiness !== null

  const openBusinessView = useCallback((account: WhatsNextAccount) => {
    setSelectedBusiness(toBusinessViewData(account))
  }, [])

  const handleOverlayClose = useCallback(() => {
    if (selectedBusiness && data) {
      setData(data.map((a) =>
        a.id === selectedBusiness.id
          ? { ...a, stage: selectedBusiness.stage, nextStepText: selectedBusiness.nextStepText }
          : a
      ))
    }
    setSelectedBusiness(null)
  }, [selectedBusiness, data, setData])

  const handleLogCallFromOverlay = useCallback(() => {
    if (!selectedBusiness) return
    openQuickLog({ businessId: selectedBusiness.id, businessName: selectedBusiness.name })
  }, [selectedBusiness, openQuickLog])

  return (
    <>
      <div className="p-4 md:p-8 flex flex-col gap-4 max-w-3xl mx-auto w-full">
        <PageHeader
          title="What's Next"
          accessory={loading ? undefined : <AccountCount count={accounts.length} />}
        />
        {data === null ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <WhatsNextSkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <WhatsNextList
            accounts={accounts}
            today={today}
            onCardClick={openBusinessView}
          />
        )}
      </div>

      {/* Business View overlay */}
      <BusinessView
        open={isOverlayOpen}
        onClose={handleOverlayClose}
        title={selectedBusiness?.name ?? "Business details"}
      >
        {selectedBusiness && (
          <BusinessViewContent
            business={selectedBusiness}
            onStageChange={(stage) =>
              setSelectedBusiness((prev) => prev ? { ...prev, stage } : prev)
            }
            onNextStepChange={(nextStepText) =>
              setSelectedBusiness((prev) => prev ? { ...prev, nextStepText } : prev)
            }
          />
        )}
      </BusinessView>
    </>
  )
}

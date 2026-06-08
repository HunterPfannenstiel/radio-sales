"use client"

import React, { useState, useCallback, useEffect } from "react"
import { ClipboardList, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BusinessCard, type BusinessCardData } from "@/components/BusinessCard"
import { BusinessView } from "@/components/BusinessView"
import { BusinessHeader, type BusinessViewData, type PipelineStage } from "@/app/whats-next/BusinessHeader"
import { useQuickLog } from "@/components/QuickLogContext"
import { useFetch } from "@/hooks/useFetch"
import { useRequest } from "@/hooks/useRequest"
import { Separator } from "@/components/ui/separator"
import { InteractionHistory, type InteractionEntry } from "@/components/InteractionHistory"
import type { InteractionHistoryEntryDTO } from "@/server/queries/BusinessInteractionHistoryQuery"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toBusinessViewData(business: BusinessCardData): BusinessViewData {
  const stageMap: Record<string, PipelineStage> = {
    approach: "approach",
    uncover: "uncover",
    present: "present",
    close: "close",
    service_upsell: "service",
  }

  return {
    id: business.id,
    name: business.name,
    stage: stageMap[business.stage] ?? "approach",
    nextStepText: business.nextStepText || "No next step recorded.",
  }
}

function dtoToEntry(dto: InteractionHistoryEntryDTO): InteractionEntry {
  return {
    id: dto.id,
    date: new Date(dto.date),
    stage: dto.stage,
    outcome: dto.outcome,
    ask: dto.ask,
    nextStep: dto.nextStep,
  }
}

// ---------------------------------------------------------------------------
// BusinessCardSkeleton — inline shimmer, matches card shape
// ---------------------------------------------------------------------------

function BusinessCardSkeleton() {
  return (
    <div
      className="rounded-[--radius-card] border overflow-hidden"
      style={{
        background: "var(--color-surface-card)",
        borderColor: "var(--color-border-default)",
      }}
      aria-hidden
    >
      <div className="p-4 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          {/* Name placeholder */}
          <div
            className="h-5 rounded-md animate-pulse flex-1 max-w-[60%]"
            style={{ background: "var(--color-surface-subtle)" }}
          />
          {/* Badge placeholder */}
          <div
            className="h-5 rounded-full animate-pulse w-20 shrink-0"
            style={{ background: "var(--color-surface-subtle)" }}
          />
        </div>
        {/* Body text — two lines */}
        <div className="flex flex-col gap-2">
          <div
            className="h-3.5 rounded animate-pulse"
            style={{ background: "var(--color-surface-subtle)" }}
          />
          <div
            className="h-3.5 rounded animate-pulse w-3/4"
            style={{ background: "var(--color-surface-subtle)" }}
          />
        </div>
      </div>
      {/* Divider */}
      <div style={{ height: "1px", background: "var(--color-border-subtle)" }} />
      {/* Footer */}
      <div className="flex justify-end px-4 py-3">
        <div
          className="h-8 rounded-md animate-pulse w-20"
          style={{ background: "var(--color-surface-subtle)" }}
        />
      </div>
    </div>
  )
}

interface BusinessCardSkeletonGroupProps {
  count?: number
}

function BusinessCardSkeletonGroup({ count = 3 }: BusinessCardSkeletonGroupProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <BusinessCardSkeleton key={i} />
      ))}
    </>
  )
}

// ---------------------------------------------------------------------------
// WhatsNextEmptyState — inline, follows design standards empty state template
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
// WhatsNextPage
// ---------------------------------------------------------------------------

export default function WhatsNextPage() {
  const { data, loading, error } = useFetch<BusinessCardData[]>("/api/whats-next")
  const { open: openQuickLog } = useQuickLog()

  const [selectedBusiness, setSelectedBusiness] = useState<BusinessViewData | null>(null)
  const isOverlayOpen = selectedBusiness !== null

  const [interactionEntries, setInteractionEntries] = useState<InteractionEntry[]>([])
  const { execute: fetchHistory } = useRequest<InteractionHistoryEntryDTO[]>()

  useEffect(() => {
    if (!selectedBusiness) {
      setInteractionEntries([])
      return
    }
    fetchHistory(`/api/businesses/${selectedBusiness.id}/history`).then((dtos) => {
      if (dtos) {
        setInteractionEntries(dtos.map(dtoToEntry))
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusiness?.id])

  const handleCardPress = useCallback((business: BusinessCardData) => {
    setSelectedBusiness(toBusinessViewData(business))
  }, [])

  const handleOverlayClose = useCallback(() => {
    setSelectedBusiness(null)
  }, [])

  const handleLogCall = useCallback(() => {
    if (!selectedBusiness) return
    openQuickLog({
      businessId: selectedBusiness.id,
      businessName: selectedBusiness.name,
    })
  }, [selectedBusiness, openQuickLog])

  return (
    <>
      <div className="p-4 md:p-6 flex flex-col gap-4 max-w-3xl mx-auto w-full">
        <h1
          className="font-bold tracking-tight"
          style={{
            fontSize: "var(--font-size-h1)",
            lineHeight: "var(--line-height-heading)",
            color: "var(--color-text-primary)",
          }}
        >
          What&apos;s Next
        </h1>

        {loading && <BusinessCardSkeletonGroup count={3} />}

        {error && (
          <p style={{ fontSize: "var(--font-size-body)", color: "var(--color-status-warning)" }}>
            Failed to load accounts.
          </p>
        )}

        {!loading && !error && data?.length === 0 && <WhatsNextEmptyState />}

        {!loading && !error && data?.map((b) => (
          <BusinessCard key={b.id} business={b} onPress={handleCardPress} />
        ))}
      </div>

      {/* Business View overlay — renders outside the page scroll area */}
      <BusinessView
        open={isOverlayOpen}
        onClose={handleOverlayClose}
        title={selectedBusiness?.name ?? "Business details"}
      >
        {selectedBusiness && (
          <>
            <BusinessHeader
              business={selectedBusiness}
              onLogCall={handleLogCall}
              onStageChange={(stage) =>
                setSelectedBusiness((prev) =>
                  prev ? { ...prev, stage } : prev
                )
              }
              onNextStepChange={(nextStepText) =>
                setSelectedBusiness((prev) =>
                  prev ? { ...prev, nextStepText } : prev
                )
              }
            />
            <Separator style={{ background: "var(--color-border-default)" }} />
            <InteractionHistory
              entries={interactionEntries}
              onLogCall={handleLogCall}
            />
          </>
        )}
      </BusinessView>
    </>
  )
}

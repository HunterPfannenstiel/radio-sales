"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { ChevronDown, Mic, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useRequest } from "@/hooks/useRequest"
import { useToast } from "@/hooks/useToast"

// ---------------------------------------------------------------------------
// Pipeline stage definition
// ---------------------------------------------------------------------------

export type PipelineStage =
  | "approach"
  | "uncover"
  | "present"
  | "close"
  | "service"

export const STAGE_LABELS: Record<PipelineStage, string> = {
  approach: "Approach",
  uncover: "Uncover",
  present: "Present",
  close: "Close",
  service: "Service",
}

export const STAGE_ORDERED: PipelineStage[] = [
  "approach",
  "uncover",
  "present",
  "close",
  "service",
]

/** Returns the 1-based ordinal position (1–5) for segment fill */
export const STAGE_POSITION: Record<PipelineStage, number> = {
  approach: 1,
  uncover: 2,
  present: 3,
  close: 4,
  service: 5,
}

// ---------------------------------------------------------------------------
// BusinessViewData — shape consumed by BusinessHeader
// ---------------------------------------------------------------------------

export type BusinessViewData = {
  id: string
  name: string
  stage: PipelineStage
  nextStepText: string
}

// ---------------------------------------------------------------------------
// PipelineIndicator — 5 filled/unfilled segments
// ---------------------------------------------------------------------------

interface PipelineIndicatorProps {
  position: number // 1-based, how many segments are filled
}

function PipelineIndicator({ position }: PipelineIndicatorProps) {
  return (
    <div
      className="flex items-center shrink-0"
      role="img"
      aria-label={`Pipeline position ${position} of 5`}
      style={{ gap: "2px" }}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          style={{
            width: "6px",
            height: "8px",
            borderRadius: "var(--radius-sm)",
            background:
              i < position
                ? "var(--color-accent-primary)"
                : "var(--color-border-default)",
            transition: `background var(--duration-fast)`,
          }}
          aria-hidden
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// StagePicker — dropdown anchored below the stage badge
// ---------------------------------------------------------------------------

interface StagePickerProps {
  currentStage: PipelineStage
  onSelect: (stage: PipelineStage) => void
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
}

function StagePicker({
  currentStage,
  onSelect,
  onClose,
  anchorRef,
}: StagePickerProps) {
  const [hovered, setHovered] = useState<PipelineStage | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Position the dropdown below the anchor
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })

  useEffect(() => {
    function computePosition() {
      const anchor = anchorRef.current
      const dropdown = dropdownRef.current
      if (!anchor || !dropdown) return

      const anchorRect = anchor.getBoundingClientRect()
      const dropdownHeight = dropdown.offsetHeight
      const viewportHeight = window.innerHeight
      const GAP = 4

      const spaceBelow =
        viewportHeight - anchorRect.bottom - GAP
      const fitsBelow = spaceBelow >= dropdownHeight

      const top = fitsBelow
        ? anchorRect.bottom + GAP + window.scrollY
        : anchorRect.top - dropdownHeight - GAP + window.scrollY

      setPosition({
        top,
        left: anchorRect.left + window.scrollX,
      })
    }

    computePosition()
    window.addEventListener("resize", computePosition)
    window.addEventListener("scroll", computePosition, true)
    return () => {
      window.removeEventListener("resize", computePosition)
      window.removeEventListener("scroll", computePosition, true)
    }
  }, [anchorRef])

  // Dismiss on outside click or Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        anchorRef.current &&
        !anchorRef.current.contains(target)
      ) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("pointerdown", handlePointerDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [onClose, anchorRef])

  const previewPosition = hovered
    ? STAGE_POSITION[hovered]
    : STAGE_POSITION[currentStage]

  return (
    <div
      ref={dropdownRef}
      role="listbox"
      aria-label="Select pipeline stage"
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 50,
        minWidth: "220px",
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border-default)",
        borderRadius: "var(--radius-md)",
        boxShadow: "0 4px 16px oklch(0.145 0 0 / 10%)",
        overflow: "hidden",
      }}
    >
      {/* Mini pipeline preview header */}
      <div
        style={{
          padding: "10px 12px 8px",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}
      >
        <PipelineIndicator position={previewPosition} />
      </div>

      {/* Stage rows */}
      <div style={{ padding: "4px 0" }}>
        {STAGE_ORDERED.map((stage, index) => {
          const isCurrent = stage === currentStage
          const isHovered = stage === hovered

          return (
            <button
              key={stage}
              role="option"
              aria-selected={isCurrent}
              onClick={() => {
                onSelect(stage)
              }}
              onMouseEnter={() => setHovered(stage)}
              onMouseLeave={() => setHovered(null)}
              className="w-full text-left flex items-center transition-colors"
              style={{
                gap: "10px",
                padding: "8px 12px",
                background: isHovered
                  ? "var(--color-surface-subtle)"
                  : "transparent",
                transitionDuration: "var(--duration-fast)",
                cursor: "pointer",
                border: "none",
              }}
            >
              {/* Position number */}
              <span
                style={{
                  fontSize: "var(--font-size-micro)",
                  color: "var(--color-text-disabled)",
                  width: "12px",
                  textAlign: "right",
                  flexShrink: 0,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {index + 1}
              </span>

              {/* Stage indicator circle */}
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: isCurrent
                    ? "var(--color-accent-primary)"
                    : "transparent",
                  border: isCurrent
                    ? "none"
                    : "1.5px solid var(--color-border-default)",
                  transition: `background var(--duration-fast), border var(--duration-fast)`,
                }}
                aria-hidden
              />

              {/* Stage name */}
              <span
                style={{
                  fontSize: "var(--font-size-body)",
                  color: "var(--color-text-primary)",
                  fontWeight: isCurrent
                    ? "var(--font-weight-medium)"
                    : "var(--font-weight-regular)",
                }}
              >
                {STAGE_LABELS[stage]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// StageBadge — filled pill with ChevronDown affordance
// ---------------------------------------------------------------------------

interface StageBadgeProps {
  stage: PipelineStage
  isOpen: boolean
  buttonRef: React.RefObject<HTMLButtonElement | null>
  onPress?: () => void
}

function StageBadge({ stage, isOpen, buttonRef, onPress }: StageBadgeProps) {
  const label = STAGE_LABELS[stage]

  return (
    <button
      ref={buttonRef}
      onClick={onPress}
      aria-label={`Stage: ${label}. Tap to change`}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      className="inline-flex items-center gap-1 shrink-0 transition-opacity"
      style={{
        background: "var(--color-accent-primary)",
        color: "var(--color-text-inverse)",
        borderRadius: "var(--radius-sm)",
        padding: "2px 8px 2px 8px",
        fontSize: "var(--font-size-body)",
        fontWeight: "var(--font-weight-medium)",
        lineHeight: 1.5,
        transitionDuration: "var(--duration-fast)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.88"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1"
      }}
    >
      {label}
      <ChevronDown size={16} aria-hidden />
    </button>
  )
}

// ---------------------------------------------------------------------------
// NextStepEditor — inline textarea replacing the callout
// ---------------------------------------------------------------------------

interface NextStepEditorProps {
  initialValue: string
  onSave: (value: string) => void
  onCancel: () => void
  isSaving: boolean
}

function NextStepEditor({
  initialValue,
  onSave,
  onCancel,
  isSaving,
}: NextStepEditorProps) {
  const [value, setValue] = useState(initialValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Auto-focus and place cursor at end on mount
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.focus()
    el.setSelectionRange(el.value.length, el.value.length)
  }, [])

  // Auto-resize
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        if (value.trim()) onSave(value.trim())
      }
    },
    [value, onSave]
  )

  const canSave = value.trim().length > 0 && !isSaving

  return (
    <div className="flex flex-col gap-2">
      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <span
          style={{
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-text-secondary)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Next Step
        </span>

        {/* Cancel — desktop: top-right inline */}
        {isDesktop && (
          <button
            onClick={onCancel}
            disabled={isSaving}
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--color-text-secondary)",
              background: "transparent",
              border: "none",
              padding: "0 2px",
              cursor: "pointer",
              transitionDuration: "var(--duration-fast)",
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        disabled={isSaving}
        style={{
          width: "100%",
          resize: "none",
          overflow: "hidden",
          fontSize: "var(--font-size-body)",
          lineHeight: "var(--line-height-body)",
          color: "var(--color-text-primary)",
          background: "var(--color-surface-card)",
          border: "1px solid var(--color-border-default)",
          borderRadius: "var(--radius-sm)",
          padding: "8px 10px",
          outline: "none",
          transition: `border-color var(--duration-fast)`,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border-strong)"
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border-default)"
        }}
      />

      {/* Button row */}
      {isDesktop ? (
        <div className="flex items-center justify-end gap-3">
          {/* Keyboard hint */}
          <span
            style={{
              fontSize: "var(--font-size-micro)",
              color: "var(--color-text-disabled)",
              marginRight: "auto",
            }}
          >
            ⌘ Return to save
          </span>

          {/* Save */}
          <button
            onClick={() => { if (canSave) onSave(value.trim()) }}
            disabled={!canSave}
            style={{
              fontSize: "var(--font-size-body)",
              color: canSave
                ? "var(--color-accent-primary)"
                : "var(--color-text-disabled)",
              background: "transparent",
              border: "none",
              padding: "0 2px",
              cursor: canSave ? "pointer" : "default",
              transitionDuration: "var(--duration-fast)",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            Save
          </button>
        </div>
      ) : (
        /* Mobile: stacked full-width buttons */
        <div className="flex flex-col gap-2">
          {/* Cancel — outlined, stacked above */}
          <button
            onClick={onCancel}
            disabled={isSaving}
            style={{
              width: "100%",
              minHeight: "var(--touch-target-min)",
              fontSize: "var(--font-size-body)",
              color: "var(--color-text-secondary)",
              background: "transparent",
              border: "1px solid var(--color-border-default)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            Cancel
          </button>

          {/* Save — primary fill */}
          <button
            onClick={() => { if (canSave) onSave(value.trim()) }}
            disabled={!canSave}
            style={{
              width: "100%",
              minHeight: "var(--touch-target-min)",
              fontSize: "var(--font-size-body)",
              color: "var(--color-text-inverse)",
              background: canSave
                ? "var(--color-accent-primary)"
                : "var(--color-surface-subtle)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              cursor: canSave ? "pointer" : "default",
              fontWeight: "var(--font-weight-medium)",
              transition: `background var(--duration-fast)`,
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// NextStepCallout — static read view
// ---------------------------------------------------------------------------

interface NextStepCalloutProps {
  text: string
  onEdit?: () => void
}

function NextStepCallout({ text, onEdit }: NextStepCalloutProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <span
          style={{
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-text-secondary)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Next Step
        </span>
        <button
          onClick={onEdit}
          aria-label="Edit next step"
          className="flex items-center justify-center transition-colors"
          style={{
            width: "var(--touch-target-min)",
            height: "var(--touch-target-min)",
            color: "var(--color-text-secondary)",
            transitionDuration: "var(--duration-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-text-primary)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-secondary)"
          }}
        >
          <Pencil size={16} aria-hidden />
        </button>
      </div>

      {/* Callout value — left border accent, no background */}
      <p
        style={{
          fontSize: "var(--font-size-body)",
          fontWeight: "var(--font-weight-regular)",
          lineHeight: "var(--line-height-body)",
          color: "var(--color-text-primary)",
          borderLeft: "3px solid oklch(from var(--color-accent-primary) l c h / 50%)",
          paddingLeft: "var(--spacing-sm)",
          paddingTop: "2px",
          paddingBottom: "2px",
        }}
      >
        {text}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// BusinessHeader
// ---------------------------------------------------------------------------

interface BusinessHeaderProps {
  business: BusinessViewData
  /** Called when Log call is pressed */
  onLogCall?: () => void
  /** Callback to sync optimistic state back to the page */
  onStageChange?: (stage: PipelineStage) => void
  onNextStepChange?: (nextStep: string) => void
}

export function BusinessHeader({
  business,
  onLogCall,
  onStageChange,
  onNextStepChange,
}: BusinessHeaderProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Local optimistic state
  const [stage, setStage] = useState<PipelineStage>(business.stage)
  const [nextStepText, setNextStepText] = useState(business.nextStepText)

  // Sync if parent hands us a new business object (e.g. selected business changed)
  useEffect(() => {
    setStage(business.stage)
    setNextStepText(business.nextStepText)
  }, [business.id, business.stage, business.nextStepText])

  // Which editor is open
  const [openEditor, setOpenEditor] = useState<"stage" | "nextstep" | null>(
    null
  )

  const stageBadgeRef = useRef<HTMLButtonElement>(null)
  const { execute: execRequest } = useRequest()
  const { toastError } = useToast()

  const position = STAGE_POSITION[stage]

  // ---- Stage selection ----
  const handleStageSelect = useCallback(
    async (newStage: PipelineStage) => {
      const previousStage = stage

      // Optimistic update
      setStage(newStage)
      onStageChange?.(newStage)
      setOpenEditor(null)

      const result = await execRequest(
        `/api/businesses/${business.id}/stage`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: newStage }),
        }
      )

      if (result === null) {
        // useRequest already showed a toast; revert
        setStage(previousStage)
        onStageChange?.(previousStage)
        toastError("Could not update stage — changes reverted.")
      }
    },
    [stage, business.id, execRequest, onStageChange, toastError]
  )

  // ---- Next step save ----
  const [isSavingNextStep, setIsSavingNextStep] = useState(false)

  const handleNextStepSave = useCallback(
    async (newValue: string) => {
      const previousValue = nextStepText

      // Optimistic update
      setNextStepText(newValue)
      onNextStepChange?.(newValue)
      setOpenEditor(null)
      setIsSavingNextStep(true)

      const result = await execRequest(
        `/api/businesses/${business.id}/next-step`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nextStep: newValue }),
        }
      )

      setIsSavingNextStep(false)

      if (result === null) {
        // revert
        setNextStepText(previousValue)
        onNextStepChange?.(previousValue)
        toastError("Could not update next step — changes reverted.")
      }
    },
    [nextStepText, business.id, execRequest, onNextStepChange, toastError]
  )

  return (
    <div
      className="flex flex-col"
      style={{
        padding: "var(--spacing-md) var(--spacing-md) var(--spacing-lg) var(--spacing-md)",
        gap: "var(--spacing-md)",
      }}
    >
      {/* Business name */}
      <h2
        className="truncate"
        title={business.name}
        style={{
          fontSize: "var(--font-size-h2)",
          fontWeight: "var(--font-weight-bold)",
          lineHeight: "var(--line-height-heading)",
          color: "var(--color-text-primary)",
        }}
      >
        {business.name}
      </h2>

      {/* Stage row — pipeline indicator + stage badge + (desktop) log call button */}
      <div className="flex items-center gap-3 flex-wrap">
        <PipelineIndicator position={position} />
        <StageBadge
          stage={stage}
          isOpen={openEditor === "stage"}
          buttonRef={stageBadgeRef}
          onPress={() =>
            setOpenEditor((prev) => (prev === "stage" ? null : "stage"))
          }
        />

        {/* Log call — desktop: inline beside badge; mobile: below (rendered separately) */}
        {isDesktop && (
          <div className="ml-auto">
            <Button
              onClick={onLogCall}
              aria-label={`Log call for ${business.name}`}
              style={{
                background: "var(--color-accent-primary)",
                color: "var(--color-text-inverse)",
                border: "none",
              }}
            >
              <Mic data-icon="inline-start" />
              Log call
            </Button>
          </div>
        )}
      </div>

      {/* StagePicker dropdown — portaled via absolute positioning */}
      {openEditor === "stage" && (
        <StagePicker
          currentStage={stage}
          onSelect={handleStageSelect}
          onClose={() => setOpenEditor(null)}
          anchorRef={stageBadgeRef}
        />
      )}

      {/* Next step — editor or callout */}
      {openEditor === "nextstep" ? (
        <NextStepEditor
          initialValue={nextStepText}
          onSave={handleNextStepSave}
          onCancel={() => setOpenEditor(null)}
          isSaving={isSavingNextStep}
        />
      ) : (
        <NextStepCallout
          text={nextStepText}
          onEdit={() => setOpenEditor("nextstep")}
        />
      )}

      {/* Log call — mobile only, full-width below next step */}
      {!isDesktop && (
        <Button
          className="w-full"
          onClick={onLogCall}
          aria-label={`Log call for ${business.name}`}
          style={{
            background: "var(--color-accent-primary)",
            color: "var(--color-text-inverse)",
            border: "none",
          }}
        >
          <Mic data-icon="inline-start" />
          Log call
        </Button>
      )}
    </div>
  )
}

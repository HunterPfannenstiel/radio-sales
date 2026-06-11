"use client"

import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react"
import { useRequest } from "@/hooks/useRequest"
import { useToast } from "@/hooks/useToast"
import { type CurrentStage, STAGE_LABELS, STAGE_ORDERED, STAGE_POSITION } from "@/lib/types"

export type { CurrentStage }

// ---------------------------------------------------------------------------
// BusinessViewData — shape consumed by BusinessHeader
// ---------------------------------------------------------------------------

export type BusinessViewData = {
  id: string
  name: string
  stage: CurrentStage
  nextStepText: string
}

// ---------------------------------------------------------------------------
// PipelineIndicator — 5 filled/unfilled segments
// ---------------------------------------------------------------------------

interface PipelineIndicatorProps {
  position: number
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
// NextStep — unified read/edit field
// ---------------------------------------------------------------------------

interface NextStepProps {
  text: string
  onSave: (value: string) => void
  isSaving: boolean
}

function NextStep({ text, onSave, isSaving }: NextStepProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(text)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!editing) setValue(text)
  }, [text, editing])

  const startEdit = useCallback(() => {
    setValue(text)
    setEditing(true)
  }, [text])

  useEffect(() => {
    if (!editing) return
    const el = textareaRef.current
    if (!el) return
    el.focus()
    el.setSelectionRange(el.value.length, el.value.length)
  }, [editing])

  useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [value, editing])

  const cancel = useCallback(() => {
    setEditing(false)
    setValue(text)
  }, [text])

  const save = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || isSaving) return
    setEditing(false)
    onSave(trimmed)
  }, [value, isSaving, onSave])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        save()
      }
      if (e.key === "Escape") {
        e.preventDefault()
        cancel()
      }
    },
    [save, cancel]
  )

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    fontSize: "var(--font-size-body)",
    lineHeight: "var(--line-height-body)",
    color: "var(--color-text-primary)",
    background: "transparent",
    border: `1px solid ${editing ? "var(--color-border-default)" : "var(--color-border-subtle)"}`,
    borderRadius: "var(--radius-sm)",
    padding: "7px 10px",
    outline: "none",
    transition: `border-color var(--duration-fast)`,
  }

  return (
    <div className="flex flex-col gap-1">
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

      {editing ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={save}
          rows={1}
          disabled={isSaving}
          style={{
            ...fieldStyle,
            resize: "none",
            overflow: "hidden",
          }}
        />
      ) : (
        <button
          onClick={startEdit}
          aria-label="Edit next step"
          className="w-full text-left"
          style={{
            ...fieldStyle,
            cursor: "text",
          }}
        >
          {text}
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// BusinessHeader
// ---------------------------------------------------------------------------

interface BusinessHeaderProps {
  business: BusinessViewData
  onStageChange?: (stage: CurrentStage) => void
  onNextStepChange?: (nextStep: string) => void
}

export function BusinessHeader({
  business,
  onStageChange,
  onNextStepChange,
}: BusinessHeaderProps) {
  const [stage, setStage] = useState<CurrentStage>(business.stage)
  const [nextStepText, setNextStepText] = useState(business.nextStepText)

  useEffect(() => {
    setStage(business.stage)
    setNextStepText(business.nextStepText)
  }, [business.id, business.stage, business.nextStepText])

  const { execute: execRequest } = useRequest()
  const { toastError } = useToast()

  const handleStageSelect = useCallback(
    async (newStage: CurrentStage) => {
      const previousStage = stage

      setStage(newStage)
      onStageChange?.(newStage)

      const result = await execRequest(
        `/api/businesses/${business.id}/stage`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: newStage }),
        }
      )

      if (result === null) {
        setStage(previousStage)
        onStageChange?.(previousStage)
        toastError("Could not update stage — changes reverted.")
      }
    },
    [stage, business.id, execRequest, onStageChange, toastError]
  )

  const [isSavingNextStep, setIsSavingNextStep] = useState(false)

  const handleNextStepSave = useCallback(
    async (newValue: string) => {
      const previousValue = nextStepText

      setNextStepText(newValue)
      onNextStepChange?.(newValue)
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

      <div
        role="group"
        aria-label="Pipeline stage"
        className="flex"
      >
        {STAGE_ORDERED.map((s, i) => {
          const isActive = s === stage
          const isFirst = i === 0
          const isLast = i === STAGE_ORDERED.length - 1
          return (
            <button
              key={s}
              onClick={() => handleStageSelect(s)}
              aria-pressed={isActive}
              className="transition-all"
              style={{
                position: "relative",
                zIndex: isActive ? 1 : 0,
                padding: "3px 10px",
                fontSize: "var(--font-size-body)",
                fontWeight: "var(--font-weight-regular)",
                lineHeight: 1.5,
                borderRadius: isFirst
                  ? "var(--radius-sm) 0 0 var(--radius-sm)"
                  : isLast
                  ? "0 var(--radius-sm) var(--radius-sm) 0"
                  : "0",
                border: `1.5px solid ${isActive ? "var(--color-accent-primary)" : "var(--color-border-default)"}`,
                marginLeft: isFirst ? 0 : "-1.5px",
                background: isActive ? "var(--color-accent-primary)" : "transparent",
                color: isActive ? "var(--color-text-inverse)" : "var(--color-text-secondary)",
                cursor: "pointer",
                transitionDuration: "var(--duration-fast)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.zIndex = "1"
                  e.currentTarget.style.borderColor = "var(--color-accent-primary)"
                  e.currentTarget.style.color = "var(--color-text-primary)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.zIndex = "0"
                  e.currentTarget.style.borderColor = "var(--color-border-default)"
                  e.currentTarget.style.color = "var(--color-text-secondary)"
                }
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.background = isActive
                  ? "var(--color-accent-secondary)"
                  : "var(--color-bg-subtle)"
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.background = isActive
                  ? "var(--color-accent-primary)"
                  : "transparent"
              }}
            >
              {STAGE_LABELS[s]}
            </button>
          )
        })}
      </div>

      <NextStep
        text={nextStepText}
        onSave={handleNextStepSave}
        isSaving={isSavingNextStep}
      />
    </div>
  )
}

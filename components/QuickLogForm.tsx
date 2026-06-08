"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useRequest } from "@/hooks/useRequest"
import { useFetch } from "@/hooks/useFetch"
import type { BusinessDTO } from "@/server/queries/SearchBusinessesQuery"

export type QuickLogFormProps = {
  prefill?: { businessId?: string; businessName?: string } | null
  onClose: () => void
}

const STAGES = [
  { value: "approach", label: "Approach" },
  { value: "uncover", label: "Uncover" },
  { value: "present", label: "Present" },
  { value: "close", label: "Close" },
  { value: "service_upsell", label: "Service / Upsell" },
]

const NEXT_STEPS = [
  { value: "followup_call", label: "Follow-up call" },
  { value: "send_proposal", label: "Send proposal" },
  { value: "schedule_demo", label: "Schedule demo" },
  { value: "send_contract", label: "Send contract" },
  { value: "check_in", label: "Check in" },
]

const WHATS_NEXT_CONTEXT: Record<string, string[]> = {
  approach: ["followup_call", "schedule_demo"],
  uncover: ["followup_call", "send_proposal", "schedule_demo"],
  present: ["send_contract", "send_proposal", "followup_call"],
  close: ["send_contract", "followup_call"],
  service_upsell: ["check_in", "followup_call"],
}

const CONFIDENCE_OPTIONS = [
  { value: "in", label: "IN" },
  { value: "sure", label: "SURE" },
  { value: "expect", label: "EXPECT" },
  { value: "hope", label: "HOPE" },
]

const CONFIDENCE_STYLES: Record<string, { bg: string; color: string }> = {
  in: {
    bg: "var(--color-accent-primary)",
    color: "var(--color-text-inverse)",
  },
  sure: {
    bg: "color-mix(in oklch, var(--color-accent-primary) 60%, transparent)",
    color: "var(--color-text-primary)",
  },
  expect: {
    bg: "color-mix(in oklch, var(--color-accent-primary) 30%, transparent)",
    color: "var(--color-text-primary)",
  },
  hope: {
    bg: "color-mix(in oklch, var(--color-accent-primary) 15%, transparent)",
    color: "var(--color-text-secondary)",
  },
}

const OUTCOME_OPTIONS = [
  { value: "sold", label: "Sold" },
  { value: "not_sold", label: "Not sold" },
  { value: "follow_up", label: "Follow up" },
]

const OUTCOME_STYLES: Record<string, { bg: string; color: string; border?: string }> = {
  sold: {
    bg: "var(--color-status-success)",
    color: "var(--color-text-inverse)",
  },
  not_sold: {
    bg: "var(--color-status-warning)",
    color: "var(--color-text-inverse)",
  },
  follow_up: {
    bg: "var(--color-surface-subtle)",
    color: "var(--color-text-primary)",
    border: "var(--color-border-default)",
  },
}

export function QuickLogForm({ prefill, onClose }: QuickLogFormProps) {
  const [business, setBusiness] = useState(prefill?.businessName ?? "")
  const [stage, setStage] = useState("")
  const [whatNext, setWhatNext] = useState("")
  const [budget, setBudget] = useState("")
  const [termValue, setTermValue] = useState("")
  const [termUnit, setTermUnit] = useState<"weeks" | "months">("weeks")
  const [confidence, setConfidence] = useState("")
  const [outcome, setOutcome] = useState<"sold" | "not_sold" | "follow_up">("follow_up")

  const [selectedBusinessId, setSelectedBusinessId] = useState<string | undefined>(
    prefill?.businessId
  )
  const [suggestions, setSuggestions] = useState<BusinessDTO[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const isBusinessLocked = Boolean(prefill?.businessName)

  const { data: recentBusinesses } = useFetch<BusinessDTO[]>("/api/businesses/recent")

  const { execute: searchBusinesses } = useRequest<BusinessDTO[]>()
  const { execute: submitCallLog, loading, error: submitError } = useRequest<{
    callLogId: string
    businessId: string
  }>()

  const showAskNudge = stage === "present" || stage === "close"

  const termWeeks = parseInt(termValue, 10)
  const approxMonths =
    termUnit === "weeks" && termWeeks > 0 ? Math.floor(termWeeks / 4) : null

  const canSubmit =
    business.trim().length > 0 && stage.length > 0 && whatNext.length > 0 && !loading

  const contextualKeys = stage ? (WHATS_NEXT_CONTEXT[stage] ?? []) : []
  const contextualOptions = contextualKeys
    .map((k) => NEXT_STEPS.find((s) => s.value === k))
    .filter((s): s is (typeof NEXT_STEPS)[number] => Boolean(s))
  const otherOptions = NEXT_STEPS.filter((s) => !contextualKeys.includes(s.value))
  const hasContext = contextualOptions.length > 0

  const showMruChips =
    !isBusinessLocked &&
    business === "" &&
    Boolean(recentBusinesses && recentBusinesses.length > 0)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleBusinessChange(value: string) {
    setBusiness(value)
    setSelectedBusinessId(undefined)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const results = await searchBusinesses(
        `/api/businesses/search?q=${encodeURIComponent(value)}`
      )
      if (results) {
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
      }
    }, 300)
  }

  function handleBusinessFocus() {
    if (!isBusinessLocked && suggestions.length > 0) setShowSuggestions(true)
  }

  function handleSelectSuggestion(suggestion: BusinessDTO) {
    setBusiness(suggestion.name)
    setSelectedBusinessId(suggestion.id)
    setShowSuggestions(false)
  }

  function handleSelectRecent(b: BusinessDTO) {
    setBusiness(b.name)
    setSelectedBusinessId(b.id)
  }

  function handleConfidenceClick(value: string) {
    if (confidence === value) {
      setConfidence("")
    } else {
      setConfidence(value)
      if (value === "in") setOutcome("sold")
    }
  }

  function handleStageChange(val: string) {
    setStage(val)
    setWhatNext("")
  }

  async function handleSubmit() {
    if (!canSubmit) return
    const result = await submitCallLog("/api/calls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: business,
        businessId: selectedBusinessId,
        stage,
        whatNext,
        budget: budget ? Number(budget) : undefined,
        termValue: termValue ? Number(termValue) : undefined,
        termUnit,
        confidence: confidence || undefined,
        outcome,
      }),
    })
    if (result) onClose()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <FieldGroup className="gap-6">
          {/* Business */}
          <Field>
            <FieldLabel htmlFor="business">
              Business <span className="text-destructive">*</span>
            </FieldLabel>
            <div ref={wrapperRef} className="relative">
              <Input
                id="business"
                placeholder="Search businesses…"
                value={business}
                disabled={isBusinessLocked}
                onChange={(e) => handleBusinessChange(e.target.value)}
                onFocus={handleBusinessFocus}
                className={cn(isBusinessLocked && "bg-muted text-muted-foreground")}
              />
              {showSuggestions && !isBusinessLocked && (
                <ul className="absolute z-50 left-0 right-0 top-full mt-1 rounded-md border border-border bg-popover shadow-md overflow-hidden">
                  {suggestions.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleSelectSuggestion(s)
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {showMruChips && (
              <div className="mt-2">
                <span
                  className="block mb-1.5"
                  style={{
                    fontSize: "var(--font-size-micro)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Recent
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recentBusinesses!.slice(0, 3).map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSelectRecent(b)}
                      className="px-3 py-1 rounded-full border border-border text-sm hover:bg-muted transition-colors"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Field>

          {/* Stage */}
          <Field>
            <FieldLabel>
              Stage <span className="text-destructive">*</span>
            </FieldLabel>
            <ToggleGroup
              type="single"
              orientation="vertical"
              variant="outline"
              className="w-full"
              value={stage}
              onValueChange={handleStageChange}
            >
              {STAGES.map((s) => (
                <ToggleGroupItem key={s.value} value={s.value} className="w-full justify-start">
                  {s.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>

          {/* What's Next — inline radio list */}
          <Field>
            <FieldLabel>
              What&apos;s Next <span className="text-destructive">*</span>
            </FieldLabel>
            {hasContext ? (
              <div className="flex flex-col gap-1.5">
                <ToggleGroup
                  type="single"
                  orientation="vertical"
                  variant="outline"
                  className="w-full"
                  value={whatNext}
                  onValueChange={(val) => setWhatNext(val ?? "")}
                >
                  {contextualOptions.map((s) => (
                    <ToggleGroupItem key={s.value} value={s.value} className="w-full justify-start">
                      {s.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <div className="flex items-center gap-2 py-0.5">
                  <hr
                    className="flex-1"
                    style={{ borderColor: "var(--color-border-subtle)" }}
                  />
                  <span
                    style={{
                      fontSize: "var(--font-size-small)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    Other options
                  </span>
                  <hr
                    className="flex-1"
                    style={{ borderColor: "var(--color-border-subtle)" }}
                  />
                </div>
                <ToggleGroup
                  type="single"
                  orientation="vertical"
                  variant="outline"
                  className="w-full"
                  value={whatNext}
                  onValueChange={(val) => setWhatNext(val ?? "")}
                >
                  {otherOptions.map((s) => (
                    <ToggleGroupItem key={s.value} value={s.value} className="w-full justify-start">
                      {s.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            ) : (
              <ToggleGroup
                type="single"
                orientation="vertical"
                variant="outline"
                className="w-full"
                value={whatNext}
                onValueChange={(val) => setWhatNext(val ?? "")}
              >
                {NEXT_STEPS.map((s) => (
                  <ToggleGroupItem key={s.value} value={s.value} className="w-full justify-start">
                    {s.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          </Field>
        </FieldGroup>

        {/* Ask section divider */}
        <div className="mt-6 mb-4">
          <hr style={{ borderColor: "var(--color-border-subtle)" }} />
          <div className="flex items-baseline justify-between mt-3">
            <span
              style={{
                fontSize: "var(--font-size-h2)",
                fontWeight: "var(--font-weight-bold)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-family-heading)",
                lineHeight: "var(--line-height-heading)",
              }}
            >
              Ask
            </span>
            <span
              style={{
                fontSize: "var(--font-size-small)",
                color: "var(--color-text-secondary)",
              }}
            >
              Optional
            </span>
          </div>
        </div>

        <FieldGroup className="gap-6">
          {/* Nudge — coaching callout */}
          <div
            className={cn(
              "overflow-hidden transition-all",
              showAskNudge ? "opacity-100 max-h-24" : "opacity-0 max-h-0"
            )}
            style={{ transitionDuration: "var(--duration-base)" }}
          >
            <p
              style={{
                background: "var(--color-surface-subtle)",
                borderLeft: "2px solid var(--color-accent-primary)",
                padding: "var(--spacing-sm)",
                fontSize: "var(--font-size-small)",
                color: "var(--color-text-primary)",
                borderRadius: "0 2px 2px 0",
              }}
            >
              Capturing an ask helps your manager support this deal.
            </p>
          </div>

          {/* Budget */}
          <Field>
            <FieldLabel htmlFor="budget">Budget</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="budget"
                type="number"
                placeholder="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min={0}
              />
            </InputGroup>
          </Field>

          {/* Term Length */}
          <Field>
            <FieldLabel htmlFor="term-value">Term Length</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="term-value"
                type="number"
                placeholder="0"
                value={termValue}
                onChange={(e) => setTermValue(e.target.value)}
                className="flex-1"
                min={0}
              />
              <Select
                value={termUnit}
                onValueChange={(v) => setTermUnit((v ?? "weeks") as "weeks" | "months")}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {approxMonths !== null && approxMonths > 0 && (
              <p className="text-xs text-muted-foreground">
                ≈ {approxMonths} {approxMonths === 1 ? "month" : "months"}
              </p>
            )}
          </Field>

          {/* Confidence — opacity gradient pills */}
          <Field>
            <FieldLabel>Confidence</FieldLabel>
            <div role="group" className="flex w-full gap-1">
              {CONFIDENCE_OPTIONS.map((opt) => {
                const isSelected = confidence === opt.value
                const styles = CONFIDENCE_STYLES[opt.value]
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleConfidenceClick(opt.value)}
                    className="flex-1 rounded-md py-2 text-sm font-medium transition-all"
                    style={
                      isSelected
                        ? {
                            background: "var(--color-accent-primary)",
                            color: "var(--color-text-inverse)",
                            outline: "2px solid var(--color-accent-primary)",
                            outlineOffset: "2px",
                          }
                        : {
                            background: styles.bg,
                            color: styles.color,
                          }
                    }
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
            <FieldDescription>Most confident → Least confident</FieldDescription>
          </Field>

          {/* Outcome — semantic color pills */}
          <Field>
            <FieldLabel>Outcome</FieldLabel>
            <div role="group" className="flex w-full gap-1">
              {OUTCOME_OPTIONS.map((opt) => {
                const isSelected = outcome === opt.value
                const styles = OUTCOME_STYLES[opt.value]
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setOutcome(opt.value as "sold" | "not_sold" | "follow_up")}
                    className="flex-1 rounded-md py-2 text-sm font-medium transition-all"
                    style={{
                      background: styles.bg,
                      color: styles.color,
                      opacity: isSelected ? 1 : 0.5,
                      outline: isSelected ? "2px solid var(--color-accent-primary)" : undefined,
                      outlineOffset: isSelected ? "2px" : undefined,
                      border: styles.border ? `1px solid ${styles.border}` : undefined,
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </Field>
        </FieldGroup>
      </div>

      <div
        className="px-4 pt-3 pb-4 border-t border-border bg-popover shrink-0"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        {submitError && (
          <p
            className="mb-2 text-xs text-center"
            style={{ color: "var(--color-status-warning)" }}
          >
            {submitError}
          </p>
        )}
        <Button className="w-full h-10" disabled={!canSubmit} onClick={handleSubmit}>
          {loading ? (
            <>
              <Spinner />
              Logging…
            </>
          ) : (
            "Log Call"
          )}
        </Button>
      </div>
    </div>
  )
}

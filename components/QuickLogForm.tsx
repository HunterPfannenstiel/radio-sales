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

const CONFIDENCE_OPTIONS = [
  { value: "in", label: "IN" },
  { value: "sure", label: "SURE" },
  { value: "expect", label: "EXPECT" },
  { value: "hope", label: "HOPE" },
]

const OUTCOME_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
]

export function QuickLogForm({ prefill, onClose }: QuickLogFormProps) {
  const [business, setBusiness] = useState(prefill?.businessName ?? "")
  const [stage, setStage] = useState("")
  const [whatNext, setWhatNext] = useState("")

  const [budget, setBudget] = useState("")
  const [termValue, setTermValue] = useState("")
  const [termUnit, setTermUnit] = useState<"weeks" | "months">("weeks")
  const [confidence, setConfidence] = useState("")
  const [outcome, setOutcome] = useState("pending")

  const [selectedBusinessId, setSelectedBusinessId] = useState<string | undefined>(
    prefill?.businessId
  )
  const [suggestions, setSuggestions] = useState<BusinessDTO[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const isBusinessLocked = Boolean(prefill?.businessName)

  const { execute: searchBusinesses } = useRequest<BusinessDTO[]>()
  const { execute: submitCallLog, loading } = useRequest<{ callLogId: string; businessId: string }>()

  const showAskNudge = stage === "present" || stage === "close"

  const termWeeks = parseInt(termValue, 10)
  const approxMonths =
    termUnit === "weeks" && termWeeks > 0
      ? Math.floor(termWeeks / 4)
      : null

  const canSubmit =
    business.trim().length > 0 &&
    stage.length > 0 &&
    whatNext.length > 0 &&
    !loading

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
    if (!isBusinessLocked && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  function handleSelectSuggestion(suggestion: BusinessDTO) {
    setBusiness(suggestion.name)
    setSelectedBusinessId(suggestion.id)
    setShowSuggestions(false)
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
          <Field>
            <FieldLabel htmlFor="business">
              Business{" "}
              <span className="text-destructive">*</span>
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
          </Field>

          <Field>
            <FieldLabel>
              Stage{" "}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <ToggleGroup
              type="single"
              orientation="vertical"
              variant="outline"
              className="w-full"
              value={stage}
              onValueChange={(val: string) => setStage(val)}
            >
              {STAGES.map((s) => (
                <ToggleGroupItem
                  key={s.value}
                  value={s.value}
                  className="w-full justify-start"
                >
                  {s.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>

          <Field>
            <FieldLabel>
              What&apos;s Next{" "}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Select value={whatNext} onValueChange={(v) => setWhatNext(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select next step…" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {NEXT_STEPS.map((step) => (
                    <SelectItem key={step.value} value={step.value}>
                      {step.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

        <div className="mt-6 mb-4 flex items-center justify-between">
          <span className="text-sm font-bold">Ask</span>
          <span className="text-xs text-muted-foreground">Optional</span>
        </div>

        <FieldGroup className="gap-6">
          <div
            className={cn(
              "overflow-hidden transition-all duration-200",
              showAskNudge ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
            )}
          >
            <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2 border-l-2 border-l-border">
              Capturing an ask helps your manager support this deal.
            </p>
          </div>

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

          <Field>
            <FieldLabel>Confidence</FieldLabel>
            <ToggleGroup
              type="single"
              className="w-full"
              value={confidence}
              onValueChange={(val: string) => {
                setConfidence(val)
                if (val === "in") setOutcome("yes")
              }}
            >
              {CONFIDENCE_OPTIONS.map((opt) => (
                <ToggleGroupItem key={opt.value} value={opt.value} className="flex-1">
                  {opt.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <FieldDescription>Most confident → Least confident</FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Outcome</FieldLabel>
            <ToggleGroup
              type="single"
              className="w-full"
              value={outcome}
              onValueChange={(val: string) => setOutcome(val || "pending")}
            >
              {OUTCOME_OPTIONS.map((opt) => (
                <ToggleGroupItem key={opt.value} value={opt.value} className="flex-1">
                  {opt.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>
        </FieldGroup>
      </div>

      <div
        className="px-4 pt-3 pb-4 border-t border-border bg-popover"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <Button
          className="w-full h-10"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
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

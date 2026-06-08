# Feature Design: Quick Log Sales Call (Mobile-First)

Source concept: `docs/master/Feature_Concept_Document___Quick_Log_Sales_Call__Mobile-First_.md`

---

## Overview

A rep needs a fast, mobile-first way to record real sales activity in the moment. This form is designed to be completed in seconds. It captures the minimum structured information needed to keep opportunities progressing and to support coaching and accountability.

---

## Container Decision

| Entry point | Container | Business field |
|---|---|---|
| Center tab (mobile) | Bottom sheet (~85% viewport, slides up) | Empty, searchable |
| Sidebar nav item (desktop) | Centered modal | Empty, searchable |
| Account card "Log Call" button | Centered modal | Pre-filled, locked |

The center tab on mobile triggers a bottom sheet rather than navigating to a full-page view. This preserves the rep's current context behind the dimmed sheet and keeps the interaction feeling lightweight. See `docs/design/standards/navigation.md` — Mobile: Bottom Sheet.

On desktop, there is no dedicated Log Call page. The sidebar nav item is an action trigger (opens a modal), not a navigation link. A rep can never be "on the Log Call page" on desktop.

---

## Wireframe (Mobile — Bottom Sheet)

```
┌────────────────────────────┐
│  ░░░░ [dimmed current  ░░░ │
│  ░░░░  view behind it] ░░░ │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░ │
├────────────────────────────┤
│            ─────           │  ← Drag handle
├────────────────────────────┤
│ Cancel          Log a Call │  ← Sheet header
├────────────────────────────┤
│                            │
│  Business *                │
│  ┌────────────────────┐    │
│  │ Search businesses… │    │
│  └────────────────────┘    │
│                            │
│  Stage *                   │
│  ┌────────────────────────┐│
│  │ Approach               ││
│  ├────────────────────────┤│
│  │ Uncover                ││
│  ├────────────────────────┤│
│  │ Present                ││
│  ├────────────────────────┤│
│  │ Close                  ││
│  ├────────────────────────┤│
│  │ Service / Upsell       ││
│  └────────────────────────┘│
│                            │
│  What's Next *             │
│  ┌────────────────────┐    │
│  │ Select next step ▼ │    │
│  └────────────────────┘    │
│                            │
│  ─────── Ask ──── Optional ┤
│                            │
│  [nudge — Present/Close    │
│   only: "Capturing an ask  │
│   helps your manager       │
│   support this deal."]     │
│                            │
│  Budget                    │
│  ┌────────────────────┐    │
│  │ $                  │    │
│  └────────────────────┘    │
│                            │
│  Term Length               │
│  ┌──────┐  ┌────────────┐  │
│  │  ##  │  │ Weeks    ▼ │  │
│  └──────┘  └────────────┘  │
│  ≈ X months                │
│                            │
│  Confidence                │
│  ┌────┐ ┌─────┐ ┌──────┐ ┌──────┐
│  │ IN │ │SURE │ │EXPECT│ │HOPE  │
│  └────┘ └─────┘ └──────┘ └──────┘
│  Most confident → Least    │
│                            │
│  Outcome                   │
│  ┌─────────┐ ┌─────┐ ┌───┐│
│  │ Pending │ │ Yes │ │ No ││
│  └─────────┘ └─────┘ └───┘│
│                            │
│  ┌──────────────────────┐  │
│  │       Log Call       │  │  ← Pinned to sheet bottom, above safe area
│  └──────────────────────┘  │
└────────────────────────────┘
```

---

## Fields

### Required

**Business**
- Typeahead input against existing business names
- Selecting a match links the log to that business record
- Submitting a name with no match silently creates a new business — no explicit "Create" affordance
- On account-card entry: pre-filled and locked (no typeahead)

**Stage**
- Full-width radio list; one tap selects
- Selected row: `--color-accent-primary` left border + `--color-surface-subtle` background
- No default — rep must make an explicit choice
- Options: Approach, Uncover, Present, Close, Service / Upsell
- Stage drives the nudge behavior in the Ask section (see below)

**What's Next**
- Single-select; opens as a bottom sheet on mobile
- Options: **TBD — predefined list to be defined before implementation**

---

### Optional: Ask Section

Always visible. Section divider labeled "Ask" (H2) with "Optional" right-aligned in `--color-text-secondary`. No `*` markers on any field within this section.

**Nudge**
Appears above Budget when Stage = Present or Close. Fades in/out with `--duration-base` ease-out as stage changes. Copy: *"Capturing an ask helps your manager support this deal."* Never blocks submission.

**Budget**
- Currency input
- Optional

**Term Length**
- Number input + unit dropdown (Weeks / Months)
- When Weeks selected and value > 0: micro-text `≈ X months` appears below, updates in real time using `floor(weeks / 4)`
- When Months selected: micro-text hidden

**Confidence**
- Pill selectors, ordered left to right: IN → SURE → EXPECT → HOPE
- Micro hint below row: "Most confident → Least confident"
- Calculation weights (backend only, not shown to rep): IN = 95%, SURE = 80%, EXPECT = 40%, HOPE = 10%
- IN also carries "sold" semantics — see Outcome interaction below
- Optional; re-tapping a selected pill deselects it

**Outcome**
- Pill selectors: Pending, Yes, No
- Default: Pending
- Applies to this specific interaction, not the overall business status
- Selecting IN confidence auto-sets Outcome to Yes — reversible; rep can manually override

---

## Log Call Button

- Disabled until Business + Stage + What's Next all have values
- On tap: label changes to "Logging…", spinner appears, button disables (prevents duplicate submission)
- On success: sheet dismisses; rep returns to the view that was active before opening the sheet
- On error: button restores to normal state; plain-language error message appears above the button
- No success toast on submit

---

## Navigation Summary

**Into the form:**
- Center tab (mobile) → bottom sheet slides up over current view
- Sidebar "Log Call" (desktop) → centered modal opens over current view
- Account card "Log Call" button → centered modal, business pre-filled and locked

**Out of the form:**
- Cancel button or swipe down (mobile sheet) → dismisses with no changes saved
- Tap dimmed background (mobile sheet) → dismisses with no changes saved
- Successful submit → sheet/modal closes; previous view resumes; list or card refreshes if applicable

---

## Outstanding TBDs

| Item | Status |
|---|---|
| What's Next option list | Not yet defined — required before implementation |

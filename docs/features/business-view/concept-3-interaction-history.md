# Feature Design: Business View — Concept 3: Interaction History

Source concept: `docs/master/Feature_Concept_Document___Opportunity_Progression_per_Business__Stage___Next_Step___History_.md`

---

## Overview

The interaction history section lives below the business header within the Business View overlay. It shows a reverse-chronological list of every call logged against this business. The history supports coaching and self-review — it is entirely read-only. The rep's editable current status (Concept 1 and 2) is a separate concept from this historical record.

---

## Wireframe

```
├─────────────────────────────────────────────┤
│ Interaction history                          │
│                                             │
│ │ ·  Jun 3 · Present                        │ ← most recent: left-border accent
│ │    Outcome: ● Follow up                   │
│ │    Ask: $12,000 / 3 months · Expect       │
│ │    Next step: Follow up on proposal       │
│                                             │
│ │    May 28 · Uncover                       │
│ │    Outcome: ✕ Not sold                    │
│ │    Next step: Come back with a proposal   │
│                                             │
│ [Empty state when no logs exist]            │
│         📞                                  │
│   No interactions yet                       │
│   Log a call to start tracking this         │
│   account's history.                        │
│         [Log first call]                    │
└─────────────────────────────────────────────┘
```

---

## Layout: Flat Timeline

Entries render as a flat list anchored to a continuous 1px vertical line in `--color-border-subtle` running down the left gutter of the section. Each entry hangs off that line as a block. There are no bordered cards — this avoids the card-in-card nesting violation and produces a cleaner reading experience for a dense history list.

A 6px circle dot marks each entry's position on the timeline line:
- Most recent entry: dot filled with `--color-accent-primary`
- All other entries: dot in `--color-border-default` (unfilled)

**Padding:** `--spacing-sm` between entries; `--spacing-md` left-offset from the timeline line to the entry content.

---

## Component Behaviors

**Section label**
- "Interaction history" in H3 weight, above the list

**Most recent entry accent**
- The topmost (most recent) entry receives a left-border stripe: 2px solid `oklch(from var(--color-accent-primary) l c h / 40%)`, applied to the entry content block
- This marks the current state before the rep scrolls into history — coaching and self-review both start from the latest record

**Date and stage line**
- Date left-aligned; stage right-aligned on the same row
- Date format: "Today" or "Yesterday" if applicable; otherwise abbreviated month + day (e.g., "Jun 3"); year included only if not the current year
- If the most recent call is more than 30 days ago, render the date in `--color-status-warning` — signals a stale account without a banner or extra element
- Stage: compact display-only pill using the same dot + label pattern as `BusinessCard` (not the interactive `StageBadge` from Concept 1); `--font-size-small`

**Outcome line**
- Always shown; rendered with a leading semantic indicator:
  - "Sold" → small filled circle in `--color-status-success` + label
  - "Not sold" → small × in `--color-status-warning` + label
  - "Follow up" → no color indicator; `--color-text-secondary`
- Borrowed from LevelEleven's color-coded at-a-glance system — outcome is scannable before the rep reads text

**Ask line**
- Shown only when the log includes budget data
- Typography split: `$12,000` in `--font-weight-medium`, `--color-text-primary` · `/ 3 months · Expect` in `--font-size-small`, `--color-text-secondary`
- Budget figure is the meaningful data; term and confidence modifier are context — this hierarchy follows Pipedrive's deal value emphasis pattern
- Omitted entirely when no ask was captured — no placeholder

**Next step line**
- Always shown; displays the next step value captured at the time of logging
- `--color-text-primary`, `--font-size-body`
- Lets the rep trace how priorities evolved across interactions

**Scroll behavior**
- On desktop (slide-over): the history list scrolls within the slide-over panel; the business header stays fixed at the top
- On mobile (bottom sheet): the history list scrolls within an internal scroll region inside the sheet; the business header and "Log call" button stay fixed above it

**Empty state**
- Follows the empty state template from `docs/design/standards/components.md`
- Icon: phone (relevant to calls); renders with a gentle fade-in on mount (opacity 0 → 0.5 over `--duration-base`) — removes abrupt appearance
- Headline: "No interactions yet"
- Body: "Log a call to start tracking this account's history."
- CTA: primary tier "Log first call" — opens QuickLog pre-filled with this business

---

## Navigation Summary

**Into Interaction History:**
- Scrolling down within the Business View overlay (Concept 1)

**From Interaction History:**
- Empty state CTA "Log first call" → QuickLog opens as centered modal (desktop) or bottom sheet (mobile)
- No navigation targets from individual history entries — they are read-only records
- Scrolling back up → Business Header (Concept 1)

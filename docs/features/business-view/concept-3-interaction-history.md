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
│ ┌─────────────────────────────────────────┐ │
│ │ Jun 3 · Present                         │ │
│ │ Outcome: Follow up                      │ │
│ │ Ask: $12,000 / 3 months · Expect        │ │
│ │ Next step: Follow up on proposal        │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ May 28 · Uncover                        │ │
│ │ Outcome: Not sold                       │ │
│ │ No ask                                  │ │
│ │ Next step: Come back with a proposal    │ │
│ └─────────────────────────────────────────┘ │
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

## Component Behaviors

**Section label**
- "Interaction history" in H3 weight, above the list

**Entry cards**
- Compact card style (`--spacing-sm` padding per `docs/design/standards/components.md`)
- Non-interactive — no hover state, no tap target
- Cards may not contain nested cards; all fields are rendered as flat text rows within a single card

**Date and stage line**
- Date left-aligned; stage right-aligned on the same row
- Date format: "Today" or "Yesterday" if applicable; otherwise abbreviated month + day (e.g., "Jun 3"); year included only if not the current year
- Stage: compact badge (display-only — not the interactive badge from Concept 1)

**Outcome line**
- Always shown; plain text ("Follow up", "Sold", "Not sold")

**Ask line**
- Shown only when the log includes budget data
- Format: "$[budget] / [term] · [confidence]" (e.g., "$12,000 / 3 months · Expect")
- Omitted entirely when no ask was captured — no "No ask" placeholder unless it aids scanning (see Outstanding TBDs)

**Next step line**
- Always shown; displays the next step value captured at the time of logging
- Lets the rep trace how priorities evolved across interactions

**Scroll behavior**
- On desktop (slide-over): the history list scrolls within the slide-over panel; the business header stays fixed at the top
- On mobile (bottom sheet): the history list scrolls within an internal scroll region inside the sheet; the business header and "Log call" button stay fixed above it

**Empty state**
- Follows the empty state template from `docs/design/standards/components.md`
- Icon: phone (relevant to calls)
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

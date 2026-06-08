# Feature Design: Business View — Concept 1: Business Header & Pipeline Status

Source concept: `docs/master/Feature_Concept_Document___Opportunity_Progression_per_Business__Stage___Next_Step___History_.md`

---

## Overview

The business header is the top section of the Business View overlay. It answers at a glance: which business is this, where does it stand in the pipeline, and what is the rep supposed to do next? It is the first thing a rep sees when they open a business from the What's Next list.

---

## Container Decision

The Business View is an overlay on both desktop and mobile. The same container type is used across breakpoints — it does not become a full-page view on mobile. See `docs/design/standards/navigation.md` — Breakpoint Consistency Rule.

| Breakpoint | Container | Entry direction |
|---|---|---|
| Desktop | Slide-over panel (~40% of viewport from right edge) | Enters from right |
| Mobile | Bottom sheet (~85% of viewport) | Enters from bottom |

The What's Next list remains visible and dimmed behind the overlay on both breakpoints. This reinforces that the rep has not navigated away from their work queue.

---

## Wireframe — Desktop (Slide-Over)

```
[What's Next list — dimmed]   ┌───────────────────────────────────┐
                               │ ✕                                 │
                               ├───────────────────────────────────┤
                               │ Riverside Auto Group               │
                               │                                    │
                               │ [● CLOSE ▾]        [Log call]     │
                               │                                    │
                               │ Next step                          │
                               │ Follow up on proposal — waiting    │
                               │ on GM approval          [Edit ✎]  │
                               ├───────────────────────────────────┤
                               │ Interaction history ↓              │
                               │ ...                                │
                               └───────────────────────────────────┘
```

---

## Wireframe — Mobile (Bottom Sheet)

```
┌─────────────────────────────────┐  ← What's Next list, dimmed behind
│              ─────              │  ← drag handle
├─────────────────────────────────┤
│ Riverside Auto Group            │
│                                 │
│ [● CLOSE ▾]                     │
│                                 │
│ Next step                       │
│ Follow up on proposal —         │
│ waiting on GM approval  [Edit ✎]│
│                                 │
│ ┌─────────────────────────────┐ │
│ │          Log call           │ │  ← full-width primary button
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Interaction history ↓           │
│ ... scrollable region ...       │
└─────────────────────────────────┘
```

---

## Component Behaviors

**Business name**
- H1 weight, single line
- Truncates with ellipsis on overflow; full name visible on hover via title tooltip

**Stage badge**
- Pill with a chevron (▾) indicating it is interactive
- Tapping the badge opens the stage picker — see Concept 2
- Color is stage-neutral (accent hue, not a semantic status color) — all stages use the same visual treatment
- The chevron is the sole tap affordance; the rest of the pill shows the current stage label

**"Log call" button**
- Secondary tier on desktop, auto-width, right-aligned beside the stage badge
- Primary tier on mobile, full-width, below the stage row
- Opens QuickLog pre-filled with this business and its current stage
- Within QuickLog, a helper note below the "What's Next" field displays the current next step as context: "Currently: [next step text]" — shown as hint text, not pre-filled

**Next step**
- Section label "Next step" in body secondary weight
- Value text: body primary weight; wraps to multiple lines if needed
- Edit affordance: ghost button with pencil icon, right-aligned on the label row
- Tapping Edit enters inline edit mode — see Concept 2

**Overlay dismissal**
- Desktop: ✕ button top-right of slide-over panel
- Mobile: drag handle swipe-down, tap dimmed backdrop, or explicit cancel affordance in sheet header

---

## Navigation Summary

**Into the Business Header:**
- Tapping any business card body in the What's Next list → overlay opens over the list

**From the Business Header:**
- Stage badge (▾) → stage picker opens in place (Concept 2)
- Edit ✎ icon → inline next step edit activates (Concept 2)
- "Log call" → QuickLog opens as centered modal (desktop) or bottom sheet (mobile) layered over the Business View
- Scroll down → Interaction History section (Concept 3)
- ✕ or swipe down → overlay closes; What's Next list resumes unmodified

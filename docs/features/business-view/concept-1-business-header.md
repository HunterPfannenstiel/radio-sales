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
| Desktop | Slide-over panel (~40% of viewport from right edge, max 480px, min 360px) | Enters from right |
| Mobile | Bottom sheet (~85% of viewport) | Enters from bottom |

The What's Next list remains visible and dimmed behind the overlay on both breakpoints. This reinforces that the rep has not navigated away from their work queue.

**Container styling:**
- Background: `--color-surface-card`
- Border: 1px `--color-border-default`
- Corner radius: `--radius-xl` (20px) on left corners only; right corners flush (pinned to viewport edge)
- Shadow: `0 8px 32px oklch(0.145 0 0 / 12%)`
- Backdrop: `oklch(0.145 0 0 / 40%)`

**Entry animation:**
- Desktop slide-over: `--duration-base` (200ms), `ease-out`, translates from `translateX(100%)` to `translateX(0)`
- Mobile bottom sheet: `--duration-base` (200ms), `ease-out`, translates from `translateY(100%)` to `translateY(0)`
- Backdrop fade-in: `--duration-base`, `ease-out`
- Exit: `ease-in` on both; backdrop fades simultaneously
- `prefers-reduced-motion`: all transitions set to near-zero duration; elements appear/disappear instantly

---

## Wireframe — Desktop (Slide-Over)

```
[What's Next list — dimmed]   ┌───────────────────────────────────┐
                               │ ✕                                 │
                               ├───────────────────────────────────┤
                               │ Riverside Auto Group               │
                               │                                    │
                               │ [███░░][● CLOSE ▾]  [🎤 Log call]│
                               │                                    │
                               │ NEXT STEP                          │
                               │ ▌ Follow up on proposal — waiting  │
                               │ ▌ on GM approval         [Edit ✎] │
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
│ [███░░][● CLOSE ▾]              │
│                                 │
│ NEXT STEP                       │
│ ▌ Follow up on proposal —       │
│ ▌ waiting on GM approval [Edit ✎]│
│                                 │
│ ┌─────────────────────────────┐ │
│ │       🎤  Log call          │ │  ← full-width primary button
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Interaction history ↓           │
│ ... scrollable region ...       │
└─────────────────────────────────┘
```

---

## Component Behaviors

**Business name**
- `--font-size-h2` (30px), `--font-weight-bold`, `--color-text-primary`
- Single line; truncates with ellipsis on overflow; full name visible on hover via `title` tooltip
- Rationale: The slide-over panel uses `--color-surface-card` as its surface — placing an H1 inside a card surface violates the design standard ("H1: Page title — one per page, never inside a card"). H2 at bold weight is visually commanding and correctly scoped to a panel context.

**Stage badge**
- Filled pill: background `--color-accent-primary`, text `--color-text-inverse`, `--radius-sm` corners, `--font-weight-medium` body size
- `ChevronDown` icon (16px, `--icon-size-sm`) right-aligned inside the pill — sole tap affordance indicating interactivity
- Tapping the badge opens the stage picker — see Concept 2
- All stages use the same accent color treatment — no semantic status color repurposing

**Pipeline position indicator**
- Sits immediately left of the stage badge
- Five segments, each `6px wide × 8px tall`, `2px gap` between segments, `--radius-sm`
- Filled segments: `--color-accent-primary`; unfilled segments: `--color-border-default`
- Segment count filled corresponds to current stage position in the pipeline (Approach=1, Uncover=2, Present=3, Close=4, Service=5)
- Static display only; not interactive

**"Log call" button**
- Primary tier on both desktop and mobile — filled `--color-accent-primary` background, `--color-text-inverse` text
- `Mic` icon (16px) left of label on desktop; same on mobile
- Desktop: auto-width, right-aligned beside the stage badge row
- Mobile: full-width, below the stage row
- Opens QuickLog pre-filled with this business and its current stage
- Within QuickLog, a helper note below the "What's Next" field displays the current next step as context: "Currently: [next step text]" — shown as hint text, not pre-filled
- Rationale: The design standard states quick-log must be reachable in one tap/click on any screen ("north star interaction"). Secondary tier on desktop conflicts with that requirement. Primary tier with a Mic icon signals its importance and reinforces the radio metaphor.

**Next step**
- Section label: `"NEXT STEP"` in `--font-size-small`, `--font-weight-medium`, `--color-text-secondary`, `letter-spacing: 0.06em` (uppercase tracking)
- Value text: `--font-size-body`, `--font-weight-regular`, `--color-text-primary`, wraps to multiple lines as needed
- Callout treatment: 3px left border in `--color-accent-primary` at 50% opacity, `--spacing-sm` left padding, no background fill — visually elevates the most actionable item without creating a nested card
- Edit affordance: ghost `Pencil` icon (16px) right-aligned on the section label row (always visible, not hover-gated)
- Tapping Edit enters inline edit mode — see Concept 2

**Overlay dismissal**
- Desktop: `✕` button top-right of slide-over panel
- Mobile: drag handle (32px × 4px capsule, `--color-border-default`, centered at sheet top), swipe-down on sheet content, tap dimmed backdrop, or explicit cancel affordance in sheet header

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

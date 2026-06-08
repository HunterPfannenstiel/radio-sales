# Feature Design: Rep Daily Dashboard (Money Pace + Activity Pace)

Source concept: `docs/master/Feature_Concept_Document___Rep_Daily_Dashboard__Money_Pace___Activity_Pace_.md`

---

## Overview

The rep daily dashboard is the app's default landing page. It answers one question the moment it loads: what do I need to do today and this week to stay on pace for my goal? The screen shows money pace (primary) and activity pace (supporting) together so the rep can see the outcome and the behaviors that drive it in one place. It is read-only — no actions are taken from this screen other than navigating to the quick-log form.

---

## Layout Decision

Desktop-first per `docs/design/standards/layout.md` — the rep daily dashboard is explicitly listed as a Desktop (mobile-capable) surface. The 12-column grid applies on desktop; all panels collapse to a single vertical stack on mobile.

---

## Wireframe — Desktop

```
┌─────────────────┬────────────────────────────────────────────────────────┐
│  [LOGO]         │  My Dashboard                                  [?]     │
│  ─────────────  │                                                         │
│  ▶  Quick Log   │  ←  June 2026  →                                       │
│  ⊞  Dashboard ● │    ←  Week 23  ·  Jun 2–6  →                           │
│  ✓  What's Next │                                                         │
│  ◫  Pipeline    │  ┌───────────────────────────────────────────────────┐  │
│                 │  │  Money Pace  ·  June 2026                ● Ahead │  │
│       ···       │  │                                                   │  │
│                 │  │          68%                                      │  │
│  ⚙  Settings   │  │       Sold to Goal                                │  │
│  ?  Help        │  │  ████████████████████████████░░░░░░░░░░           │  │
│                 │  │                                                   │  │
│                 │  │  Sold $13,600/mo   Projected $18,200              │  │
│                 │  │  Goal $20,000/mo   Gap  −$6,400 to goal           │  │
│                 │  └───────────────────────────────────────────────────┘  │
│                 │                                                         │
│                 │  ┌─────────────────────┐  ┌─────────────────────┐      │
│                 │  │  Calls  ·  Week 23  │  │  Asks  ·  Week 23   │      │
│                 │  │                     │  │                     │      │
│                 │  │  18 / 25            │  │  3 / 5              │      │
│                 │  │  this week          │  │  this week          │      │
│                 │  │  ████████████░░░░   │  │  ████████░░░░░░░░   │      │
│                 │  │  ● On Pace          │  │  ● Behind           │      │
│                 │  │  3 days left        │  │  3 days left        │      │
│                 │  └─────────────────────┘  └─────────────────────┘      │
└─────────────────┴────────────────────────────────────────────────────────┘
```

---

## Wireframe — Mobile

Per `layout.md`: gauge panels stack vertically on mobile, never side-by-side. Navigation switches from left sidebar to bottom tab bar.

```
┌──────────────────────────┐
│  My Dashboard        [?] │
│                          │
│  ←  June 2026  →         │
│   ← Wk 23 · Jun 2–6 →   │
│                          │
│ ┌────────────────────────┐│
│ │ Money Pace · June 2026 ││
│ │                ● Ahead ││
│ │        68%             ││
│ │     Sold to Goal       ││
│ │  ████████████░░░░░░░   ││
│ │                        ││
│ │ Sold       $13,600/mo  ││
│ │ Projected  $18,200     ││
│ │ Goal       $20,000/mo  ││
│ │ Gap        −$6,400     ││
│ └────────────────────────┘│
│                          │
│ ┌────────────────────────┐│
│ │ Calls  ·  Week 23      ││
│ │  18 / 25  this week    ││
│ │  ████████████░░░░░░░   ││
│ │  ● On Pace             ││
│ │  3 days left           ││
│ └────────────────────────┘│
│                          │
│ ┌────────────────────────┐│
│ │ Asks  ·  Week 23       ││
│ │  3 / 5  this week      ││
│ │  ████████░░░░░░░░░░    ││
│ │  ● Behind              ││
│ │  3 days left           ││
│ └────────────────────────┘│
│                          │
│  [⊞]  [✓]  [+]  [◫]  [👤]│  ← bottom tab bar; [+] = Quick Log (center)
└──────────────────────────┘
```

---

## Navigator Behavior

Two stacked navigators appear directly below the page title. Month is on top; week is below it.

```
←  June 2026  →
  ←  Week 23  ·  Jun 2–6  →
```

**Month row**
- Controls the Money Pace section
- Arrows advance or retreat one calendar month
- Forward arrow is disabled when viewing the current month
- Navigating the month row resets the week row to the first week of the selected month

**Week row**
- Controls the Activity Pace section
- Arrows advance or retreat one week (Mon–Fri)
- Forward arrow is disabled when viewing the current week
- Navigating the week row auto-updates the month row if the new week crosses a month boundary

**NOW indicator**
- A subtle "NOW" badge appears beside both the month and week labels when the rep is viewing the current period
- The badge disappears when navigating into history; no other visual treatment distinguishes history mode

**Weekend behavior** (see Outstanding TBDs)
- Saturday and Sunday: the navigator shows the week just completed in read-only history view
- Monday: the navigator auto-advances to the new week at the start of day

---

## Money Pace Card

Full-width card (`--color-surface-card`, `--radius-card`, `--color-border-default`). Spans the full content column width on both desktop and mobile.

**Card header (H3):** "Money Pace · [Month Year]" with a pace status badge right-aligned.

**Pace badge states**

| Badge | Token | Condition |
|---|---|---|
| Ahead | `--color-status-success` | Sold % exceeds expected pace for this point in the month |
| On Pace | `--color-status-info` | Sold % is within an acceptable margin below expected pace (see Outstanding TBDs) |
| Behind | `--color-status-warning` | Sold % is meaningfully below expected pace |
| Goal Reached | `--color-status-achieved` | Sold % ≥ 100% of monthly goal |

Expected pace is calculated using working days: working days elapsed ÷ total working days in the month (see Outstanding TBDs). This is consistent with the Mon–Fri pacing logic used by the activity section.

**Primary number:** Sold % to goal at `--font-size-h1` bold, colored with the matching status token. Label below in `--font-size-small` `--color-text-secondary`: "Sold to Goal".

**Progress bar:** Horizontal, full-width within card padding. Fill color matches the pace status token. Track is `--color-surface-subtle`. The bar does not render a separate expected-pace marker — the badge communicates the directional signal.

**Supporting figures**

Desktop — two columns:
```
Sold $X/mo       Projected $X
Goal $X/mo       Gap  −$X to goal
```

Mobile — single column:
```
Sold       $X/mo
Projected  $X
Goal       $X/mo
Gap        −$X to goal
```

- **Sold:** monthly-equivalent value of all closed (Yes) interactions for the current month
- **Projected:** single weighted number — Sold (at 95%) plus all pending interactions at their confidence weights; not broken out by confidence bucket on this screen
- **Goal:** the rep's manager-set monthly goal; updates immediately when the manager changes it
- **Gap:** Goal − Sold only; shows "Goal reached" in `--color-status-achieved` text when Sold ≥ 100%

**Historical views:** When navigating to a prior month, Projected shows the snapshot value as of that month's close — not recalculated using current pending data (see Outstanding TBDs).

**Goal change behavior:** When a manager changes the monthly goal, the dashboard immediately recalculates Sold %, progress bar position, pace badge, and gap using the new goal value.

---

## Activity Cards

Two cards — Calls and Asks — displayed side-by-side on desktop, stacked vertically on mobile. Each card follows standard card anatomy (`docs/design/standards/components.md`).

**Card header (H3):** "[Calls | Asks] · Week [N]" with a binary pace badge right-aligned.

**Pace badge states (binary)**

| Badge | Token | Condition |
|---|---|---|
| On Pace | `--color-status-success` | Count is at or ahead of expected pace for days elapsed this week |
| Behind | `--color-status-warning` | Count is below expected pace for days elapsed this week |

No "On Pace" middle state for activity — binary green/red per the passive flags feature definition.

**Primary figures:** `[current count] / [weekly target]` — current count at `--font-weight-bold`, slash and target at `--font-weight-regular`. Label below: "this week" in `--color-text-secondary`.

**Progress bar:** Count/target ratio. Fill color matches the binary badge color. Track is `--color-surface-subtle`.

**Footer:** "N days left" — remaining Mon–Fri working days in the selected week.
- On Friday (or after all 5 working days are elapsed): "Week complete" replaces the days-left line
- On weekends (history view): "Week complete" is shown; the badge reflects the final state of that week

**Target change behavior:** When a manager changes a weekly target, the dashboard immediately recalculates progress percentage and the pace badge for the current week using the new target value.

---

## Empty States

### Sub-state 1 — No goals or targets set

Applies when the rep's account has no manager-set monthly goal or weekly targets (e.g., newly claimed account, manager setup incomplete).

Follows `docs/design/standards/onboarding.md` and the empty state template from `docs/design/standards/components.md`. No numbers are shown — the setup problem is communicated directly.

**Money Pace card:** Icon (`--icon-size-xl`, target/goal icon), H3 headline "No goal set yet", body text "Your manager will set your monthly sales goal." No CTA — the rep cannot resolve this themselves.

**Activity cards:** Same pattern. Headline "No targets set yet", body "Your manager will set your weekly call and ask targets." No CTA.

### Sub-state 2 — Goals set, no activity logged

Applies when goals and targets exist but no calls have been logged yet (start of month, or new rep who has been configured by their manager).

The dashboard shows the real numbers (0%, 0/N) as the feature concept intends — this reinforces the habit loop immediately. However, two modifications prevent zero from reading as failure:

1. **Pace badges are suppressed.** Neither the Money card nor the Activity cards show a green or red badge. A neutral gray "Not started" label takes the badge position in `--color-text-secondary`.
2. **A single CTA prompt** appears below the activity section (not inside either card): *"Log your first call to start tracking your pace."* followed by a primary-tier "Log a call" button. This is the only primary button on the screen in this state.

Once the first call is logged, the CTA disappears and the pace badges activate.

---

## Navigation Summary

**To the dashboard**
- Default landing page on login and on any session restore
- Dashboard nav item (sidebar desktop / leftmost tab mobile) from any screen
- Logo tap/click from any screen

**From the dashboard**
- Quick Log: first sidebar item (desktop) or center tab (mobile) — opens the quick-log form without navigating away from the dashboard
- All other navigation via the standard sidebar (desktop) or bottom tab bar (mobile)
- No drill-down targets on the dashboard itself in v1 — it is read-only

---

## Outstanding TBDs

| Item | Educated decision | Rationale |
|---|---|---|
| Pace calculation basis | Working days elapsed | Activity pace already uses Mon–Fri pacing; money pace should be consistent. Expected pace = working days elapsed ÷ total working days in the month. |
| "On Pace" margin for money | Not yet defined — needs a specific threshold (e.g., within 5 percentage points of expected pace) | Binary green/red is sufficient for the passive flags system; this dashboard uses a 4-state system and requires a defined boundary between "On Pace" and "Behind" |
| Week transition on weekends | Weekends show the week just completed; Monday auto-advances to the new week | Weekend = natural review window; Monday fresh start reinforces the habit loop |
| Projected on historical views | Historical snapshot as of that period's close | Recalculating with current pending data would distort the coaching narrative |
| Gap calculation | Goal − Sold only | Projected already implies the optimistic remaining gap; a second gap figure adds cognitive load without adding actionable information |
| Month boundary weeks | Anchor to the month containing Monday (the week start) | Consistent, predictable, easy to implement |

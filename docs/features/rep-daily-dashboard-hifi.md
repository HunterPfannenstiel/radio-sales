# High-Fidelity: Rep Daily Dashboard

Source: `docs/features/rep-daily-dashboard.md`
Implementation: `app/page.tsx`

---

## What This Document Is

The rep daily dashboard is implemented. This document records every decision that diverges from or adds to the original low-fidelity spec, with rationale. Items marked **Implemented** are already in the codebase. Items marked **Pending** are approved but not yet built.

---

## Changes from Low-Fidelity

### 1. Hero Number — `--font-size-h1` → `--font-size-hero`
**Status: Implemented**

The low-fi spec set the sold percentage at `--font-size-h1`. The typography standard reserves `--font-size-hero` for "primary dashboard stat — the number checked first every morning." The percentage is that number. Changed to hero size, Barlow Condensed bold, colored with the pace status token.

### 2. Progress Bar — Continuous Fill → 20-Segment VU Meter
**Status: Implemented (`LevelMeter` component)**

The low-fi implied a standard continuous progress bar. The design thesis explicitly mandates the segmented treatment: "Twenty segments filling in isn't just a style choice — it's the most specific thing in the UI." Both the money card and the activity cards use `LevelMeter`: 20 segments, 2px gap, 10px height. Fill color tracks the pace status token.

### 3. Pace Badge — Dot Label → Solid Filled Pill
**Status: Implemented**

Low-fi showed a colored dot + text label (`● Ahead`). Implementation uses a `rounded-full` pill with the full status color as background and `--color-text-inverse` text. The color is the container, not an icon — reads faster at a glance. LevelEleven's core UX insight: the status is communicated before the label is read.

### 4. MoneyPaceCard Border — Standard Card → Left Accent + Box Shadow
**Status: Implemented (conscious deviation from card component standard)**

The money card uses `borderLeft: "4px solid var(--color-accent-primary)"` and `boxShadow: "0 0 0 1px var(--color-border-default)"` in place of the standard 1px `--color-border-default` on all sides. The activity cards use the standard border. This creates deliberate visual hierarchy — money is primary, activity is supporting — while keeping On Air red present as a structural signal, not just a badge.

This deviates from the card anatomy standard. The deviation is intentional and specific to this card.

### 5. NOW Badge — `--color-status-info` → `--color-accent-primary`
**Status: Pending**

The current implementation uses `--color-status-info` (blue) for the NOW badge in both navigator rows. The design thesis defines `--color-accent-primary` as the signal color for "what's live, what's critical, what's leading." Viewing the current period is the live view — the red light should be on. Change both instances (lines 197 and 233 in `app/page.tsx`) to `--color-accent-primary`.

### 6. Activity Card Count — `--font-size-hero` → `--font-size-h1`
**Status: Pending**

Both the money pace percentage and the activity counts currently render at `--font-size-hero`. Activity counts should step down to `--font-size-h1` (Barlow Condensed bold, pace status color) so money reads as primary and activity reads as supporting. The target value (`/ N`) remains at `--font-size-h2`, `--color-text-secondary`.

---

## What's New (Not in Low-Fidelity)

### 7. Weekday Progress Dots in Activity Card Footer
**Status: Pending**

Between the VU meter and the "N days left" text: a row of 5 dots representing Mon–Fri. Filled (●) for elapsed days, open (○) for remaining. Gap: `--spacing-xs`. "N days left" text stays below.

Example on Wednesday: `● ● ● ○ ○  ·  2 days left`

The dots make time compression visible without arithmetic — the week as a VU meter for time.

### 8. Goal Reached Celebration State
**Status: Pending**

When `soldPercent >= 100`:
- All 20 VU meter segments fill with `--color-status-achieved`
- The hero number renders in `--color-status-achieved`
- The card border pulses once in `--color-status-achieved` (short CSS animation, not looping), then returns to the red left accent
- Badge: full-opacity `--color-status-achieved` background, `--color-text-inverse` text, "Goal Reached"

One pulse. Sourced from Ambition's "fun rather than forced" celebration philosophy. Reaching goal is the most meaningful moment in the rep's month.

---

## Open Items

| Item | Notes |
|---|---|
| Navigator component design | Deferred — design discussion in progress. Decisions locked so far: red NOW badge (item 5 above), layout shift fix, possible containment panel. |
| "Not started" badge suppression | Low-fi sub-state 2: when goals are set but no activity logged, pace badges should show a neutral "Not started" label instead of green/red. Not implemented. |
| Activity empty state missing icon | Low-fi specifies the full empty state template (icon + H3 + body). Current implementation renders H3 + body only, no icon. |

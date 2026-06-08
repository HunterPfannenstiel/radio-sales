# Feature Design: Business View — Concept 2: Stage & Next Step Direct Edit

Source concept: `docs/master/Feature_Concept_Document___Opportunity_Progression_per_Business__Stage___Next_Step___History_.md`

---

## Overview

A rep can update a business's current stage and next step without logging a new interaction. This is lightweight housekeeping — keeping the pipeline accurate between calls. These edits do not create an interaction history record. The interaction patterns are intentionally minimal to match the low-stakes, in-between nature of the action.

---

## Stage Edit — Dropdown Picker

Tapping the stage badge (▾) opens a dropdown anchored below it. The current stage is pre-selected. Selecting a new value immediately updates the badge and writes silently to the server. No Save step, no confirmation.

### Wireframe

```
│ [██░░░][● UNCOVER ▾]  ← tapped
│  ┌────────────────────────────┐
│  │ [██░░░░░░░░] ← live preview│  ← mini pipeline meter, updates on hover
│  ├────────────────────────────┤
│  │ 1  ○  Approach             │
│  │ 2  ●  Uncover              │  ← current stage (filled indicator)
│  │ 3  ○  Present              │
│  │ 4  ○  Close                │
│  │ 5  ○  Service              │
│  └────────────────────────────┘
```

### Component Behaviors

**Dropdown container:**
- Background: `--color-surface-raised`
- Border: 1px `--color-border-default`
- Corner radius: `--radius-md`
- Shadow: `0 4px 16px oklch(0.145 0 0 / 10%)`
- Anchors below the badge; shifts upward if there is insufficient space below

**Mini pipeline meter (inside dropdown header):**
- Same 5-segment VU-meter style as the badge indicator in Concept 1
- Updates live as the user hovers over each row — previews the new pipeline position before committing
- Transitions at `--duration-fast` as hover moves between rows

**Row anatomy (left to right):**
- Position number: `--font-size-micro`, `--color-text-disabled` (1–5) — provides spatial reference in the funnel
- Stage indicator: filled circle (`●`) in `--color-accent-primary` for current stage; empty ring (`○`) in `--color-border-default` for all others
- Stage name: `--font-size-body`, `--color-text-primary`

**Interaction:**
- Hovering a row highlights it with `--color-surface-subtle` background; mini meter above updates to preview position
- Selecting a row: badge and mini meter update immediately (optimistic), dropdown closes, silent server write in background; indicator animates to filled at `--duration-fast`
- No success toast — the updated badge and segment fill are the confirmation
- Tapping outside the dropdown or pressing Escape dismisses with no change
- On error: badge reverts to previous value; a plain-language toast appears

---

## Next Step Edit — Inline Textarea

Tapping the Edit ✎ icon replaces the static next step text with a textarea in place. Cancel restores the previous value with no server call. Save commits the new value and collapses back to static display.

### Wireframe

```
│ NEXT STEP                                        [✕ Cancel]
│ ┌────────────────────────────────────┐
│ │ Follow up on proposal — waiting    │
│ │ on GM approval                     │  ← auto-resizes with content
│ └────────────────────────────────────┘
│                    [Save]  ⌘ Return to save │
```

### Component Behaviors

**Textarea:**
- Opens pre-filled with the current next step value; cursor placed at end
- Auto-resizes vertically with content — minimum 2 lines, no fixed maximum
- At-rest border: `--color-border-default`; focused border: `--color-border-strong`, transitions at `--duration-fast`
- Background: `--color-surface-card`

**Save button:**
- Ghost tier — same as Cancel to avoid over-weighting a housekeeping action
- Text color: `--color-accent-primary` — differentiates it from Cancel without a tier change
- Disabled when the field is empty
- Keyboard shortcut: Cmd+Enter (Mac) / Ctrl+Enter (Win) triggers Save; hint shown below the button row as `--font-size-micro`, `--color-text-disabled`: `"⌘ Return to save"`

**Cancel button:**
- Ghost tier
- Text color: `--color-text-secondary` — visually subordinate to Save without needing a different tier

**Save behavior:** Optimistic update (static text shows new value immediately), silent server write in background; textarea collapses at `--duration-fast`

**Cancel behavior:** Collapses back to static text at `--duration-fast`; no server call; previous value restored

**On error:** Static text reverts to the previous value; a plain-language toast appears

**Mobile layout:**
- Cancel button: full-width, outlined (`--color-border-default` border, no fill), stacked above Save
- Save button: full-width, primary fill (`--color-accent-primary` background, `--color-text-inverse` text), below Cancel
- Both meet `--touch-target-min` (44px height)
- Keyboard shortcut hint is hidden on mobile

---

## Navigation Summary

**Into Stage Edit:**
- Tapping the stage badge (▾) in the Business Header (Concept 1)

**Into Next Step Edit:**
- Tapping the Edit ✎ icon in the Business Header (Concept 1)

**Out of either edit:**
- Completing or cancelling returns the rep to the Business Header in its normal read state — no navigation change

# Feature Design: Business View — Concept 2: Stage & Next Step Direct Edit

Source concept: `docs/master/Feature_Concept_Document___Opportunity_Progression_per_Business__Stage___Next_Step___History_.md`

---

## Overview

A rep can update a business's current stage and next step without logging a new interaction. This is lightweight housekeeping — keeping the pipeline accurate between calls. These edits do not create an interaction history record. The interaction patterns are intentionally minimal to match the low-stakes, in-between nature of the action.

---

## Stage Edit — Dropdown Picker

Tapping the stage badge (▾) opens a small dropdown anchored below it. The current stage is pre-selected. Selecting a new value immediately updates the badge and writes silently to the server. No Save step, no confirmation.

### Wireframe

```
│ [● UNCOVER ▾]  ← tapped
│  ┌──────────────────┐
│  │ ○  Approach      │
│  │ ●  Uncover       │
│  │ ○  Present       │
│  │ ○  Close         │
│  │ ○  Service       │
│  └──────────────────┘
```

### Component Behaviors

- Dropdown anchors below the badge; shifts upward if there is insufficient space below
- Current stage row shows a filled indicator (●); all others show an empty circle (○)
- Selecting a row: badge updates immediately (optimistic), dropdown closes, silent server write in background
- No success toast — the updated badge is the confirmation
- Tapping outside the dropdown or pressing Escape dismisses it with no change
- On error: badge reverts to previous value; a plain-language toast appears

---

## Next Step Edit — Inline Textarea

Tapping the Edit ✎ icon replaces the static next step text with a textarea in place. Cancel restores the previous value with no server call. Save commits the new value and collapses back to static display.

### Wireframe

```
│ Next step
│ ┌────────────────────────────────────┐
│ │ Follow up on proposal — waiting    │
│ │ on GM approval                     │
│ └────────────────────────────────────┘
│                       [Cancel] [Save]│
```

### Component Behaviors

- Textarea opens pre-filled with the current next step value; cursor placed at end
- Cancel: collapses back to static text; no server call; previous value restored
- Save: optimistic update (static text shows new value immediately), silent server write in background; textarea collapses
- Save button is disabled when the field is empty
- On error: static text reverts to the previous value; a plain-language toast appears
- Both Cancel and Save are ghost tier on desktop; full-width stacked on mobile (Cancel above Save)

---

## Navigation Summary

**Into Stage Edit:**
- Tapping the stage badge (▾) in the Business Header (Concept 1)

**Into Next Step Edit:**
- Tapping the Edit ✎ icon in the Business Header (Concept 1)

**Out of either edit:**
- Completing or cancelling returns the rep to the Business Header in its normal read state — no navigation change

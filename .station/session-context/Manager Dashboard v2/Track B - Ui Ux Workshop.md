## Handoff — Track B: Goal & Activity Target Setup (presentational only)

No data-layer, persistence, or business-logic detail below — validation thresholds, save-to-backend, and how values feed Track A's pacing calc are someone else's concern. This is component structure, states, and visual behavior only.

**Route**: standalone page, e.g. `/goals`. Not nested under the dashboard, no shared layout requirement with Track A beyond the app shell.

**Components already in the project** (don't re-add): `Avatar`, `Badge`, `Button`, `Card`, `Field`, `InputGroup`, `Input`, `Label`, `Progress`, `Select`, `Separator`, `Skeleton`, `Table`, `sonner`. All already installed per `components.json` — confirm before assuming, but that was current as of this session.

**Icons** (lucide, per project's `iconLibrary`): `Pencil` (enter edit), `Check` (save, desktop icon-button), `X` (cancel, desktop icon-button), `Phone` (calls prefix), `Target` (asks prefix — swap for whatever reads better, not load-bearing).

---

### Page shell

- Page title, left-aligned, plain heading — no `Select`, no filter/sort controls, no search. Roster is fixed-size (~15), rendered in whatever order the data arrives in.
- One line of `text-muted-foreground` helper copy directly under the title: *"Edits apply the moment you save — there's no draft or history, only current values."*
- No page-level action buttons in the header (no global "Edit" toggle — see interaction model below).

### Responsive split

Single shared breakpoint variable, reused from Track A's roster (don't let this drift independently) — Card stack below it, `Table` at/above it.

### View mode (default render for every row/card)

*Mobile Card* (`flex flex-col gap-3` stack, one Card per rep):
- Top row: `Avatar` (size-10, initials fallback) + rep name, `flex items-center gap-2`. Ghost icon `Button` with `Pencil` pinned to the far right of this same row (`justify-between`) — same slot Track A used for its pace `Badge`.
- Below: Monthly Goal on its own row, label-over-number (`text-muted-foreground` small label, large number below, formatted as currency), full width, visually the biggest number on the card.
- Below that: Calls/Week and Asks/Week side by side, `grid grid-cols-2 gap-3`, same label-over-number treatment but smaller than the goal number.
- All plain text in this state — zero input chrome, zero `Field`/`InputGroup`. Should visually read like a stat display, not a form.

*Desktop Table*:
- Columns: Rep (`Avatar` + name in cell), Monthly Goal, Calls/Week, Asks/Week, Actions.
- Value cells: plain right-aligned text/numbers, same formatting as mobile.
- Actions cell: single ghost icon `Button` (`Pencil`). No row-level click-through — the pencil is the only interactive surface in this row.

### Edit mode (entered per-row via the pencil; multiple rows can be in this state simultaneously — no serialization)

*Mobile Card*:
- Card gets a visual "active" treatment while open — light `ring`/border-color shift distinguishing it from settled cards.
- Monthly Goal: `Field` + `InputGroup`, leading `InputGroupAddon` with `$`, full width, larger text size to match its view-mode prominence.
- Calls/Week, Asks/Week: `Field` + `InputGroup` each, `grid grid-cols-2 gap-3`, leading icon `InputGroupAddon` (`Phone` / `Target`) instead of a text label.
- Footer row inside the Card: two `Button`s — "Cancel" (`variant="outline"`) and "Save" (default/primary variant), full-width-ish split or right-aligned pair, your call on exact alignment.

*Desktop Table row*:
- Row gets `bg-muted/30` (or equivalent) while active, same "this one's live" signal as the mobile ring.
- Same three cells swap from text to the same `Field` + `InputGroup` treatment as mobile, just narrower.
- Actions cell swaps from the single `Pencil` icon-`Button` to a tight pair (`flex gap-1`): `Check` icon-`Button` (Save) and `X` icon-`Button` (Cancel).

### Validation (visual only)

- Triggered on Save click, not on blur/keystroke.
- Invalid field: `Field` gets `data-invalid`, the control gets `aria-invalid`, one-line `FieldDescription` underneath stating the problem. Row stays in edit mode until corrected or cancelled — don't auto-collapse on a failed save.

### Save / Cancel behavior (presentational contract, not the actual persistence call)

- **Save** (once validation passes): row collapses back to view mode showing the new values, fire a `sonner` toast (e.g. "Jordan's goals updated"). One toast per Save click — this is a discrete, deliberate action, not a per-keystroke event, so it should read as a clear single confirmation.
- **Cancel**: row collapses back to view mode showing the pre-edit values, no toast, no confirmation step — cancel is the safe path and shouldn't add friction.
- No `AlertDialog` confirmation gate in front of Save — entering edit mode + clicking Save is already two deliberate steps.

### Loading state

`Skeleton`, shape-matched to whichever layout is active: Card-height skeleton blocks ×15 for mobile, skeleton body rows under a real `TableHeader` for desktop. Same pattern as Track A, don't invent a different loading treatment.

### Empty state

Not needed — roster is always populated (~15 reps) for this build; no `Empty` component usage expected here.

### Explicitly not in scope for this screen

No drill-down, no row/card click-through in view mode, no sort/filter/search UI, no pagination, no rep-facing view of these values (flagged separately as an open product question, not a build task for this screen).
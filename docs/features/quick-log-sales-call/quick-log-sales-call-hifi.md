# High-Fidelity Upgrade: Quick Log Sales Call

Base spec: `docs/features/quick-log-sales-call/quick-log-sales-call.md`

Read the base spec first, then apply everything in this file on top of it. Each entry is either a **change** (replaces existing behavior) or an **addition** (net new; nothing in the base spec covers it).

---

## Changed

### What's Next — inline radio list replaces dropdown

**Was:** Single-select dropdown; on mobile, tapping the dropdown opens a nested bottom sheet.

**Now:** Inline full-width radio list, same pattern as Stage — no dropdown, no nested sheet. All options are visible in the scrollable form surface. When a Stage is selected, contextually relevant What's Next options appear at the top of the list; remaining options appear below a `--color-border-subtle` rule labeled `Other options` in `--color-text-secondary`.

---

### Ask section divider — horizontal rule replaces dash pattern

**Was:** A dash-rule placeholder: `─────── Ask ──── Optional`

**Now:** A `--color-border-subtle` full-width horizontal rule. "Ask" left-aligned as H2 (`--font-size-h2`, `--font-weight-bold`, `--color-text-primary`). "Optional" right-aligned at `--font-size-small`, `--color-text-secondary`. Same semantic content, correct production treatment.

---

### Nudge — coaching callout replaces plain text

**Was:** Plain paragraph text sitting inline with the form.

**Now:** A visually distinct coaching callout. `--color-surface-subtle` background, `--color-accent-primary` left border (2px), `--spacing-sm` internal padding on all sides. Copy and fade behavior unchanged. Do not use a status color — this reads as a coaching tip, not a warning or error.

---

### Confidence pills — opacity gradient replaces uniform styling

**Was:** Four pill selectors with no visual differentiation between them.

**Now:** An opacity gradient that encodes the confidence scale in the unselected state, making the left→right ordering (most → least confident) visually self-documenting:

| Pill | Background | Text |
|---|---|---|
| IN | `--color-accent-primary` at 100% opacity | `--color-text-inverse` |
| SURE | `--color-accent-primary` at 60% opacity | `--color-text-primary` |
| EXPECT | `--color-accent-primary` at 30% opacity | `--color-text-primary` |
| HOPE | `--color-accent-primary` at 15% opacity | `--color-text-secondary` |

Selected state: full `--color-accent-primary` fill for whichever pill is selected; a selection ring or border distinguishes it from the unselected gradient display.

**Note:** The ALL CAPS labels (IN, SURE, EXPECT, HOPE) are an intentional exception to the sentence-case button rule. They read as signal-level indicators — consistent with the On Air metaphor (VU meter markings). This is the only place in the product where this exception applies.

---

### Outcome pills — semantic colors replace neutral styling

**Was:** Three neutral pill selectors with no color differentiation.

**Now:** Semantic color mapping, consistent with `docs/design/standards/color.md`:

| Pill | Background | Text |
|---|---|---|
| Pending | `--color-surface-subtle` | `--color-text-primary` |
| Yes | `--color-status-success` | `--color-text-inverse` |
| No | `--color-status-warning` | `--color-text-inverse` |

Pending is intentionally neutral — "no outcome yet" is not a performance state and must not use a status color.

---

## New

### Business field — MRU suggestions before typing

Before any characters are typed, show the 3 most-recently-used businesses as tappable chips directly below the input field. Label the group `Recent` in `--font-size-micro`, `--color-text-secondary`. Tapping a chip selects that business and dismisses the keyboard without triggering a search. The standard typeahead activates on first keystroke as usual.

---

### Activity counter below sheet header

A single line of micro-text centered immediately below the sheet header (below the Cancel / Log a Call row, above the first field):

> `3 calls logged today · 2nd in your territory`

- `--font-size-micro`, `--color-text-secondary`
- Shows the rep's call count for the current calendar day and their rank among territory peers
- If data is not yet available when the sheet opens, the line does not render — no skeleton, no placeholder

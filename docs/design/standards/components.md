# Components

Anatomy and behavior rules for the four foundational component types. CRUD composition patterns belong in [crud-workflows.md](crud-workflows.md). Token values belong in `tokens.md`.

---

## Cards

Cards group related content into a contained, scannable unit.

**Surface and border:**
- Background: `--color-surface-card`
- Border: `--color-border-default`, width 1px
- Corner radius: `--radius-card`
- Shadow: none at rest — the border provides the separation; a subtle shadow may appear on hover for clickable cards

**Internal padding:**
- Standard card: `--spacing-md` on all sides
- Compact card (e.g., list items): `--spacing-sm` on all sides

**Internal anatomy (top to bottom):**
1. Header row — title (H3 weight) + optional badge or status indicator, right-aligned
2. Body — primary data fields, key metrics, or descriptive content
3. Divider — `--color-border-subtle`, full-width, separates body from footer
4. Footer — action buttons or secondary metadata

Not every card needs all four zones. The header is always present; footer is optional.

**Hover state:** Clickable cards shift to `--color-surface-subtle` background on hover. Non-interactive cards do not have a hover state.

**Nesting rule:** A card may not contain another card. Flatten the hierarchy instead.

---

## Button Tiers

One tier per action. The visual weight of the button signals the relative importance of the action.

| Tier | Variant | When to use |
|---|---|---|
| Primary | `default` | The single most important action on a screen. One per view maximum. |
| Secondary | `outline` | Alternative or complementary actions alongside a primary. Cancel, back, view details. |
| Tertiary | `ghost` | Low-priority utility actions. Icon-only toolbar buttons. Inline link-like actions. |
| Destructive | `destructive` | Delete, permanently archive, reset data. Always paired with a confirmation step. |

**Rules:**
- Never render two primary buttons side by side. If two actions have equal importance, one must be demoted to secondary.
- Destructive buttons must never be the default focus or the first button in a group.
- On mobile, primary and secondary buttons are full-width and stacked. Ghost buttons remain auto-width.
- Button labels use sentence case ("Log call", not "LOG CALL" or "Log Call").

---

## Form Inputs

**Label placement:**
- Always above the input field — never floating, never inline placeholder-only
- Label text: `--font-weight-medium`, `--color-text-primary`
- Required fields show a `*` after the label in `--color-status-warning`

**Anatomy (top to bottom):**
1. Label (+ optional `ⓘ` help icon — see [iconography.md](iconography.md))
2. Hint text (optional) — one sentence, `--color-text-secondary`, below the label
3. Input field — `--color-border-default` at rest, `--color-accent-primary` on focus, `--color-status-warning` on error
4. Error message (conditional) — plain-language, `--color-status-warning`, directly below the input

**State rules:**
- Validate on blur, not on keystroke — see [error-handling.md](error-handling.md)
- Error border replaces the default border; do not add an icon inside the field
- Do not show an error before the user has interacted with the field

**Spacing between fields:** `--spacing-sm` for related fields within a group; `--spacing-lg` between unrelated field groups.

---

## Empty State Template

Used whenever a list, table, card, or dashboard panel has no content to display.

**Structure (centered, vertically stacked):**
1. Icon — `--icon-size-xl`, `--color-accent-primary` at reduced opacity (illustrative, not error)
2. Headline — H3 weight, `--color-text-primary`, 1–2 lines maximum
3. Body — one sentence, `--color-text-secondary`, explains what's missing and why
4. CTA button — primary tier, single action only

**Rules:**
- Never render a bare empty container without this treatment
- The CTA links to the creation action or a specific knowledge base article — never the help root
- The icon must be recognizable and relevant to the content type (phone icon for calls, folder for accounts)
- Do not use an error icon or spinner — the empty state is neutral, not a failure

See [onboarding.md](onboarding.md) for the zero-data state rules that govern when and how this component is used.

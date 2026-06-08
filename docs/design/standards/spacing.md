# Spacing

Standards for margins, padding, and gaps. All spatial values are defined in `tokens.md` — reference them by token name, never hardcode raw values.

---

## Base Unit Rule

All spacing in the UI is a multiple of the base 8px unit. Token names follow the `--spacing-*` scale. Use the smallest token that provides sufficient visual separation — do not skip levels to create artificial breathing room.

---

## Component Internal Padding

Padding inside a component (between its border and its content) uses tighter spacing tokens than the gaps between components. A card's internal padding should feel snug relative to the space between cards.

---

## Component Gap Rules

| Context | Spacing guidance |
|---|---|
| Items within a list or stack | Use `--spacing-sm` between rows |
| Cards in a grid | Use `--spacing-md` between cards |
| Section breaks within a page | Use `--spacing-lg` or `--spacing-xl` |
| Related fields within a form | Use `--spacing-sm` between fields |
| Unrelated field groups in a form | Use `--spacing-lg` between groups |

---

## Screen-Edge Padding

All pages apply consistent horizontal padding at the screen edge so content never bleeds to the viewport boundary.

- Desktop: `--spacing-xl` on each side
- Mobile: `--spacing-md` on each side

Sticky headers and bottom tab bars extend edge-to-edge (no horizontal padding) so they feel anchored to the device frame.

---

## Density Rule

The product uses **medium density**. When in doubt between two spacing tokens, prefer the larger — overcrowding data is a more common failure than wasting whitespace. The exception is the quick-log form on mobile, where compact density keeps the form within the visible viewport without scrolling.

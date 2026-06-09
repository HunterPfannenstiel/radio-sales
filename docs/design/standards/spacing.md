# Spacing

Standards for margins, padding, and gaps. Literal values live in `globals.css` — reference them by `--spacing-*` token name, never hardcode raw values.

---

## Base Unit Rule

All spacing is a multiple of the 8px base unit. Use the smallest token that provides sufficient visual separation — do not skip levels to create artificial breathing room.

---

## Density

The product uses **medium density**. The control room metaphor calls for instrument-grade clarity — not airy consumer-app whitespace, not data-dense financial terminal cramping. When choosing between two spacing tokens, prefer the larger: overcrowding data is a more common failure than wasting whitespace.

The exception is the quick-log form on mobile, where compact density keeps the form within the visible viewport without scrolling.

---

## Component Internal Padding

Padding inside a component uses tighter tokens than the gaps between components. A card's internal padding should feel snug relative to the space around it.

---

## Component Gap Rules

| Context | Token |
|---|---|
| Items within a list or stack | `--spacing-sm` between rows |
| Cards in a grid | `--spacing-md` between cards |
| Section breaks within a page | `--spacing-lg` or `--spacing-xl` |
| Related fields within a form | `--spacing-sm` between fields |
| Unrelated field groups in a form | `--spacing-lg` between groups |

---

## Screen-Edge Padding

Content never bleeds to the viewport boundary.

- Desktop: `--spacing-xl` on each side
- Mobile: `--spacing-md` on each side

Sticky headers and the bottom tab bar extend edge-to-edge — no horizontal padding — so they feel anchored to the device frame.

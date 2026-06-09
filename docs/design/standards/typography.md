# Typography

Rules for font usage, type hierarchy, and text legibility. Literal values (sizes, weights, line-heights) live in `globals.css` — reference them by `--font-*` token name.

---

## Two Fonts, Two Roles

The product uses two typefaces with distinct, non-overlapping jobs:

**Barlow Condensed** (`font-heading`) — the scoreboard font. Built for marquees and broadcast displays. Numbers at hero size should feel like a final score, not a report. This is the typographic expression of the On Air metaphor.

**Inter Tight** (`font-sans`) — the working font. Clear, humanist, legible at small sizes. Used for everything that isn't a broadcast moment.

---

## When to Use Barlow Condensed

Reserve it for moments that feel like a broadcast:

- Page-level H1 titles
- Hero stat displays — revenue figures, pacing numbers, goal percentages
- VU meter labels and scoreboard-style readouts

---

## When to Use Inter Tight

Everything else:

- Card headers (H2, H3)
- Form labels, input text, button text
- Navigation items
- Body copy, metadata, timestamps

If it's a working UI element rather than a performance moment, it's Inter Tight.

---

## Type Scale Usage

Apply levels by semantic role, not visual preference:

| Level | Token | When to use |
|---|---|---|
| Hero | `--font-size-hero` | Primary dashboard stat — the number checked first every morning |
| H1 | `--font-size-h1` | Page title — one per page, never inside a card |
| H2 | `--font-size-h2` | Section header within a page |
| H3 | `--font-size-h3` | Card header or sub-section title |
| Body | `--font-size-body` | All prose, labels, and default UI text |
| Small | `--font-size-small` | Secondary metadata, supporting labels |
| Micro | `--font-size-micro` | Timestamps, status hints, legal text |

Never skip a level for visual effect. If H2 feels too large for a context, the component hierarchy is likely wrong.

---

## Weight Rules

Use the minimum weight that achieves clear hierarchy:

- H1 (Barlow Condensed): bold — the scoreboard demands it
- H2–H3 (Inter Tight): bold — structural headings need visual anchor
- Body and labels: regular
- Emphasis within body copy: medium — not bold, not italic
- Destructive or warning labels: medium for added visual signal

Never use italic for UI labels. Reserve it for quoted content or user-generated text.

---

## Line-Height Rules

- Body text: `--line-height-body` — supports readability in dense data views
- Headings: `--line-height-heading` — prevents excessive vertical space
- Single-line UI elements (buttons, badges, tab labels): line-height matches element height — text must never wrap

---

## WCAG Contrast Policy

All text must meet WCAG AA minimum contrast ratios:

- Body text and small labels: **4.5:1 minimum**
- Large text (H1–H2) and meaningful icons: **3:1 minimum**

When in doubt, use `--color-text-primary` on `--color-surface-page` — the base pairing is always safe.

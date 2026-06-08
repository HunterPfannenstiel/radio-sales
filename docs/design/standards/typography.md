# Typography

Standards for font usage, type hierarchy, and text legibility. Concrete values (size, weight, line-height) live in `tokens.md` — reference them by `--font-*` token name.

---

## Font Family

A single humanist sans-serif family is used throughout the product. It is defined in `--font-family-base`. No decorative or serif typefaces are used anywhere in the UI.

---

## Type Scale Usage Rules

The scale runs from `--font-size-h1` (largest) to `--font-size-micro` (smallest). Apply levels by semantic role, not visual preference:

| Level | Token | When to use |
|---|---|---|
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

- Headings (H1–H3): bold weight (`--font-weight-bold`)
- Body and labels: regular weight (`--font-weight-regular`)
- Emphasis within body copy: medium weight (`--font-weight-medium`) — not bold, not italic
- Destructive or warning labels may use medium weight for added visual signal

Never use italic for UI labels. Reserve it for quoted content or user-generated text if needed.

---

## Line-Height Rules

- Body text: generous line-height (`--line-height-body`) — supports readability in dense data views
- Headings: tight line-height (`--line-height-heading`) — prevents excessive vertical space on short one-line titles
- Single-line UI elements (buttons, badges, tab labels): set line-height to match the element height — never let text wrap

---

## WCAG Contrast Policy

All text must meet WCAG AA minimum contrast ratios:

- Body text and small labels against their background: **4.5:1 minimum**
- Large text (H1–H2) and meaningful icons against their background: **3:1 minimum**

Color values that achieve these ratios are defined in `tokens.md`. Do not pair text and background tokens that haven't been validated for contrast. When in doubt, use `--color-text-primary` on `--color-surface-page` — the base pairing is always safe.

# Color

Rules for semantic color usage. Actual values (hex, HSL) live in `tokens.md` — reference colors by `--color-*` token name only.

---

## Surface Hierarchy

Surfaces create depth and grouping. Use them in order — never apply a deeper surface token on a shallower parent.

| Token | Role |
|---|---|
| `--color-surface-page` | The outermost page background |
| `--color-surface-subtle` | Section backgrounds, sidebar background |
| `--color-surface-card` | Cards, panels, form containers |
| `--color-surface-raised` | Dropdowns, tooltips, popovers — sits above cards |

Cards use `--color-surface-card` as their background, never `--color-surface-page`. A card on a card is not permitted — flatten the component instead.

---

## Border Usage

| Token | When to use |
|---|---|
| `--color-border-default` | Card edges, input outlines, dividers |
| `--color-border-strong` | Focus rings, active states, error outlines |
| `--color-border-subtle` | Separators within a card (low emphasis) |

---

## Text Colors

| Token | When to use |
|---|---|
| `--color-text-primary` | All default body and heading text |
| `--color-text-secondary` | Supporting metadata, secondary labels |
| `--color-text-disabled` | Text inside disabled components |
| `--color-text-inverse` | Text on dark/filled backgrounds (primary buttons, status badges) |

Never use `--color-text-secondary` for interactive labels — they must use `--color-text-primary` to maintain legibility and distinguish from inactive text.

---

## Semantic State Colors

Borrowed from LevelEleven's pacing system. Applied consistently wherever performance status, sync state, or feedback is communicated.

| Token | Meaning | Use |
|---|---|---|
| `--color-status-success` | Ahead / confirmed | Pace above target, synced, sold |
| `--color-status-info` | On pace / neutral info | Within acceptable range, informational |
| `--color-status-warning` | Behind / needs attention | Below pace, errors, destructive actions |
| `--color-status-achieved` | Goal reached | 100%+ to goal — distinct from success |

**Rule:** Status colors are for status — never repurpose them for decoration. A green badge always means positive performance, a red element always signals urgency or danger. Violating this erodes the entire color language.

---

## Primary & Accent Colors

| Token | Use |
|---|---|
| `--color-accent-primary` | Primary CTA buttons, active nav items, key interactive elements |
| `--color-accent-secondary` | Supporting interactive elements, hover states, secondary actions |

Use `--color-accent-primary` sparingly — one prominent element per view. If everything is accented, nothing is.

# Color

Rules for semantic color usage. Literal values live in `globals.css` — reference colors by `--color-*` token name only.

---

## The On Air Palette

The color system flows from the On Air metaphor. Three zones define the visual world:

- **The control room** — the sidebar. Dark charcoal, always present, instrument-grade. Uses the `--sidebar-*` token family, not the surface hierarchy. It is a special context with its own color environment.
- **The stage** — the main canvas. Warm off-white. This warmth is intentional and load-bearing — it separates the product from sterile neutral SaaS. Never flatten light-mode surfaces to zero chroma.
- **The signal** — On Air red (`--color-accent-primary`). It marks what's live, what's critical, what's leading. Use it sparingly: one prominent element per view. If everything is accented, nothing is.

---

## Surface Hierarchy

Use surfaces in order — never apply a deeper surface token on a shallower parent.

| Token | Role |
|---|---|
| `--color-surface-page` | The outermost page background — the stage |
| `--color-surface-subtle` | Section backgrounds |
| `--color-surface-card` | Cards, panels, form containers |
| `--color-surface-raised` | Dropdowns, tooltips, popovers |

Cards use `--color-surface-card`, never `--color-surface-page`. A card on a card is not permitted — flatten the component instead.

The sidebar is exempt from this hierarchy. It uses `--sidebar` and its associated token family.

---

## Text Colors

| Token | When to use |
|---|---|
| `--color-text-primary` | All default body and heading text |
| `--color-text-secondary` | Supporting metadata, secondary labels |
| `--color-text-disabled` | Text inside disabled components |
| `--color-text-inverse` | Text on dark/filled backgrounds |

Never use `--color-text-secondary` for interactive labels — they must use `--color-text-primary` to maintain legibility and distinguish from inactive text.

---

## Border Usage

| Token | When to use |
|---|---|
| `--color-border-default` | Card edges, input outlines, dividers |
| `--color-border-strong` | Focus rings, active states, error outlines |
| `--color-border-subtle` | Separators within a card |

---

## Accent — The Signal Color

`--color-accent-primary` is On Air red. It is the most semantically loaded color in the system — it means *this is live, this matters now*. Treat it like the red light in the studio: never decorative, always meaningful.

`--color-accent-secondary` is for hover states and supporting interactive elements — never as a primary signal.

---

## Status Colors

Borrowed from LevelEleven's pacing system. Applied wherever performance status, sync state, or feedback is communicated.

| Token | Meaning | Use |
|---|---|---|
| `--color-status-success` | Ahead / confirmed | Pace above target, synced, sold |
| `--color-status-info` | On pace / neutral info | Within acceptable range, informational |
| `--color-status-warning` | Behind / needs attention | Below pace, errors, destructive actions |
| `--color-status-achieved` | Goal reached | 100%+ to goal — distinct from success |

Status colors are for status — never repurpose them for decoration. A green badge always means positive performance; a red element always signals urgency or danger. Violating this erodes the entire color language.

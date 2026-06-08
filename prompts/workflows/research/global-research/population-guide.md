# Standards Population Guide

## Core Rule
Standards files contain **rules and decisions**, not token values. If a research finding
is a concrete value (hex code, px number, ms duration, rem size), it belongs in
`tokens.md`. If it is a policy for *when* or *how* to use something, it belongs in a
standards file.

## Referencing Tokens
When a standards file needs to reference a token, use CSS custom property syntax in
backticks inline. Example:

> Cards use `--surface-card` as their background, never `--surface-page`.

Token naming follows these prefixes — all values live in `tokens.md`:

| Prefix | Covers |
|---|---|
| `--color-*` | Surface, border, text, and semantic state colors |
| `--spacing-*` | Grid scale values, screen-edge padding |
| `--radius-*` | Corner radii |
| `--duration-*` | Animation and transition durations |
| `--font-*` | Font family, size scale, weight |

## File Boundaries
For a quick indexed view of all standards files, see [navigation-guide.md](navigation-guide.md).
The boundaries below clarify what belongs in each file and what to redirect elsewhere.

### spacing.md
Not here: corner radii (→ components.md), token values (→ tokens.md).

### typography.md
Not here: color values (→ tokens.md), icon sizing (→ iconography.md).

### color.md
Not here: actual hex or HSL values (→ tokens.md).

### iconography.md
Not here: icon token sizes as px values (→ tokens.md).

### layout.md
Not here: navigation chrome (→ navigation.md), spacing scale (→ spacing.md).

### navigation.md
Not here: layout breakpoints (→ layout.md), density model (→ spacing.md).

### motion-loading.md
Not here: actual duration values (→ tokens.md).

### error-handling.md
Not here: error state colors (→ color.md), input anatomy (→ components.md).

### access-states.md
Not here: specific permission logic (feature-level concern).

### onboarding.md
Not here: empty state component anatomy (→ components.md).

### destruction-safety.md
Not here: modal/dialog anatomy (→ components.md).

### help-integration.md
Not here: icon style (→ iconography.md), tooltip component anatomy (→ components.md).

### components.md
Not here: CRUD composition patterns (→ crud-workflows.md), token values (→ tokens.md).

### crud-workflows.md
Not here: form input anatomy (→ components.md), slide-over mechanics (→ navigation.md).

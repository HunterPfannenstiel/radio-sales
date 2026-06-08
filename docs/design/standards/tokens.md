# Tokens

Literal values for every design token referenced in the standards. All other standards files reference these by name — never hardcode raw values in components or styles.

CSS custom property syntax. Copy directly into `globals.css` `:root` and `.dark` blocks when implementing.

---

## Color — Light Mode (`:root`)

### Surfaces

```css
--color-surface-page:    oklch(0.975 0 0);   /* #F8F9FA — outermost page background */
--color-surface-subtle:  oklch(0.950 0 0);   /* #F1F3F5 — section backgrounds, sidebar */
--color-surface-card:    oklch(1 0 0);        /* #FFFFFF — cards, panels, form containers */
--color-surface-raised:  oklch(1 0 0);        /* #FFFFFF — dropdowns, tooltips, popovers (shadow provides separation) */
```

### Borders

```css
--color-border-default:  oklch(0.922 0 0);   /* #E5E7EB — card edges, input outlines, dividers */
--color-border-strong:   oklch(0.556 0 0);   /* #6B7280 — focus rings, active states, error outlines */
--color-border-subtle:   oklch(0.961 0 0);   /* #F3F4F6 — separators within a card */
```

### Text

```css
--color-text-primary:    oklch(0.145 0 0);   /* #111827 — all default body and heading text */
--color-text-secondary:  oklch(0.556 0 0);   /* #6B7280 — supporting metadata, secondary labels */
--color-text-disabled:   oklch(0.708 0 0);   /* #9CA3AF — text inside disabled components */
--color-text-inverse:    oklch(1 0 0);        /* #FFFFFF — text on dark/filled backgrounds */
```

### Status (LevelEleven pacing palette)

```css
--color-status-success:  oklch(0.627 0.194 142.5);  /* #16A34A green  — ahead / confirmed / synced */
--color-status-info:     oklch(0.546 0.243 264.4);  /* #2563EB blue   — on pace / neutral info */
--color-status-warning:  oklch(0.505 0.209 27.3);   /* #DC2626 red    — behind / needs attention */
--color-status-achieved: oklch(0.580 0.120 182.1);  /* #0D9488 teal   — 100%+ to goal */
```

### Accent

```css
--color-accent-primary:    oklch(0.511 0.262 276.9);  /* #4F46E5 indigo-600 — primary CTAs, active nav, key interactive */
--color-accent-secondary:  oklch(0.587 0.234 278.1);  /* #6366F1 indigo-500 — hover states, secondary actions */
```

---

## Color — Dark Mode (`.dark`)

### Surfaces

```css
--color-surface-page:    oklch(0.125 0 0);   /* #111111 */
--color-surface-subtle:  oklch(0.180 0 0);   /* #1C1C1C */
--color-surface-card:    oklch(0.220 0 0);   /* #242424 */
--color-surface-raised:  oklch(0.270 0 0);   /* #2C2C2C */
```

### Borders

```css
--color-border-default:  oklch(1 0 0 / 10%);  /* semi-transparent white */
--color-border-strong:   oklch(1 0 0 / 30%);  /* more visible white */
--color-border-subtle:   oklch(1 0 0 / 6%);   /* very subtle white */
```

### Text

```css
--color-text-primary:    oklch(0.985 0 0);   /* #FAFAFA */
--color-text-secondary:  oklch(0.708 0 0);   /* #9CA3AF */
--color-text-disabled:   oklch(0.439 0 0);   /* #5A5A5A */
--color-text-inverse:    oklch(0.145 0 0);   /* #111827 — for text on light-bg badges */
```

### Status (brighter for dark background legibility)

```css
--color-status-success:  oklch(0.696 0.178 142.5);  /* brighter green */
--color-status-info:     oklch(0.623 0.214 264.4);  /* brighter blue */
--color-status-warning:  oklch(0.627 0.209 27.3);   /* brighter red */
--color-status-achieved: oklch(0.651 0.118 182.1);  /* brighter teal */
```

### Accent

```css
--color-accent-primary:    oklch(0.607 0.246 277.0);  /* lighter indigo for dark background */
--color-accent-secondary:  oklch(0.686 0.182 278.1);  /* even lighter indigo */
```

---

## Typography

Font family and scale are mode-independent — same values in `:root` and `.dark`.

```css
--font-family-base: "Geist", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

### Type scale

```css
--font-size-h1:    2.25rem;    /* 36px — page title, one per page */
--font-size-h2:    1.875rem;   /* 30px — section header within a page */
--font-size-h3:    1.5rem;     /* 24px — card header or sub-section title */
--font-size-body:  0.875rem;   /* 14px — all prose, labels, default UI text */
--font-size-small: 0.75rem;    /* 12px — secondary metadata, supporting labels */
--font-size-micro: 0.6875rem;  /* 11px — timestamps, status hints, legal text */
```

### Weights

```css
--font-weight-bold:    700;
--font-weight-medium:  500;
--font-weight-regular: 400;
```

### Line height

```css
--line-height-body:    1.5;   /* body text, dense data views */
--line-height-heading: 1.2;   /* headings, prevents excess vertical space */
```

---

## Spacing

8px base unit. All spacing is a multiple of `0.5rem` (8px).

```css
--spacing-xs:  0.25rem;  /*  4px */
--spacing-sm:  0.5rem;   /*  8px */
--spacing-md:  1rem;     /* 16px */
--spacing-lg:  1.5rem;   /* 24px */
--spacing-xl:  2rem;     /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

---

## Border Radius

```css
--radius-sm:   0.25rem;  /*  4px — badges, tags, small inline elements */
--radius-md:   0.5rem;   /*  8px — inputs, buttons */
--radius-lg:   0.75rem;  /* 12px — general large elements */
--radius-card: 0.75rem;  /* 12px — cards and panels (semantic alias for --radius-lg) */
--radius-xl:   1.25rem;  /* 20px — modals, overlays */
```

---

## Duration

```css
--duration-fast:  100ms;  /* hover states, focus rings, color changes */
--duration-base:  200ms;  /* panel slide-ins, modal enter/exit, tab switches */
--duration-slow:  400ms;  /* full-page transitions, onboarding overlays, celebrations */
```

---

## Breakpoints

Used in media queries. Values are min-width thresholds.

```css
--breakpoint-mobile:  390px;   /* 4-column grid */
--breakpoint-tablet:  768px;   /* 8-column grid */
--breakpoint-desktop: 1280px;  /* 12-column grid */
```

---

## Touch Targets

```css
--touch-target-min: 44px;  /* minimum tappable hit area on mobile (WCAG 2.5.5) */
```

---

## Icon Sizes

Lucide React icon dimensions. Pass as `size` prop or set `width`/`height`.

```css
--icon-size-xs: 12px;  /* tertiary / muted inline icons */
--icon-size-sm: 16px;  /* standard button icons, inline body icons */
--icon-size-md: 20px;  /* navigation items, primary inline actions */
--icon-size-lg: 24px;  /* secondary empty state icons, section headers */
--icon-size-xl: 40px;  /* primary empty state hero icons, full-page feedback */
```

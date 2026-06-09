# Feature Design: Navigation (Desktop Sidebar + Mobile Tab Bar)

Source concept: `docs/design/standards/navigation.md`, `docs/design/standards/design-thesis.md`
Research references: `docs/design/research/ambition.md`, `docs/design/research/leveleleven.md`, `docs/design/research/pipedrive.md`, `docs/design/research/spotio.md`

---

## Overview

The navigation chrome is the control room. Per the design thesis: dark charcoal, instrument-grade, always present. On Air red is the signal color — it marks what's live. Every decision below follows from that metaphor, not generic SaaS convention.

---

## Desktop Sidebar

### Anatomy (top to bottom)

1. Logo zone
2. Quick Log button
3. Primary nav items
4. Spacer
5. Ambient Pace Badge
6. Secondary nav items (Settings, Profile)

---

### 1. Logo Zone

**Treatment:** Taller vertical padding than the current implementation (~20px top/bottom). "ON AIR" in Barlow Condensed, uppercase, wider letter-spacing — closer to a broadcast-facility wordmark than a product logo. The animated red dot stays left of the wordmark.

Below the wordmark, a thin decorative separator: a row of ~16 staccato vertical bars in `--color-accent-primary` at 15% opacity, evenly spaced, ~3px wide × 8px tall. This is the VU meter detail — the one element that makes the sidebar read as a recording console rather than a generic left nav.

**Why this works:** None of the four reference products do this. Ambition is Apple-clean, Pipedrive is utility-first. The VU meter motif is On Air–exclusive and costs nothing — it's a decorative border, not a data element.

---

### 2. Quick Log — Primary Button

**Treatment:** Full-width pill button below the logo zone. `--color-accent-primary` fill, `--color-text-inverse` label, `PhoneCall` icon left-aligned. Below it, a `--color-border-subtle` hairline separates the action from the nav links below.

This is **not a nav row**. It is a button — distinct in shape, color, and weight from everything below it.

**Why this works:** Spotio's 3-tap methodology and `navigation.md`'s "north star interaction" language both say this action should be unreachable by mistake and instantly identifiable. Making it a filled button rather than a nav row gives it that unreachability in visual terms — it doesn't live in the same register as "Pipeline" or "What's Next."

---

### 3. Primary Nav Items

**Items (in order):** Dashboard, What's Next, Pipeline, Accounts, Coaching

**Active state:** Filled `bg-sidebar-accent` background + a 3px left-edge accent bar in `--color-accent-primary`. The bar is the live-channel indicator — the channel that's receiving signal has a red mark. Inspired by Pipedrive and Spotio's active-state treatments but reframed through the radio metaphor.

**Inactive state:** Icon and label in `--color-text-secondary`. No fill, no bar.

**Icon size:** `--icon-size-md` (20px) — up from the current 16px. The larger icon gives the sidebar the instrument-panel visual weight it needs.

**Section label:** A `--font-size-micro` uppercase label in `--color-text-secondary` above this group — "NAVIGATE". Keeps the sidebar from reading as a flat undifferentiated list. Inspired by Pipedrive's information hierarchy.

---

### 4. Ambient Pace Badge

> **Mocked per user instruction.** Hunter confirmed this should be mocked with static data for now — the goal is to see what it looks like before wiring real data.

**Placement:** Above the secondary nav, pinned to the bottom section. Below the primary nav spacer, above Settings/Profile.

**Treatment:** A compact card or chip showing the rep's current-month pace. Two elements:
- A label: `June · 68%` in `--font-size-small`, Barlow Condensed
- A compact progress bar below it, fill color driven by the pace status token (`--color-status-success` for ahead, `--color-status-warning` for behind, etc.)
- A pace badge dot (`●`) color-matching the status token

**Why this works:** None of Ambition, LevelEleven, Pipedrive, or Spotio surface the rep's primary KPI in the nav chrome itself. The sidebar *is* the control room — it should always show whether you're on air. LevelEleven's ambient scorecard widget was the closest antecedent, but it lived in a separate panel. Bringing it into the sidebar frame is the On Air move.

**When real data is wired:** The mocked values (`June`, `68%`, status color) are replaced by the rep's live dashboard data. The component is otherwise identical.

---

### 5. Secondary Nav Items

**Items:** Settings, Profile

**Section label:** `--font-size-micro` uppercase label — "ACCOUNT".

**Treatment:** Same inactive style as primary nav items. No active bar or fill needed — these are utility destinations, not primary navigation.

---

## Mobile Tab Bar

### Anatomy

5 tabs, edge-to-edge, center tab elevated.

**Tab order (left to right):** Dashboard, What's Next, [Log Call — center], Pipeline, More

**Tab order rationale:** `navigation.md` specifies Dashboard as the leftmost tab on mobile. The current implementation put Pipeline first — this corrects that. The Dashboard tab uses the `⊞` grid icon.

---

### Center Tab — Quick Log

**Treatment:** A raised circle (not a flat rectangle) that breaks the tab bar plane upward. ~52px diameter, `--color-accent-primary` fill, white `PhoneCall` icon centered. The circle floats above the bar baseline, with the tab bar's background color forming a visual "notch" behind it.

This is more tactile than the current `rounded-t-xl` rectangle — it reads as a dedicated action control, not a styled tab.

**Why this works:** Spotio's center-action pattern, elevated to match the On Air aesthetic. The circle-break is a stronger signal than a rectangle with rounded corners.

---

### Active Tab Indicator

**Treatment:** A 2px accent dot above the active tab's icon in `--color-accent-primary`. Positioned above the icon, not below. "Above" reads as "this channel is receiving signal" — consistent with broadcast metaphor. The center Log Call tab has no indicator; its shape is its own permanent indicator.

**Why above, not below:** Underlines read as text decoration or a generic active-state convention. A dot above the icon reads as a signal indicator — more specific to the product's language.

---

### Tab Labels

**Treatment:** `--font-size-micro` (0.6875rem), Barlow Condensed, uppercase, `--font-weight-medium`. Inactive: `--color-text-secondary`. Active: `--color-accent-primary`. Center (Log Call): `--color-text-inverse`.

Keeping the "scoreboard" feel consistent down to the smallest text in the app.

---

## What's different from the reference products

| Move | Closest reference | What we do differently |
|---|---|---|
| VU meter logo separator | None | On Air–exclusive — decorative but metaphor-grounded |
| Quick Log as a distinct button | Spotio center tab | Full-width pill in sidebar — not a nav row at all |
| Left accent bar on active item | Pipedrive/Spotio implicit | Framed as a live-channel indicator, not just active state |
| Ambient pace badge in nav chrome | LevelEleven scorecard widget | Embedded in the sidebar itself, not a separate widget |
| Signal dot above active tab | Ambition/Spotio active states | "Above" the icon reads as signal-receiving, not just selected |
| Circle-break center tab | Spotio 3-tap center action | Raised circle vs. flat rectangle — more tactile and elevated |

---

## Outstanding Items

| Item | Status |
|---|---|
| Ambient pace badge | Mocked — real data wiring deferred |
| Keyboard shortcuts for nav items | Not designed — Pipedrive pattern, worth revisiting when scope allows |
| Sidebar collapse behavior | Not permitted per `navigation.md` — sidebar is always visible on desktop |
| "More" tab expansion on mobile | Contents TBD — assumed to include Settings, Coaching, Profile |

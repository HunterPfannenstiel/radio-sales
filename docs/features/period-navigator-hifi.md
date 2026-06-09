# High-Fidelity: Period Navigator

Source: `app/page.tsx` — `PeriodNavigator` component (lines 121–252)
Research references: Ambition, LevelEleven, Pipedrive, Spotio

---

## What This Document Is

The `PeriodNavigator` was previously deferred in the dashboard hifi doc (`rep-daily-dashboard-hifi.md`, Open Items). This document records every design decision for the high-fidelity redesign — what changes, what's new, and why. It supersedes pending item #5 (NOW badge color) from the dashboard hifi doc and replaces that item with a different solution.

---

## What's Changing

### 1. Containment Panel

**Change:** Wrap both navigator rows in a surface container — `--color-surface-subtle` background, `--radius-card` corners, `--spacing-sm` padding, `--color-border-default` border 1px.

**Rationale:** The current implementation floats two bare rows directly on the page background with no visual grouping. Every reference product contains the period selector as a distinct UI unit. Pipedrive's date range header and Ambition's period selector both sit in a slightly elevated surface — they read as a control, not ambient text. The containment also solves a perceptual problem: the month and week rows currently feel like two unrelated items; the panel communicates that they are one linked control.

**Surface token choice:** `--color-surface-subtle` (not `--color-surface-card`) is intentional. The navigator is a control surface, not a data card. Placing it one level shallower than the cards below creates correct visual hierarchy — the data cards are elevated relative to the control that governs them.

**Discrepancy with standards:** The component standard says "cards use `--color-surface-card`." This component is not a card — it is a control. The `--color-surface-subtle` token is correct here. Noted as an intentional deviation.

---

### 2. Live State — Container Left Accent

**Change:** When both the selected month and selected week are the current live period, the container gains `borderLeft: "4px solid var(--color-accent-primary)"`. When either period is navigated away from the current, the left accent is absent and the standard `--color-border-default` border applies on all sides.

**Rationale:** Ambition's design principle: the container communicates liveness, not a chip inside it. Spotio's current-period treatment reads the selected period as a location ("you are HERE"), not just an annotation. The left accent creates a deliberate visual rhyme with the MoneyPaceCard directly below — both carry the red left border when live. The dashboard reads as "on air" in two places at once: the period you are viewing and the revenue card for that period.

This makes the NOW badges on individual rows unnecessary in the most common case — when the user is viewing the present.

---

### 3. Month Label — Barlow Condensed

**Change:** Month label moves from Inter Tight to `font-heading` (Barlow Condensed), `--font-size-h3`, bold.

**Rationale:** The typography standard explicitly lists "VU meter labels and scoreboard-style readouts" as Barlow Condensed territory. The month is the broadcast timeframe — "JUNE 2026" is the channel, not a form label. LevelEleven's scoreboard header uses condensed display type for the period for the same reason: it reads as a readout, not a control. The current Inter Tight rendering undersells the broadcast character the design system is built around.

Label format stays as `toLocaleDateString` output ("June 2026") — Barlow Condensed's display weight provides the scoreboard character without needing explicit all-caps.

---

### 4. Week Label — Stays in Inter Tight

**Change:** No change to font. Week label stays in `font-sans`, `--font-size-small`, `--color-text-secondary`.

**Rationale:** The week is subordinate context — the sub-label under the broadcast period. Keeping it in Inter Tight creates clear typographic hierarchy between the two rows: Barlow Condensed primary, Inter Tight secondary. Applying the broadcast font to both rows would flatten the hierarchy.

---

### 5. Row Divider

**Change:** Add a `--color-border-subtle` full-width hairline divider between the month row and the week row, inside the container.

**Rationale:** The divider reinforces that these are two linked but distinct selectors — consistent with Pipedrive's treatment of month-as-frame and week-as-granular-selector. Without the divider, the two rows read as stacked list items; with it, they read as a two-level control.

---

### 6. "Today" Ghost Button Replaces NOW Badges

**Change:** Remove the inline NOW pill badges from both rows. Replace with a single ghost-tier "Today" button, right-aligned in the container footer, visible only when either selected period is not the current live period. When both periods are current, this slot is empty.

**Rationale:** Two inline NOW badges create visual noise precisely where no action is possible — they are purely informational, not interactive. Spotio and Pipedrive both use a "Today" / "This week" reset control that appears only when the user has navigated away. This is more useful: instead of annotating "you are not here," it answers "how do I get back?"

The ghost tier is correct because this is a low-priority utility action — it resets state, it is not the primary interaction on the page.

**Discrepancy with existing hifi doc:** This supersedes pending item #5 ("NOW badge color — change `--color-status-info` → `--color-accent-primary`"). The badge color fix is no longer needed because the badges are removed. The `--color-accent-primary` signal is carried by the container left accent (item 2 above) instead.

---

### 7. Semantic Row Icons

**Change:** Add a small icon at the left edge of each row label — `TrendingUp` (16px, `--color-text-secondary`) before the month label; `PhoneCall` (16px, `--color-text-secondary`) before the week label.

**Rationale:** None of the four reference products do this — they don't need to because they don't have a mixed period model (monthly revenue + weekly activity on the same dashboard). Here the two rows govern different card groups below, and that relationship is not currently communicated. A rep scanning the navigator for the first time has no visual signal that the month row is tied to money pace and the week row to activity. The icons create that link at a glance without adding text.

Icon weight is deliberately secondary-colored and 16px — present but not competing with the period labels.

---

### 8. Layout Shift Prevention

**Change:** Apply `min-width: 12ch` to the month label container; `min-width: 16ch` to the week label container.

**Rationale:** The current implementation causes the chevron buttons to shift horizontally as the label text changes length ("May" vs. "September", "Week 1" vs. "Week 52 · Dec 26 – Jan 2"). This is a locked decision from the dashboard hifi doc open items. Fixed widths are sized to the longest realistic label in each row.

---

## What's New

### 9. "Jump to today" clears both periods simultaneously

When the "Today" button is clicked, both `selectedYear`/`selectedMonth` and `selectedWeekYear`/`selectedWeek` reset to the current live periods in a single interaction. The current implementation requires two separate navigation actions (one on the month row, one on the week row) to return to the present. The "Today" action removes that friction and aligns with how all four reference products handle period resets.

---

## Discrepancy Summary

| Standard / Existing Item | Current behavior | This design | Status |
|---|---|---|---|
| Component standard: cards use `--color-surface-card` | Navigator has no surface | Container uses `--color-surface-subtle` — intentional; navigator is a control, not a card | Intentional deviation |
| Typography: `font-heading` for broadcast / scoreboard readouts | Month label in Inter Tight | Month label moves to Barlow Condensed | Aligns with standard |
| Hifi pending item #5: NOW badge → `--color-accent-primary` | `--color-status-info` badge | Badges removed; liveness carried by container left accent | Supersedes item #5 |
| Color standard: `--color-accent-primary` means "live, critical, leading" | Used on badge (small) | Used on container border (structural) | Stronger application of intent |

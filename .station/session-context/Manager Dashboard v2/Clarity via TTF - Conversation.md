# Track A Workshop Briefing: Manager Dashboard + Drill-Down

## Feature Intent
Give a manager a fast, objective view of who's on pace, who's behind, and *why* — without manually sifting raw activity logs. Frame it as a **triage tool**, not a complete record. This is a demoable prototype with mocked data, not a production build — the goal of the workshop is to get something concrete in front of the client for feedback, not to resolve every detail up front.

## Confirmed Decisions (don't re-litigate these)
- **Top-level view**: rep-first list, defaults to current month, ~15 reps, no pagination/search needed
- **Top-level columns per rep**: Sold % to goal, Projected % to goal, and a single *combined* activity-pace indicator (not separate calls/asks signals)
- **No dollar amounts at the top level** — percent only. Dollars ($Sold, $Projected) only appear in drill-down
- **Drill-down** is a diagnostic summary (not a raw log), answering "why is this rep behind pace?" — shows four metrics: activity pace, asks, closing ratio, average account value, each linking out to underlying detail
- **Data ownership**: reps can edit their own logged interactions anytime; managers never edit rep logs (relevant if the workshop touches edit affordances anywhere in drill-down)
- **Platform**: mobile-first, but must also work on desktop (responsive)
- **Benchmarks**: "asks" has a manager-set weekly target (from the goal-setting feature) to compare against; closing ratio and average account value have **no defined target** — treat as informational numbers, don't block design on this

## Explicitly Out of Scope for Track A
- Goal/target configuration UI (that's Track B, a separate standalone page)
- Annual sales goal (dropped from scope entirely)
- Notifications/alerts of any kind
- Historical audit trail of changes

## Genuinely Open — Good Workshop Topics
These have not been decided by the client or resolved in prior sessions, so they're fair game to raise live:
- **Sort/prioritization order** of the rep list — should worst-pacing reps surface to the top, or is it a neutral/alphabetical list the manager scans? This is central to the "triage" framing and hasn't been pinned down.
- **Visual design language** — no design system has been locked in. Note: earlier demo versions of this feature exist, but this workshop is part of a new workflow experiment, so don't treat the old demo as authoritative unless the client brings it up themselves.
- **Risk/color thresholds** — if the design uses color to flag risk (on-track/watch/behind), the actual percentage cutoffs are undefined. Fine to propose something in the room and confirm with the client.
- **Pace indicator visual** — icon, color swatch, sparkline, number — not specified, just "a single combined signal."
- **Drill-down detail-view destinations** — the four metrics link to "underlying detail," but what those detail screens contain hasn't been scoped. Worth asking the client how deep they want this to go for the demo.

## Ground Rule
Per the client's stated approach: when something comes up that isn't covered above, make the fastest reasonable call in the room rather than stalling the workshop — flag it as a follow-up rather than treating it as a blocker.
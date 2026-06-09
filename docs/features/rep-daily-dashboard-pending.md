# Rep Daily Dashboard — Pending Work

## Implement

- [ ] **NOW badge color** — change `--color-status-info` → `--color-accent-primary` in `PeriodNavigator` (both month and week rows)
- [ ] **Activity card count size** — step down from `--font-size-hero` to `--font-size-h1` (Barlow Condensed bold, pace status color); target (`/ N`) stays at `--font-size-h2` secondary
- [ ] **Weekday progress dots** — row of 5 Mon–Fri dots above "N days left" in each activity card footer; filled (●) for elapsed, open (○) for remaining
- [ ] **Goal reached celebration** — when `soldPercent >= 100`: all VU segments in `--color-status-achieved`, hero number in `--color-status-achieved`, single non-looping border pulse animation

## Spec Gaps (not in current implementation)

- [ ] **"Not started" badge suppression** — when targets exist but no activity logged yet, replace pace badges with a neutral "Not started" label (`--color-text-secondary`)
- [ ] **Activity empty state icon** — add the `--icon-size-xl` icon above the headline per the empty state template

## Deferred

- [ ] **Navigator component** — design in progress; decisions locked: red NOW badge (covered above), layout shift fix, possible containment panel

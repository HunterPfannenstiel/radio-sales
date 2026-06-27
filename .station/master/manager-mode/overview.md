# Manager Mode

The app has three distinct modes: rep, manager, and executive. Each user is assigned exactly one role and never transitions between them — the modes are fully separate surfaces, not toggled views.

Manager mode shares the same visual shell as rep mode but replaces the navigation entirely. The rep-specific chrome (Quick Log button, sidebar Log Call CTA, bottom nav center action) does not appear. The manager's job is observation and configuration, not activity logging.

## Navigation

Two primary destinations:

**Rep List** — the manager's default landing. Shows the leaderboard of all reps with pace, sold figures, and projected goal attainment. Tapping a row drills into that rep's diagnostic view.

**Goal Setting** — where the manager configures each rep's monthly sales goal and weekly activity targets.

## Nav Structure

Desktop sidebar: logo zone, then a single nav group with Rep List and Goal Setting. No Quick Log button.

Mobile bottom tab bar: two tabs — Rep List and Goal Setting. No center action button.

## Routing

All manager pages live under `/manager`. The shell determines which nav to render based on the active route.

- `/manager` — Rep List (default landing)
- `/manager/[repId]` — drill-down for a specific rep
- `/manager/goal-setting` — Goal Setting

## Implementation Status

The content pages are already built. What remains is the shell — the sidebar and bottom nav that wrap them.

- `app/manager/` — Rep List and drill-down: done
- `app/manager/goal-setting/` — Goal Setting: done
- Manager sidebar (`DesktopSidebar` equivalent): not yet built
- Manager bottom tab bar (`MobileTabBar` equivalent): not yet built

## Objective

A demoable feature, not a functional one.

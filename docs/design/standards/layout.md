# Layout

Standards for viewport behavior, breakpoints, touch targets, and multi-column collapse. Navigation chrome belongs in [navigation.md](navigation.md). Spacing scale belongs in [spacing.md](spacing.md).

---

## Device Priority

The product is dual-mode. Different surfaces have different primary devices:

| Surface | Primary device |
|---|---|
| Quick-log / call log | Mobile |
| Rep daily dashboard | Desktop (mobile-capable) |
| Manager drill-down | Desktop |
| Leaderboard | Desktop / TV display |
| Executive rollup | Desktop |

Design decisions for the quick-log screen must prioritize the mobile viewport first. All other screens are designed desktop-first and adapted downward.

---

## Breakpoint Tiers

Three tiers. Specific pixel values are defined in `globals.css`.

| Tier | Name | Grid |
|---|---|---|
| Desktop | `--breakpoint-desktop` | 12-column |
| Tablet | `--breakpoint-tablet` | 8-column |
| Mobile | `--breakpoint-mobile` | 4-column |

---

## Multi-Column Collapse Rules

- Multi-column desktop grids collapse to single-column on mobile — no side-by-side panels at mobile width
- Dashboard gauge panels stack vertically on mobile, never side-by-side
- Navigation switches from left sidebar (desktop) to bottom tab bar (mobile) — see [navigation.md](navigation.md)
- No horizontal scrolling on any breakpoint

---

## Touch Target Policy

All interactive elements on mobile meet the minimum touch target size defined in `globals.css`. This applies to buttons, links, nav items, icons, and any tappable element — even if the visible element is smaller, the tappable hit area must meet the minimum.

---

## Safe Area Handling

On mobile, content must respect device safe areas (notch, home indicator, rounded corners). Apply safe area insets to:

- The bottom tab bar (above the home indicator)
- Any fixed bottom elements (floating action buttons, toast notifications)
- Top-fixed elements when the status bar is present

Never place interactive content behind system chrome.

---

## Reachability Zones

On mobile, the thumb-friendly zone is the bottom half of the screen. Apply this to the quick-log form specifically:

- Primary action (submit / save) sits in the lower thumb zone
- Destructive or secondary actions sit above — harder to reach by accident
- The bottom tab bar placement is thumb-zone intentional

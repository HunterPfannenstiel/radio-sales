# Feature Design: Business View — Concept 4: What's Next List

Source concept: `docs/master/Feature_Concept_Document___Opportunity_Progression_per_Business__Stage___Next_Step___History_.md`

---

## Overview

The What's Next list is the rep's personal work queue. Every business that has a logged next step appears here. The organizing principle is action, not inventory — the page frames each account around what the rep needs to do, not simply who the account is. This is the primary entry point into the Business View overlay (Concepts 1–3).

---

## Layout Decision

Desktop-first per `docs/design/standards/layout.md`. Single-column content list on all breakpoints — no multi-column grid needed. Navigation switches from left sidebar to bottom tab bar on mobile.

---

## Wireframe — Desktop

```
┌──────────────────┬────────────────────────────────────────────────────┐
│ [LOGO]           │ What's Next                                         │
│ ────────────     │                                                     │
│ ▶ Quick Log      │ ┌──────────────────────────────────────────────┐   │
│ ⊞ Dashboard      │ │ Riverside Auto Group    [● CLOSE]  [Log call]│   │
│ ✓ What's Next ●  │ │ Follow up on proposal — waiting on GM        │   │
│ ◫ Pipeline       │ │ approval                                     │   │
│                  │ └──────────────────────────────────────────────┘   │
│      ···         │                                                     │
│                  │ ┌──────────────────────────────────────────────┐   │
│ ⚙ Settings      │ │ Downtown Furniture Co  [● PRESENT] [Log call]│   │
│ ? Help           │ │ Send revised package by Friday               │   │
│                  │ └──────────────────────────────────────────────┘   │
│                  │                                                     │
│                  │ ┌──────────────────────────────────────────────┐   │
│                  │ │ Metro Plumbing        [● APPROACH][Log call] │   │
│                  │ │ First call — intro only, not ready for ask   │   │
│                  │ └──────────────────────────────────────────────┘   │
└──────────────────┴────────────────────────────────────────────────────┘
```

---

## Wireframe — Mobile

```
┌──────────────────────────────┐
│ What's Next                  │
├──────────────────────────────┤
│ ┌────────────────────────┐   │
│ │ Riverside Auto Group   │   │
│ │ [● CLOSE]              │   │
│ │ Follow up on proposal  │   │
│ │ — waiting on GM        │   │
│ │ approval               │   │
│ │             [Log call] │   │
│ └────────────────────────┘   │
│ ┌────────────────────────┐   │
│ │ Downtown Furniture Co  │   │
│ │ [● PRESENT]            │   │
│ │ Send revised package   │   │
│ │ by Friday              │   │
│ │             [Log call] │   │
│ └────────────────────────┘   │
│                              │
│  [⊞]  [✓]  [+]  [◫]  [👤]  │  ← bottom tab bar; [+] = Quick Log
└──────────────────────────────┘
```

---

## Component Behaviors

**Page title**
- "What's Next" — H1 weight

**Business cards**
- Standard card style (`--spacing-md` padding)
- Clickable: the full card body (excluding the "Log call" button) is a tap target
- Hover state: `--color-surface-subtle` background per `docs/design/standards/components.md`

**Business name**
- H3 weight, single line, truncates with ellipsis on overflow

**Stage badge**
- Display-only on this screen — tapping it does nothing
- Interactive stage editing happens inside the Business View overlay (Concept 2)
- Same pill style as Concept 1, without the chevron

**Next step text**
- Body weight; truncates at 2 lines with ellipsis
- Full text is visible once the Business View overlay opens

**"Log call" button**
- Secondary tier on desktop, pinned to card footer right
- Full-width in card footer on mobile
- Opens QuickLog as a centered modal (desktop) or bottom sheet (mobile)
- Pre-fills the business; does not navigate away from the list

**Sort order**
- Most recently contacted first (most recent call log date)
- Accounts with no call history yet appear at the bottom, sorted alphabetically among themselves
- No user-controlled sort in v1

**No filtering or grouping in v1** — flat list only

---

## Empty State

Follows the empty state template from `docs/design/standards/components.md`.

- Icon: checklist or task icon
- Headline: "No accounts yet"
- Body: "Log a call to start building your book."
- CTA: primary tier "Log a call" — opens QuickLog

---

## Navigation Summary

**Into the What's Next list:**
- "What's Next" nav item in sidebar (desktop) or tab bar (mobile)

**From the What's Next list:**
- Tapping a card body → Business View overlay opens over the list (Concept 1)
- "Log call" on a card → QuickLog opens as modal/bottom sheet over the list; list stays behind it
- Quick Log nav item / center tab → QuickLog opens; list stays behind it

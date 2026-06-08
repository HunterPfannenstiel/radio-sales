# Feature Design: Business View — Concept 4: What's Next List (High-Fidelity)

Transition document — records what changed from the low-fidelity spec in `concept-4-whats-next-list.md` and what is new.

---

## What Changed

### 1. Next step text color: secondary → primary

**Low-fi:** Next step text rendered in `--color-text-secondary`.
**High-fi:** Promote to `--color-text-primary`.

The next step is the reason this account appears on this page. Rendering it in secondary color visually subordinates the page's core purpose. Secondary color is reserved for the metadata line below it (see addition 3).

---

### 2. Next step text gets a left-border accent

A 2–3px left border in `oklch(from var(--color-accent-primary) l c h / 40%)` with `--spacing-sm` left-padding — identical to the `NextStepCallout` treatment in `BusinessHeader` (Concept 2).

Visually marks each card's action item without adding a new element. Creates visual consistency between the list view and the detail overlay. Reinforces the "work queue" framing: each card is an open action, not a directory entry.

---

### 3. `lastContactedAt` rendered as secondary metadata

**Low-fi:** Field present in `BusinessCardData` type but not rendered.
**High-fi:** Render below the next step text. Format: same date rules as Concept 3 — "Today", "Yesterday", "Jun 3", or "Jun 3, 2024" if prior year. Size: `--font-size-small`. Color: `--color-text-secondary`. Right-aligned within the body zone.

The date is the rep's urgency signal — "who haven't I called in two weeks?" — and is the most important piece of metadata for prioritizing the work queue. Spotio and Pipedrive both surface recency on list cards for this reason.

---

### 4. Mobile: "Log call" button is full-width

**Low-fi spec stated full-width on mobile** but the implementation renders a narrow right-aligned `size="sm"` button at all breakpoints.
**High-fi:** Full-width in the card footer on mobile; right-aligned outline on desktop. No change to desktop behavior.

Per Spotio's 3-tap methodology and the design standard's thumb-zone reachability rules, a narrow bottom-right button is the hardest zone to hit one-handed. Full-width is the required mobile treatment.

---

## What's New

### 5. Account count in the page header

Render a muted count beside the H1 — e.g., "What's Next · 12" — using `--font-size-body`, `--color-text-secondary`, positioned inline after the title.

Gives the rep an immediate workload read without any interaction. Borrowed from Ambition's dashboard density pattern and LevelEleven's "am I ahead or behind?" at-a-glance philosophy. No user-controlled sort or filter in v1 — the count is informational only.

---

### 6. On Air live indicator dot

A small `●` dot in `--color-accent-primary` beside the page title marks the What's Next list as the rep's live work queue.

The sidebar nav already uses a `●` marker on the active item (per the wireframes). Carrying that visual language into the page title reinforces the "On Air" metaphor — this list is the broadcast happening right now. Pure presentation, no behavior attached.

---

## Component Behaviors (updated full spec)

**Page title**
- "What's Next" — H1 weight
- Followed inline by `●` in `--color-accent-primary` and a muted account count in `--font-size-body`, `--color-text-secondary`

**Business cards**
- Standard card style (`--spacing-md` padding)
- Clickable: the full card body (excluding the "Log call" button) is a tap target
- Hover state: `--color-surface-subtle` background

**Business name**
- H3 weight, single line, truncates with ellipsis on overflow

**Stage badge**
- Display-only — tapping does nothing; no chevron
- Same dot + label pill style as the existing `BusinessCard` component

**Next step text**
- `--color-text-primary`, `--font-size-body`, 2-line clamp with ellipsis
- Left-border accent: 2–3px `oklch(from var(--color-accent-primary) l c h / 40%)` with `--spacing-sm` left-padding

**Last contact date**
- `--font-size-small`, `--color-text-secondary`, right-aligned
- Format: "Today" / "Yesterday" / "Jun 3" / "Jun 3, 2024"
- Rendered below next step text, within the card body

**"Log call" button**
- Desktop: secondary tier (`outline`), right-aligned in card footer
- Mobile: secondary tier (`outline`), full-width in card footer
- Opens QuickLog pre-filled with this business; does not navigate away from the list

**Sort order**
- Most recently contacted first; no call history yet → bottom, alphabetical
- No user-controlled sort in v1

**No filtering or grouping in v1** — flat list only

---

## Empty State

No change from low-fi spec.

- Icon: checklist or task icon
- Headline: "No accounts yet"
- Body: "Log a call to start building your book."
- CTA: primary tier "Log a call" — opens QuickLog

---

## Navigation Summary

No change from low-fi spec.

**Into the What's Next list:**
- "What's Next" nav item in sidebar (desktop) or tab bar (mobile)

**From the What's Next list:**
- Tapping a card body → Business View overlay opens over the list (Concept 1)
- "Log call" on a card → QuickLog opens as modal/bottom sheet over the list; list stays behind it
- Quick Log nav item / center tab → QuickLog opens; list stays behind it

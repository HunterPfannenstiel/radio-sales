# Navigation

Standards for the navigation shell — sidebar anatomy, bottom tab bar, and context-switching rules. Layout breakpoints belong in [layout.md](layout.md). Spacing scale belongs in [spacing.md](spacing.md).

---

## Desktop: Left Sidebar

The primary navigation on desktop is a persistent left sidebar.

**Anatomy (top to bottom):**
1. Product logo / wordmark
2. Primary nav items (icon + label)
3. Spacer — pushes secondary items to the bottom
4. Secondary nav items (settings, profile, help)

**Rules:**
- The sidebar is always visible on desktop — it does not collapse into a hamburger
- Active nav item uses `--color-accent-primary` for the icon and label, with a filled background indicator
- Inactive items use `--color-text-secondary`
- Nav labels are always visible — icon-only sidebar is not permitted
- The quick-log action is pinned as the first primary nav item

---

## Mobile: Bottom Tab Bar

The primary navigation on mobile is a bottom tab bar fixed to the screen bottom.

**Rules:**
- Maximum 5 tabs
- Each tab shows an icon + a short label (2 words max)
- Active tab uses `--color-accent-primary` icon and label
- Inactive tabs use `--color-text-secondary`
- Quick-log is always the center tab — reachable with one tap regardless of current view
- Tab bar extends edge-to-edge and respects device safe areas (see [layout.md](layout.md))

---

## Context-Switching Rules

Secondary content opens in different containers depending on what the user needs to preserve behind it:

| Scenario | Pattern |
|---|---|
| Viewing a detail record (opportunity, rep, account history) | **Slide-over panel** — enters from the right edge, keeps parent list or dashboard visible |
| Short form, confirmation, or alert | **Centered modal** — full focus; background dimmed and non-interactive |
| Multi-step setup or full-page workflow | **Full-page view** — replaces the current view entirely |
| Quick-action form triggered from a tab bar or FAB (mobile) | **Bottom sheet** — slides up from screen bottom, current view preserved and dimmed behind it |

**Rule:** Never use a modal where a slide-over would preserve useful parent context. Never use a slide-over for a confirmation — the blocking behavior of a modal is intentional for safety.

---

## Mobile: Bottom Sheet

The bottom sheet is a mobile-specific variant of the centered modal. Use it when a form is triggered by an action button (center tab, FAB) rather than tapping a record — the visible context behind the sheet signals to the user that the action is lightweight and reversible.

**When to use:**
- Action-triggered forms on mobile (quick-log, compose, quick-add)
- Same field count guidance as a centered modal — up to ~8 fields with internal scrolling
- Never for destructive confirmations — those stay as centered modals (blocking behavior is intentional)

**Anatomy (top to bottom):**
1. Drag handle — centered at top; visual affordance for swipe-to-dismiss
2. Sheet header — Cancel button left, title centered (H1 weight)
3. Scrollable content area — form fields
4. Primary action button — pinned to sheet bottom, above safe area inset

**Height:** ~85% of viewport — intentionally reveals the current view behind it; full-height is a full-page view, not a bottom sheet

**Background:** Dimmed and non-interactive — same treatment as centered modal

**Dismissal:**
- Swipe down on drag handle or sheet content
- Tap dimmed background
- Explicit Cancel button in sheet header

**Safe area:** Action button and sheet edge respect the bottom safe area inset

---

## Quick-Log Accessibility

On any screen, the rep must be able to open the quick-log form in one tap (mobile) or one click (desktop). This is non-negotiable — it is the north star interaction of the product.

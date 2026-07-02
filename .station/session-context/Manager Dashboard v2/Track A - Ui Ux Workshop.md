Good to have you here. Full presentational spec below — component-level, no code, since that's my lane. A few of these aren't in your currently installed component list (I saw it via the shadcn skill): you'll need to `add` **Table**, **Badge**, **Progress**, **Avatar**, and **Empty** — everything else (Card, Select, Skeleton, Separator) is already in.

## Screen 1 — Rep Roster (`/dashboard` or wherever this lands)

**Header row**: page title, left-aligned. `Select` for month on the right, same row, defaulted to current month. On mobile these can stack if width forces it, but try the single row first.

**Body — two responsive layouts, not one component doing double duty:**

*Mobile (default, <768px-ish, match your existing breakpoint if the codebase has one)*: vertical stack of `Card`s, `flex flex-col gap-3`. Each Card is a single tap target (wrap the whole Card in the Link/nav element, not just a button inside it). Card internals:
- Top row: `Avatar` (size-10, initials fallback) + rep name, `flex` with `gap-2`, `items-center`. Pace `Badge` pinned to the far right of this same row (`justify-between` on the row).
- Below that: two-stat readout, `flex` row with `gap-6`. Each stat is a mini vertical stack — small `text-muted-foreground` label ("Sold" / "Projected"), large number below it. Don't use `CardHeader`/`CardContent` split for this — it's dense enough to just live in one `CardContent` block.
- A slim `Progress` bar under the Sold % stat only, full width, height stays small (the default Progress height, don't inflate it).

*Desktop (≥768px-ish)*: swap the Card stack for a `Table`. Columns: Rep (with Avatar inline in the cell), Sold %, Projected %, Pace (`Badge`). Whole `TableRow` is clickable (cursor-pointer, hover:bg-muted/50 or whatever the Table's built-in hover state gives you for free — don't hand-roll it). No `TableCaption`, no footer — just header + body rows.

Use one shared breakpoint variable for the swap, don't let mobile/desktop drift independently.

**Sort**: rows/cards pre-sorted worst-pace-first, server/data-layer concern not yours — you're just rendering whatever order the data arrives in. No sort control in the UI at all, mobile or desktop, per what we landed on in the workshop.

**Loading state**: `Skeleton` placeholders matching the shape of whichever layout is active — for cards, a Skeleton block roughly Card-height ×15; for table, Skeleton rows inside the Table structure (keep the real `TableHeader` visible, skeleton just the body rows).

**Empty state**: shouldn't realistically happen (~15 reps always present), but if the data layer ever returns zero reps, use the `Empty` component rather than a blank page — don't build a custom empty div.

## Screen 2 — Drill-Down (full page navigation, not a Sheet/Dialog)

**Header block**: `Avatar` (bump to size-12 or size-14, this is now the page subject) + rep name as the page heading, pace `Badge` next to the name (carry-over from roster for continuity — same variant/color mapping). Below or beside that, the dollar stat pair — $Sold and $Projected, same visual treatment as the % stats on roster (label-over-number), now with real currency values since dollars unlock at this level.

Add a `Separator` between this header block and the metrics grid below — clean break between "who/status" and "why."

**Metrics grid**: four `Card`s in a CSS grid — `grid-cols-2` on mobile, `grid-cols-4` on desktop, `gap-4` throughout. Order: activity pace, asks, closing ratio, average account value (matches the brief's order — don't re-sort these, they're a fixed diagnostic set, not a ranked list).

Each metric Card is itself a nav target (tappable → its own detail screen), so:
- Give it an affordance that reads as "tappable," not just "informational" — a small chevron icon (`ChevronRight`, top-right or bottom-right corner of the Card, muted color) is enough. Don't add a full Button — the whole Card is the hit target, same pattern as the roster Cards.
- Card content: label on top (small, muted), the metric value large below it. Keep every Card in the grid the same internal structure so the 2×2/4-across grid reads as a uniform set, not four different widgets bolted together.

**Asks is the one Card with a target**: add a `Progress` bar under its number, same slim treatment as the Sold % progress on the roster. The other three Cards (activity pace, closing ratio, avg account value) get no Progress bar — just the number, since there's no target to fill toward. If you want a lightweight "vs. team average" signal on those, a small `Badge` (outline variant, not colored) works — but that's optional polish, not load-bearing.

**No edit affordances anywhere on this screen** — no pencil icons, no inline-edit hover states, nothing. This is confirmed intentional (managers are read-only here), not an oversight to fix.

## Badge color mapping (pace signal, used on both screens)

Three states, and since shadcn's default Badge variants (`default`/`secondary`/`destructive`/`outline`) don't map cleanly to a 3-state semantic system, you'll want custom variant classes using semantic tokens — not raw Tailwind colors like `bg-green-500`. Something like a success/warning/destructive token trio if the project's theme defines them; if it doesn't yet, that's a theming task, not something to solve by inlining raw hex/color-name classes on the Badge itself.

- **On Pace** → success/green treatment
- **Watch** → warning/amber treatment
- **Behind** → destructive/red treatment (the one variant that already exists off-the-shelf)

Exact percentage cutoffs that drive which state shows are a data/business-logic concern, not presentational — treat the state as a prop the component receives, already resolved.

## One open item I want on your radar, not blocking you

The four metric Cards in drill-down link out to detail screens we haven't designed yet. Build them as real nav targets (so the information architecture is correct), but the destination screens themselves need their own workshop pass before you build their content — don't invent that layout unilaterally. Flag it back to us when you get there.
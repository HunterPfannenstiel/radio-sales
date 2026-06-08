# Onboarding & Zero-Data States

Standards for empty states, first-run experiences, and the rules governing zero-data layouts. Empty state component anatomy (the actual component structure) belongs in [components.md](components.md).

---

## Rule: Never a Bare Empty State

Every empty table, list, card, or dashboard panel must display a structured empty state. A bare empty container, "No results found," or an unformatted placeholder is not acceptable.

---

## Empty State Rules

Each empty state must answer three questions for the user:
1. **What is missing?** (Headline)
2. **Why is it missing?** (One sentence of context)
3. **What should I do?** (Single CTA)

The CTA links to either the action that creates the first record or the relevant knowledge base article for that feature — never the help center homepage.

For the empty state component structure (icon, headline, body, CTA layout), see [components.md](components.md).

---

## Microcopy Tone

Empty state copy speaks directly to the rep, not about the system.

**Good:** *"Log your first call to start tracking your pace."*
**Bad:** *"No activity records have been created for this user."*

Language is always second-person ("you", "your") and action-oriented.

---

## Admin First-Run

A setup progress checklist widget appears in the lower-right corner on an admin's first login. It persists and tracks completion until all critical setup steps are done.

Minimum checklist items:
- Reps added and accounts configured
- Activity targets set per rep
- Sales goals set per rep
- Any required data imported

The checklist collapses to a small indicator once all steps are complete and does not reappear.

---

## Rep First-Run

On a rep's first visit to the quick-log screen, a brief tutorial overlay walks through the three-step log flow. It is dismissible after step 1 — reps who already understand the form should not be blocked by it.

After dismissal, the empty state on the log screen includes a "Show me how" link that reopens the tutorial on demand.

---

## Zero-Data Dashboard Panels

Dashboard gauges and stat cards that have no data yet show a neutral placeholder state — not a zero value that implies the rep is behind. A gauge at zero when no calls have been logged reads as failure; the zero-data state should communicate "set up required" instead.

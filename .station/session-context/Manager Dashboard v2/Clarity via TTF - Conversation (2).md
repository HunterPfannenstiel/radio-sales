Here's the full Track B (Manager Goal & Activity Target Setup) context, consolidated from the client's feature doc and the clarity session already run with the user:

## Source feature doc — what the client actually asked for

- A manager sets, per rep: a **monthly sales goal**, an **annual sales goal**, and two weekly activity targets — **calls per week** and **asks per week**.
- Goals are set "in consultation with the rep," but the **rep cannot edit them** in the system — manager owns the values, rep is view-only.
- Pacing assumes a **Monday–Friday work week**; weekly activity is tracked by week number across the year.
- Manager can change any value **at any time**, including mid-month or mid-week. When changed, the system recalculates percent-to-goal / pacing for the **current period immediately** — there is no historical audit trail of past goal values, only current truth.
- **No notifications** are sent when goals/targets change (product is check-the-dashboard, not alert-driven).
- Each rep belongs to **one manager at a time**; if a rep changes managers, the new current manager owns goal-setting going forward.

## Decisions already locked in this clarity session

- **Annual goal is dropped from this round entirely** — do not design/build UI for it. Only monthly goal + weekly calls + weekly asks are in scope.
- **Entry point**: a **dedicated standalone page**, separate from the dashboard/drill-down (Track A). Not a modal, not embedded in a rep's drill-down view.
- **Platform**: mobile-first, but must also work on desktop — responsive, not mobile-only.
- **Scale**: design for ~15 reps per manager. No pagination/search/filtering concerns for this demo.
- **Design system**: intentionally left open — demos of these features already exist elsewhere, but this effort is testing a new AI-driven workflow from scratch. Don't assume it must match anything existing; treat visual direction as a live topic for the workshop itself, not pre-decided.

## Operating philosophy for the workshop (per the TTF approach this project follows)

- This is a **demo build with mocked data** — the goal is something the client can react to, not a production-ready spec.
- Where the client hasn't specified a detail (exact layout, validation rules, empty states, etc.), **make a fast, reasonable call and move on** rather than stalling on it.
- The user (developer) has **no deep domain knowledge** of radio sales themselves — they're relaying the client's intent, not substituting their own judgment for it. Don't expect them to resolve domain questions; expect them to make product/workflow calls.
- If something comes up that's a genuine fork (would change what gets built, not just cosmetic), ask directly rather than guessing — that's the whole point of this session.

Let me know if you want me to flag anything Track A-specific that might bleed into this conversation (e.g., how goal values feed the dashboard's pace/percent-to-goal calculations) — happy to hand that over too if it comes up.
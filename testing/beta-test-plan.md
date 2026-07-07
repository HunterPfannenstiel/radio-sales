# Beta Test Plan — Rep Flows

Handoff for implementing agents. Read [`index.md`](./index.md) and the per-layer
docs ([`unit`](./unit.md), [`integration`](./integration.md), [`e2e`](./e2e.md))
**first** — every test below is written as a _claim_ per those rules, and you are
expected to honor them (the name carries the concrete input→output; the body is
redundant with the name; note what each test does _not_ prove).

This plan is intentionally **curated, not exhaustive**. The beta is **rep-only** —
manager, executive, and `manager-goal-setting` surfaces are explicitly out of
scope. Everything here traces to one of three flows the business cares about:

- **Flow A** — a rep logs a call and it is reflected in their goals (dashboard pace).
- **Flow B** — a rep sees a business appear after logging a call to it.
- **Flow C** — a rep sees a business's current status and its interaction history.

---

## 0. Read this first — testability groundwork (already landed)

Two prerequisites and one bug from the original review **have been fixed** on this
branch. They change what your tests should target; read them before writing.

### 0.1 `DashboardQuery` now takes an injected `now` — DONE

`DashboardQueryParams` now carries a required `now: Date`; the query no longer
reads a hidden `new Date()`. `app/api/dashboard/route.ts` passes `now: new Date()`.
Pace-status math is therefore deterministic: pass a fixed `now` and assert
`ahead`/`on_pace`/`behind`/`missed`/`goal_reached` directly — no fake timers
needed. (Money amounts and raw call/ask counts were already deterministic.)

### 0.2 Pace math extracted into pure functions — DONE

The proration / confidence-weighting / deal-span / status logic now lives in three
exported pure functions in `DashboardQuery.ts`, each taking seeded logs + a fixed
`now`, no I/O:

- `computeMoneyPace(logs, { year, month, goalAmount, now, timezone }) → MoneyPaceDTO`
- `computeActivityPace(logs, { weekYear, weekNumber, weeklyCallTarget, weeklyAskTarget, now, timezone }) → { calls, asks, daysRemainingInWeek }`
- `computeWeeklyPresentTarget({ goalAmount, soldAmount, year, month, now, timezone }) → number`

These are the §1 unit targets — a reader verifies each output by hand from the
seeded logs. `BlobDashboardQuery.execute` now just reads the store and delegates.

### 0.3 Interaction-history outcome mapping — FIXED

`BusinessInteractionHistoryQuery` now maps the stored `CallOutcome`
(`yes`/`no`/`pending`) to the timeline's display vocabulary
(`sold`/`not_sold`/`follow_up`), and collapses a missing outcome to `follow_up`.
The DTO field is now the exported `InteractionOutcome` union (required, never
undefined), which matches what `InteractionHistory.tsx` already expected. Write
§1.5 to assert the **corrected** mapping (`yes → sold`, `no → not_sold`,
`pending → follow_up`, absent → `follow_up`).

---

## 1. Unit tests — pure mechanisms with concrete numbers

These target logic complex enough that permutation coverage is cheaper and
sharper one layer below integration. Target the exported pure functions from
§0.2 directly (import from `@/server/queries/DashboardQuery`), passing seeded
logs and a fixed `now` — no blob, no fake timers.

### 1.1 Money pace — `computeMoneyPace` (Flow A) — highest value

The engine behind "logging calls is reflected in goals." One claim per case,
concrete values in the name:

- **`$12,000 budget / 12-month term, outcome=yes, logged Jul 2026 → Jul 2026 shows $1,000 sold, $950 projected`**
  (monthlyValue = 12000/12 = 1000; sold adds 1000; projected adds 1000 × 0.95).
- **`same $12k/12mo sold deal → also $1,000 sold in Dec 2026, $0 sold in Jul 2027`**
  (proves the deal-span window: `[dealStartMonth, dealStartMonth + termMonths)`).
- **`52-week term == 12-month term: $12,000 / 52 weeks → $1,000/mo`**
  (proves the `weeks × 12/52` conversion; redundant-by-hand: 52 × 12/52 = 12).
- **`$6,000 / 6-month ask, no outcome, confidence=sure → $0 sold, $800 projected`**
  (monthlyValue 1000 × 0.8 weight; proves projected-only path for open asks).
- **`confidence weights on an open $1,000/mo ask (no outcome): sure=0.8 → $800, expect=0.4 → $400, hope=0.1 → $100 projected`**
  (one named case per weight is fine; the claim _is_ the table). **Do not add an
  `in`(0.95) case here** — in the app `confidence: "in"` always co-occurs with
  `outcome: "yes"` (the form forces it), which routes through the sold branch, not
  this projected-weight branch. A synthetic `{confidence:"in", outcome:absent}`
  log can't happen in real data (`unit.md` rule 6); the 0.95 factor is already
  covered by the `outcome=yes → ×0.95 projected` case above.
- **`outcome=no on a $6k/6mo ask → contributes $0 sold and $0 projected`**
  (proves "no" is excluded from both, not just from sold).
- **`budget with no term (termValue absent) → excluded entirely`**
  (guard clause; a real rep can log a call with neither).

Status cases (pass a fixed `now` on a mid-month weekday so
`workingDaysElapsed/totalWorkingDays` is a known fraction):

- **`goal $15,000, half the working month elapsed, $8,000 sold → "ahead"`**
  (expected = 15000 × 0.5 = 7500; sold ≥ expected).
- **`goal $15,000, half elapsed, $3,000 sold but $8,000 projected → "on_pace"`**.
- **`goal $15,000, half elapsed, $3,000 sold, $5,000 projected → "behind"`**.
- **`goal $15,000, $15,000 sold → "goal_reached"` (regardless of date)**.
- **`goal $15,000 in a fully-past month, $3,000 sold → "missed"`**.
- **`goalAmount = 0 → paceStatus "behind", soldPercent 0`** (no-goal guard).

_Not covered by these:_ that the numbers reach the screen (that's §2.1 / §3),
and that the DTO is wired into the route (integration).

### 1.2 Activity pace — calls & asks (Flow A)

- **`3 logs Mon–Fri of the target ISO week, 1 carrying a budget → calls=3, asks=1`**
  (asks = logs with a budget; calls = all logs that week).
- **`a log dated the Sunday before the ISO week → excluded from that week's count`**
  (proves the Mon–Fri ISO-week boundary, not a rolling 7 days).
- **`weeklyCallTarget 40, 40 logged → "goal_reached"; 39 logged mid-week below pace → "behind"`**
  (pass a fixed mid-week `now`).

`computeWeeklyPresentTarget` is also a pure function now (drives the "Present
$X/wk to hit your goal" nudge). Low-priority but cheap if the owner wants it —
e.g. **`$15k goal, $5k sold, 2 working weeks left → ceil(10000/2) = $5,000/wk`**
(fixed `now`). Otherwise call it explicitly out of scope; don't leave it
ambiguous.

### 1.3 Recent-businesses ordering — `RecentBusinessesQuery` logic (Flow B)

- **`log A, then B, then A again → recent = [A, B]` (most-recent-contact first, A deduped to one entry)**
  (proves MRU sort by `loggedAt` desc + dedup by `businessId`; verifiable by hand
  from three timestamps).
- **`a callLog whose businessId is missing from businesses[] → dropped, no crash`**
  (the `.filter(NonNullable)` guard).

### 1.4 What's-Next derivation — `WhatsNextQuery` logic (Flow C)

- **`business with latest log stage=present, whatNext=send_proposal, no manual next-step → card shows stage "present", next step "Send proposal"`**
  (stage + label come from the newest log).
- **`manual nextStep edited AT a time after the latest log → card shows the manual text, not the log's label`**
  (proves the `nextStepUpdatedAt > loggedAt` precedence).
- **`then a newer call is logged → card reverts to the new log's next-step label`**
  (precedence flips back when a call out-dates the manual edit).
- **`a business with zero logs → omitted from the list entirely`**.
- **`two businesses contacted, newer first; a never-contacted one sorts last`**
  (sort rule).

### 1.5 Interaction-history shaping — `BusinessInteractionHistoryQuery` (Flow C)

- **`two logs for one business → returned newest-first`**.
- **`log with budget 6000, termValue 3, termUnit months, confidence sure → ask = {amount:6000, term:"3 months", confidence:"sure"}`**.
- **`whatNext "send_proposal" → nextStep "Send proposal"` (label mapping)**.
- **`stored outcome yes/no/pending → sold/not_sold/follow_up; absent outcome → follow_up`**
  (the §0.3 mapping — assert the corrected display values, one case each).

### 1.6 Small, user-facing formatters (optional, low cost)

`formatLastContact` / `formatEntryDate` (`Today` / `Yesterday` / `Jun 3` /
`Jun 3, 2024`). Genuinely user-visible in Flow C, cheap, no infra. Include only
if the owner wants the coverage — freeze the clock so "Today" is stable.

---

## 2. Integration tests — emergence across mutation → storage → query

Real slice: a real mutation writes the real `LocalBlobStore`, a real query reads
it back. A failure here should require _two_ pieces to explain (write path +
read path), or it belonged in §1. Follow the existing convention:
`*.integration.test.ts`, `beforeEach(() => blob.wipe())` (see
`server/mutations/LoginMutation.integration.test.ts`).

> **Honesty note to carry in the files:** vitest runs against `LocalBlobStore`,
> which is a _different implementation_ than the `SupabaseBlobStore` used in
> deployed environments (`lib/blob/index.ts` switches on `USE_LOCAL_BLOB`). Per
> `e2e.md` §"axis you're allowed to vary is location, not implementation," these
> tests prove the **query/mutation logic**, not that Supabase
> serialization/paths work. Only §4 (e2e on a preview) exercises the real
> Supabase path. State this in the suite header so no one over-reads the green.

### 2.1 Flow A — a logged call moves the dashboard

- **`log one call this week with a $6,000/6-month ask marked sold, then read the dashboard for this month → soldAmount $1,000, calls=1, asks=1`**
  (`LogCallMutation` → `DashboardQuery`, the whole "reflected in goals" claim end
  to end below the UI). Pass `loggedAt` explicitly into the mutation and freeze
  the dashboard clock so the month/week align — the API route does **not** accept
  `loggedAt` (it always uses now), so this is the layer that can pin the date.
- **`log a call with no ask → calls increments, asks does not`**.

### 2.2 Flow B — a call makes a business discoverable, exactly once

- **`log a call to a brand-new "Acme Radio" → it appears in recent-businesses, search(""), and what's-next`**
  (new-business creation path fans out to all three read surfaces).
- **`log twice to "acme radio" then "Acme Radio" (different case) → one business, two call logs`**
  (case-insensitive name resolution in `LogCallMutation`; proves no duplicate
  business is minted).
- **`log with an explicit businessId that exists → reuses it, mints nothing`**.

### 2.3 Flow C — status and history round-trip; edits take effect

- **`log approach→uncover→present across three calls → history returns all three newest-first with correct stages/next-steps`**
  (`LogCallMutation` ×3 → `BusinessInteractionHistoryQuery`).
- **`PATCH stage to "close" on a business with logs → what's-next now shows "Close"`**
  (`UpdateBusinessStageMutation` mutates the latest log's stage → `WhatsNextQuery`
  reads it back).
- **`PATCH stage on a business with zero call logs → mutation throws / route 500s`**
  (documents the "No call log found" branch — a rep can't currently reach it via
  UI, but the mutation contract is real; keep it so a future caller learns the
  precondition).
- **`edit next-step, then log a newer call → what's-next reflects the newer call's step`**
  (the precedence emergence from §1.4, now proven through the real write paths).

_Not covered by §2:_ auth/session (cookie) behavior and anything a browser does —
those are §4. HTTP-status/zod-validation of the routes is thin plumbing; cover it
only if the owner wants route-level contract tests (low value vs. the above).

---

## 3. Where NOT to add tests (deliberately)

- **Presentational components** (`MoneyPaceCard`, `ActivityCard`, card layouts):
  their logic is styling. The numbers they display are already proven in §1 and
  their appearance is observed once in §4. A React-render unit test here buys
  brittle DOM assertions, not confidence.
- **Manager / executive / goal-setting-by-manager** surfaces — out of beta scope.
- **`hooks/useFetch`, `useRequest`, `cn`** — generic plumbing; `cn` already has
  its one worthwhile test. Don't permutation-test the fetch hooks.
- **`CallActivityQuery` ("N calls logged today") and timezone/DST edge cases** —
  deliberately omitted from the beta set. The "today"/week math is covered
  structurally by §1.1/§1.2 with a fixed `now`; exhaustive timezone-boundary
  coverage isn't worth the cost for beta. Revisit if reps report wrong day/week
  counts in the field.

---

## 4. E2E — golden journeys that live forever

Per `e2e.md`: E2E is a small curated set, runs against a **deployed preview
(itg)** with real Supabase, uses a **unique synthetic rep identity per run**
(`e2e-...-${Date.now()}`), and asserts via **semantic locators first,
`data-testid` as the explicit fallback**. There is already one golden journey
(`e2e/first-time-signup.spec.ts`: first login → goals → dashboard). Add **one**
more — the rep's core daily loop, covering Flows A + B + C in a single protected
journey:

**`a rep logs a call to a new business, then sees it drive the dashboard, appear in What's Next, and carry its history`**

1. Log in as a fresh synthetic rep and set goals (reuse the existing pattern) —
   needed so the dashboard has a goal to prorate against.
2. Open Quick Log; enter a unique business name, stage **Present**, what's-next
   **Send proposal**, budget **6000**, term **6 months**, outcome **Yes**; submit.
3. **Flow A:** on the dashboard, assert **calls = 1** and **asks = 1** (scoped by
   the existing `calls-card` / `asks-card` testids) and **SOLD = $1,000**
   (`money-pace-sold-value`). _Do not assert a pace **status**_ — it drifts with
   the real calendar (§0.1); amounts and counts are deterministic.
4. **Flow B:** navigate to What's Next; assert the new business card is present
   with stage **Present**.
5. **Flow C:** open the business; assert the interaction-history entry is shown
   (date, stage, the $6,000 ask) and that the outcome reads **"Sold"** (the §0.3
   mapping is fixed — a blank here is now a regression).
6. Change the stage to **Close**; reopen (or reload) and assert it persisted —
   proving the real Supabase write path, which no integration test covers.

New `data-testid`s you will likely need to add to source (make them grep-able
contracts, per `e2e.md`): the What's Next card + its stage badge, and the
history entry's outcome/ask. Add them to the JSX deliberately; don't reach for
structural or text selectors.

_Not covered by E2E:_ the numeric permutations of pace math (§1), business-
resolution edge cases (§2) — E2E proves the journey is walkable and the real
persistence path works, nothing finer-grained.

---

## 5. Suggested order of work

The §0 groundwork (clock injection, pure functions, outcome mapping) is already
landed — start straight at the tests:

1. **§1 unit tests** — biggest confidence-per-line; money pace first.
2. **§2 integration tests** — the three-flow emergence.
3. **§4 e2e** — one new journey; wire `data-testid`s as you go.

**File placement:** colocate each test next to its source, matching the existing
two — `lib/utils.unit.test.ts`, `server/mutations/LoginMutation.integration.test.ts`.
So `computeMoneyPace` tests → `server/queries/DashboardQuery.unit.test.ts`; the
LogCall→Dashboard emergence → `server/queries/DashboardQuery.integration.test.ts`
(or next to the mutation). E2E specs live in `e2e/*.spec.ts`.

CI already runs `test:unit` (`*.unit.test.ts`), `test:integration`
(`*.integration.test.ts`), and `test:e2e` (PRs into `main`, against
`INTEGRATION_URL`). New files following those name suffixes are picked up
automatically — no CI edits needed.

> Note: the CI `integration-tests` job spins up a Postgres service, but the app
> has no Postgres — persistence is the blob store, and vitest points at
> `LocalBlobStore`. The Postgres service is currently unused; flag it to the
> owner (harmless, but misleading).

---

## 6. Open decisions for the owner

The two structural decisions from the original review are **resolved and landed**
(§0.1/§0.2 clock injection + pure-function extraction; §0.3 outcome mapping). What
remains is scope:

1. **Formatters (§1.6) and route-contract tests (§2 tail):** in or out for beta?
2. **CI Postgres service (§5 note):** remove the unused `postgres` service from the
   `integration-tests` job, or leave it? (Left as-is per the owner's call.)

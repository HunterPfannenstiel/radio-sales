# Integration Testing

Read [index.md](./index.md) first for the general principles this builds on.

## The claim is about emergence, not mechanism

An integration test proves that multiple real pieces, wired together, produce
correct behavior — not that any single piece's internal logic is correct
(that's already [unit testing's](./unit.md) job). If a failing integration
test can be diagnosed and fixed by looking at one function in isolation, it
was testing a mechanism wearing an integration test's clothes — it belongs
one layer down.

## The axis you're allowed to vary is location, not implementation

A real Postgres instance running in Docker, accessed through the exact
repository/service code that runs in production, is a fully legitimate
integration test target — you're proving your internals are correct
(queries, transactions, constraint handling, serialization), not proving
anything about a specific deployed database. What's not legitimate is a
substitute that reimplements the same interface with different internals — an
in-memory object standing in for a repository proves your code _calls_ the
interface correctly, but nothing about whether the interface's real behavior
is correct, which is the entire point of an integration test. If honoring
this requires real infrastructure (a container, migrations, seed scripts),
that's the actual cost of an honest integration test, not a reason to reach
for a fake instead.

## No browser, no navigation

Integration stops at the boundary of the UI. If the test is clicking buttons
or reading rendered HTML, it's drifted into [E2E](./e2e.md) territory and is
probably paying E2E's cost for coverage E2E already gives you. Integration
proves the pieces work together; E2E proves a human can actually use the
result.

## The claim is still the name — now describing emergence

Same discipline as unit tests: the name should be a concrete scenario, not a
category. But now it's a scenario across multiple pieces rather than one
computation — "3-way tie at 1st, 3-way tie at 4th → correct final
leaderboard" is an integration claim about the whole pipeline; "predicted HAM
2nd, finished 3rd → 7pts" is the unit claim living one layer beneath it.

## Data setup is part of the claim

What you seed has to be realistic enough to actually exercise the wiring
you're claiming works — not just enough to make an assertion pass. Keep it
fast and disposable; a stable, persistent environment is E2E's territory, not
integration's — the extra cost of a stable environment buys you deployed code
and a real browser, neither of which integration needs. Since integration
tests spin up ephemeral persistence (a fresh container with nothing in it),
seed scripts are integration's natural tool — there's no other way to give a
disposable environment something to test against.

## Where integration ends

Don't chase E2E-level confidence by integration-testing UI-adjacent behavior.
If the claim requires a real browser, real routing, or real session/cookie
handling across a fresh page load — that's E2E's job, not integration's.

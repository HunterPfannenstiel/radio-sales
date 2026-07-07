# Unit Testing

Read [index.md](./index.md) first for the general principles this builds on.

## The claim is the name

Part A says every test needs an explicit claim. For unit tests, that claim
isn't a comment bolted on top — it _is_ the test's name, and the body must let
a reader verify the claim from the data alone, with no knowledge of the
implementation. "predicted HAM 2nd, finished 3rd → 7pts" is a claim. "off by
1" is a category — categories don't tell you whether the test is actually
correct.

## Principles

1. **The name carries concrete inputs and outputs, not a category label.**
2. **The data in the body is redundant with the name** — a reader should be
   able to check the assertion by hand.
3. **One claim per test.** A test asserting two different scenarios proves
   neither reliably: if it fails you don't know which claim broke, if it
   passes you don't know both are true.
4. **Concrete values over abstraction** (`180`, not `10 * SCORING_DEPTH`) —
   abstraction hides the exact thing a reader needs to verify. Reach for a
   helper only when spelling every value out would bury the point.
5. **A comment above the test sets human context**; it never restates what
   the assertion already says.
6. **Test scenarios that could actually happen.** Convenient-but-unrealistic
   data can pass while proving nothing.
7. **No hidden shared constants** — if understanding the test means
   scrolling elsewhere, inline it.

## North star

A non-technical reader should be able to read a unit test, understand the
claim, and verify it's true from the data alone.

## Where unit testing ends

A unit test proves one mechanism is correct, not that a system built from
many mechanisms is correct. The temptation is to chase integration-level
confidence by unit-testing every permutation of interacting mechanisms —
that's how suites go brittle and break on every refactor without protecting
anything real. If the mechanism is correct, trust it generalizes; permutation
coverage across mechanisms is [integration testing's](./integration.md) job.

# E2E Testing

Read [index.md](./index.md) first for the general principles this builds on.

## Not every feature earns an E2E test

E2E is the most expensive layer, so it isn't a per-feature or per-release
checkbox — it's a small, deliberately curated set of golden-path journeys
(login, first-time onboarding, whatever is core to the business) that are
expected to live indefinitely and get updated as the app evolves, not
retired once the release ships. Verifying that *this release's* feature
works is an [integration](./integration.md) or [unit](./unit.md) test's
job. Only promote something to E2E when it represents a new journey worth
protecting forever, not just a claim worth proving once.

## E2E runs on itg, not prod

Once a behavior is proven correct on itg — same deployed code, same real
persistence code path — the only thing left that could differ on prod is
connectivity or configuration, a narrower and cheaper problem than "does this
feature work," already covered by health checks and smoke tests. A full
browser flow against prod to catch a misconfigured environment variable is
the wrong tool for that job.

## Prod gets smoke tests, and they don't get to leave a mess

Whatever runs against prod must be non-mutating, or scoped to an explicitly
designated canary identity excluded from real reporting and dashboards. A
smoke test that quietly writes fake progress into a real rep's numbers has
done more damage than the bug it was trying to catch.

## itg is stable, so test identity is your responsibility

Because itg persists state across runs instead of resetting, any test that
creates data needs an explicit identity strategy or it will eventually
collide with itself or with manual testing. Prefer a unique synthetic
identity per run over a test-only reset/delete path — fewer moving parts, no
extra surface living in the app purely to serve tests.

## E2E works with prod-derived data, not seed scripts

Seed scripts exist to give a disposable environment something to test
against — that's [integration tests'](./integration.md) job, populating a
fresh container from nothing every run. itg is stable, not disposable, so its
baseline data should be real data pulled from production, not a fixture
re-fought into existence on every run. This is about data a test _reads_
against, not data a test _creates_ — a test still mints its own synthetic
identity for anything it writes, per the point above.

## The axis you're allowed to vary is location, not implementation

Same rule as integration tests. A local persistence backend only counts as
"tested persistence" if it's the same storage-client code path as
production, just pointed locally. Verify that in the code before trusting
it; don't assume it from an environment variable's name.

## Locators: semantic first, data-testid as an explicit fallback

Prefer `getByRole`/`getByLabel` — they double as an accessibility check, since
an element a test can't find by role or label is usually one a screen reader
user can't find either. When no natural semantic role fits (a stat value, a
card container), reach for `data-testid` rather than text-matching or DOM
structure (`nth-child`, `xpath` sibling traversal, filtering anonymous `div`s
by their text content). Structural selectors encode an assumption about the
DOM that lives nowhere in the source — when they break, there's no trace of
why. A `data-testid` sitting in the component's JSX is a visible, grep-able
contract: it tells the next person touching that element "a test depends on
this exact node," so a refactor becomes a conscious decision to move the
attribute, not an accidental breakage discovered later in CI.

## Where E2E ends

It proves a real user, in a real browser, can complete a real journey against
real running code. It doesn't substitute for unit coverage of internals, and
it's the most expensive layer available — reserved for journeys where nothing
else can observe what matters.

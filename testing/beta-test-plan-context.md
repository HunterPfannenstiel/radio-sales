# Orientation (for a reviewer who hasn't read the codebase)

**Persistence** is one JSON blob per rep at `reps/{repId}/data.json` (plus a shared
`reps/index.json` for login) — no database. The blob shape is defined once in
`lib/blob/schema.ts` (`RepStore` = `{ businesses[], callLogs[], repGoals }`). The
`blob` singleton (`lib/blob/index.ts`) switches implementation on the
`USE_LOCAL_BLOB` env var: `LocalBlobStore` (filesystem `.blob-store/`) locally and
in vitest, `SupabaseBlobStore` (Supabase Storage) in deployed envs.

**Server logic** lives entirely under `server/` in two flavors (see
`server/AGENTS.md`): **queries** (`server/queries/*`, all reads) and **mutations**
(`server/mutations/*`, all writes). Each is a class with an `execute(...)` method
that goes through the `blob` singleton; there is no ORM, no service layer, no DI.
API route handlers under `app/api/**` are thin: auth via `getSessionRepId()`
(cookie), a `Roles` check (all stubbed to `true` in this phase), zod validation,
then delegate to one query/mutation. The rep UI is client components under `app/`
and `components/` (Quick Log form, dashboard, What's Next + business history).

**The code behind each flow:** logging a call = `QuickLogForm` → `POST /api/calls`
→ `LogCallMutation` (resolves/creates the business, appends a call log).
Flow A reads back through `DashboardQuery`; Flow B through `RecentBusinessesQuery`
/ `SearchBusinessesQuery` / `WhatsNextQuery`; Flow C through `WhatsNextQuery`
(current stage + next step) and `BusinessInteractionHistoryQuery` (the timeline),
with edits via `UpdateBusinessStageMutation` / `UpdateBusinessNextStepMutation`.

**Test tooling:** vitest (`vitest.config.ts`, `USE_LOCAL_BLOB=true`, e2e excluded)
for unit + integration; Playwright (`playwright.config.ts`, requires `BASE_URL` —
no local server, runs against a deployed preview) for e2e. Existing examples to
mirror: `lib/utils.unit.test.ts`, `server/mutations/LoginMutation.integration.test.ts`
(note its `beforeEach(() => blob.wipe())`), `e2e/first-time-signup.spec.ts`.

---

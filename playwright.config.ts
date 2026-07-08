import { defineConfig } from "@playwright/test";

// Local dev convenience: pick up BASE_URL (and anything else) from the same
// .env.local that `next dev` reads, so a developer can just set it once
// instead of prefixing every command. No-op in CI — .env.local isn't
// checked out there, and real env vars always take precedence over
// whatever a .env file would set, so this never shadows the workflow's own
// `env:` block.
try {
  process.loadEnvFile(".env.local");
} catch {}

// E2E never spins up a local server (no `webServer` block here) — per
// testing/e2e.md, this layer only proves anything against a real deployed
// URL (itg or prod) hitting the real persistence code path. Fail loudly if
// nobody told us where that is, rather than silently defaulting to
// localhost and quietly testing the wrong thing.
if (!process.env.BASE_URL) {
  throw new Error("BASE_URL must be set — e2e tests run against a real deployment (itg or prod), not localhost.");
}

// Vercel Preview/Production deployments on this project sit behind
// deployment protection. Every request from the browser context needs this
// header or it never reaches the app — see docs/environments.md and the
// bypass header added to post-deploy-health.yml.
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

// Set by `pnpm test:e2e:watch` only — slows each action down so a headed
// run is actually watchable instead of finishing in ~1s. Unset everywhere
// else, so it never touches CI or a normal local run.
const slowMo = process.env.PW_SLOW_MO ? Number(process.env.PW_SLOW_MO) : undefined;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: process.env.BASE_URL,
    trace: "retain-on-failure",
    ...(bypassSecret ? { extraHTTPHeaders: { "x-vercel-protection-bypass": bypassSecret } } : {}),
  },
  projects: [{ name: "chromium", use: { browserName: "chromium", launchOptions: { slowMo } } }],
});

import { test, expect, type Page } from "@playwright/test";

const PIN = "4271";

// Money Pace: GOAL figure and the "to close" gap both read off the monthly
// goal directly, and a brand new rep has $0 sold — so both happen to equal
// the full goal amount at this point. Activity cards are scoped by
// data-testid (see app/page.tsx), so a mixed-up calls/asks wiring bug would
// actually fail this instead of just finding "40" or "20" anywhere on the page.
async function expectDashboardReflectsGoals(page: Page) {
  await expect(page.getByTestId("money-pace-goal-value")).toHaveText("$15,000");
  await expect(page.getByTestId("money-pace-gap-value")).toHaveText("$15,000");

  const callsCard = page.getByTestId("calls-card");
  await expect(callsCard.getByText("/ 40", { exact: true })).toBeVisible();

  const asksCard = page.getByTestId("asks-card");
  await expect(asksCard.getByText("/ 20", { exact: true })).toBeVisible();
}

// Claim: a rep who has never logged in before is routed to goal-setting
// instead of the dashboard, that routing decision survives a brand new
// session — logging out and back in forces the server to re-derive
// "has this rep set goals" from persisted storage, not from anything cached
// client-side in the same browser session — and the goals saved actually
// drive what the dashboard displays (Money Pace goal/gap, activity card
// targets), not just what the /goals form echoes back. Not covered here:
// PIN mismatch handling, goals validation (there is none today), and the
// manager-side goal-setting flow — those are separate claims.
test("first-time login routes to /goals, goals persist across a fresh login", async ({ page }) => {
  const repName = `e2e-signup-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await test.step("fresh username + pin logs in and is routed to /goals", async () => {
    await page.goto("/login");
    await page.getByLabel("Name").fill(repName);
    await page.getByLabel("PIN").fill(PIN);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/goals$/);
  });

  await test.step("submitting the goals form saves and toasts, without redirecting", async () => {
    await page.getByLabel("Monthly Sales Goal").fill("15000");
    await page.getByLabel("Weekly Asks").fill("20");
    await page.getByLabel("Weekly Calls").fill("40");
    await page.getByRole("button", { name: "Save Goals" }).click();
    await expect(page.getByText("Goals updated")).toBeVisible();
    await expect(page).toHaveURL(/\/goals$/);
  });

  await test.step("rep can navigate to the dashboard via nav — not stuck on /goals", async () => {
    await page.getByRole("link", { name: "Dashboard" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: "My Dashboard" })).toBeVisible();
  });

  await test.step("dashboard cards reflect the goals just set, not defaults", async () => {
    await expectDashboardReflectsGoals(page);
  });

  await test.step("log out, log back in with the same identity — lands on the dashboard, not /goals", async () => {
    await page.getByRole("button", { name: repName }).click();
    await page.getByRole("menuitem", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.getByLabel("Name").fill(repName);
    await page.getByLabel("PIN").fill(PIN);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  await test.step("dashboard still reflects the goals after a fresh login — not stale client state", async () => {
    await expect(page.getByRole("heading", { name: "My Dashboard" })).toBeVisible();
    await expectDashboardReflectsGoals(page);
  });

  await test.step("revisiting /goals shows the values saved earlier", async () => {
    await page.goto("/goals");
    await expect(page.getByLabel("Monthly Sales Goal")).toHaveValue("15000");
    await expect(page.getByLabel("Weekly Asks")).toHaveValue("20");
    await expect(page.getByLabel("Weekly Calls")).toHaveValue("40");
  });
});

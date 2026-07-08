import { test, expect, type Page } from "@playwright/test";

const PIN = "4271";
const WRONG_PIN = "9999";

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

// Claim: Sign Up is the default landing page for anyone without a session —
// visiting any protected route with no cookie lands there, not on Sign In.
// Sign In and Sign Up are otherwise separate, one-directional flows — a name
// that has never signed up cannot back into a new account through Sign In
// (the bug this split fixes), Sign Up refuses to create a second account for
// a name+pin combo that already exists, and the two pages cross-link to each
// other. Logging out, specifically, sends an existing rep back to Sign In
// (they already have credentials), not to the Sign Up default. Once an
// account exists, it behaves like before: a rep who has never set goals is
// routed to goal-setting instead of the dashboard, that routing decision and
// the goals saved survive a brand new session, and the goals actually drive
// what the dashboard displays (Money Pace goal/gap, activity card targets),
// not just what the /goals form echoes back. Not covered here: goals
// validation (there is none today) and the manager-side goal-setting flow —
// those are separate claims.
test("sign-up is the default landing page; sign-in only ever reaches existing accounts", async ({ page }) => {
  const repName = `e2e-signup-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await test.step("visiting the app without a session lands on Sign Up, not Sign In", async () => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/signup$/);
  });

  await test.step("Sign Up links to Sign In", async () => {
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/signin$/);
  });

  await test.step("a name that has never signed up can't sign in — no silent account creation", async () => {
    await page.getByLabel("Name").fill(repName);
    await page.getByLabel("PIN").fill(PIN);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page).toHaveURL(/\/signin$/);
  });

  await test.step("Sign In links to Sign Up", async () => {
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL(/\/signup$/);
  });

  await test.step("signing up with a fresh name + pin creates the account and routes to /goals", async () => {
    await page.getByLabel("Name").fill(repName);
    await page.getByLabel("PIN").fill(PIN);
    await page.getByRole("button", { name: "Create account" }).click();
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

  await test.step("log out lands on Sign In (not the Sign Up default) — a wrong pin there is rejected, not dropped into a new account", async () => {
    await page.getByRole("button", { name: repName }).click();
    await page.getByRole("menuitem", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/signin$/);

    await page.getByLabel("Name").fill(repName);
    await page.getByLabel("PIN").fill(WRONG_PIN);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page).toHaveURL(/\/signin$/);
  });

  await test.step("signing up again with the same name + pin is rejected as already taken", async () => {
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL(/\/signup$/);

    await page.getByLabel("Name").fill(repName);
    await page.getByLabel("PIN").fill(PIN);
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page).toHaveURL(/\/signup$/);
  });

  await test.step("Sign Up links back to Sign In, where the correct pin logs into the existing account", async () => {
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/signin$/);

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

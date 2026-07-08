import { test, expect } from "@playwright/test";

const PIN = "1234";

// Claim: a rep's very first logged call — to a business that doesn't exist yet —
// is the single write that drives three separate read surfaces: the dashboard
// (Flow A: calls/asks counts + sold amount), What's Next (Flow B: the business
// becomes discoverable), and the business's own interaction history (Flow C:
// the entry's outcome and ask render correctly, per the §0.3 outcome-mapping
// fix — a blank outcome here is a regression). The final stage change + reload
// is the one assertion in this whole suite that proves the real Supabase write
// path survives a fresh page load, not just client state — no integration test
// covers that. Not covered here: numeric permutations of pace math (unit layer)
// or business-resolution edge cases like case-insensitive name collisions
// (integration layer) — this journey only proves the path is walkable and
// persistence is real.
test("a rep logs a call to a new business, then sees it drive the dashboard, What's Next, and its own history", async ({ page }) => {
  const repName = `Canary-${Date.now()}`;
  const businessName = `E2E Golden Journey ${Date.now()}`;

  // Surfaced so a human can log in as this account after the run (itg persists
  // state across runs — this is a real account, not a fixture that gets torn
  // down). Printed to the list reporter's output and attached to the report/
  // trace as an annotation.
  console.log(`[canary account] name="${repName}" pin="${PIN}"`);
  test.info().annotations.push({ type: "canary-account", description: `name="${repName}" pin="${PIN}"` });

  await test.step("sign up as a fresh synthetic rep and set goals", async () => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/signup$/);

    await page.getByLabel("Name").fill(repName);
    await page.getByLabel("PIN").fill(PIN);
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page).toHaveURL(/\/goals$/);

    await page.getByLabel("Monthly Sales Goal").fill("15000");
    await page.getByLabel("Weekly Asks").fill("20");
    await page.getByLabel("Weekly Calls").fill("40");
    await page.getByRole("button", { name: "Save Goals" }).click();
    await expect(page.getByText("Goals updated")).toBeVisible();

    await page.getByRole("link", { name: "Dashboard" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: "My Dashboard" })).toBeVisible();
  });

  await test.step("log a call to a brand-new business via Quick Log", async () => {
    await page.getByRole("button", { name: "Log call" }).click();
    const dialog = page.getByRole("dialog", { name: "Log Call" });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel("Business").fill(businessName);
    await dialog.getByRole("button", { name: "Present", exact: true }).click();
    await dialog.getByRole("button", { name: "Send proposal", exact: true }).click();

    await dialog.getByLabel("Budget").fill("6000");
    await dialog.getByLabel("Term Length").fill("6");
    await dialog.getByRole("combobox").click();
    await page.getByRole("option", { name: "Months" }).click();

    await dialog.getByRole("button", { name: "Yes", exact: true }).click();

    await Promise.all([
      page.waitForResponse((res) => res.request().method() === "POST" && res.url().includes("/api/calls") && res.ok()),
      dialog.getByRole("button", { name: "Log Call", exact: true }).click(),
    ]);
    await expect(dialog).not.toBeVisible();
  });

  await test.step("Flow A — dashboard reflects the call: 1 call, 1 ask, $1,000 sold", async () => {
    const callsCard = page.getByTestId("calls-card");
    await expect(callsCard.getByText("1", { exact: true })).toBeVisible();

    const asksCard = page.getByTestId("asks-card");
    await expect(asksCard.getByText("1", { exact: true })).toBeVisible();

    await expect(page.getByTestId("money-pace-sold-value")).toHaveText("$1,000");
  });

  const card = () =>
    page.getByTestId("whats-next-card").filter({
      has: page.getByRole("heading", { name: businessName, exact: true }),
    });

  await test.step("Flow B — the new business appears in What's Next with stage Present", async () => {
    await page.getByRole("link", { name: "What's Next" }).click();
    await expect(page).toHaveURL(/\/whats-next$/);

    await expect(card()).toBeVisible();
    await expect(card().getByTestId("whats-next-card-stage")).toHaveText("Present");
  });

  await test.step("Flow C — the business's history shows the ask and reads outcome Sold", async () => {
    await card().getByRole("link", { name: `Open business view for ${businessName}` }).click();

    const overlay = page.getByRole("dialog", { name: businessName });
    await expect(overlay).toBeVisible();

    await expect(overlay.getByTestId("interaction-outcome")).toHaveText("Sold");

    const ask = overlay.getByTestId("interaction-ask");
    await expect(ask).toContainText("$6,000");
    await expect(ask).toContainText("6 months");

    await test.step("changing stage to Close persists through a full page reload — the real Supabase write path", async () => {
      const pipelineStage = overlay.getByRole("group", { name: "Pipeline stage" });
      await Promise.all([
        page.waitForResponse((res) => res.request().method() === "PATCH" && res.url().includes("/stage") && res.ok()),
        pipelineStage.getByRole("button", { name: "Close", exact: true }).click(),
      ]);

      await page.reload();
      await expect(page).toHaveURL(/\/whats-next$/);

      await expect(card().getByTestId("whats-next-card-stage")).toHaveText("Close");
    });
  });
});

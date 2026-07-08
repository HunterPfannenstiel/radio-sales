import { describe, it, expect, beforeEach } from "vitest";
import { blob } from "@/lib/blob";
import { BlobLogCallMutation } from "@/server/mutations/LogCallMutation";
import { BlobDashboardQuery } from "./DashboardQuery";

// Honesty note: vitest runs these against LocalBlobStore, a different
// implementation than the SupabaseBlobStore used in deployed environments
// (lib/blob/index.ts switches on USE_LOCAL_BLOB). These tests prove
// mutation -> query wiring and logic, not that Supabase serialization/paths
// work — only the e2e layer (§4) exercises the real Supabase path.
describe("LogCallMutation -> DashboardQuery (Flow A)", () => {
  beforeEach(async () => {
    await blob.wipe();
  });

  // ISO week 28 of 2026 is Mon 2026-07-06 .. Fri 2026-07-10.
  const loggedAt = "2026-07-08T15:00:00.000Z"; // Wednesday, week 28, July 2026
  const now = new Date("2026-07-08T18:00:00.000Z"); // same day, later in the day
  const timezone = "UTC";

  it("log one call this week with a $6,000/6-month sold ask, then read the dashboard for this month -> soldAmount $1,000, calls=1, asks=1", async () => {
    const repId = "rep-1";

    await new BlobLogCallMutation().execute({
      repId,
      businessName: "Acme Radio",
      stage: "present",
      whatNext: "send_proposal",
      budget: 6000,
      termValue: 6,
      termUnit: "months",
      outcome: "yes",
      loggedAt,
    });

    const result = await new BlobDashboardQuery().execute({
      repId,
      year: 2026,
      month: 6, // 0-based: July
      weekYear: 2026,
      weekNumber: 28,
      timezone,
      now,
    });

    expect(result.moneyPace.soldAmount).toBe(1000);
    expect(result.calls.count).toBe(1);
    expect(result.asks.count).toBe(1);
  });

  it("log a call with no ask -> calls increments, asks does not", async () => {
    const repId = "rep-2";

    await new BlobLogCallMutation().execute({
      repId,
      businessName: "Acme Radio",
      stage: "approach",
      whatNext: "followup_call",
      loggedAt,
    });

    const result = await new BlobDashboardQuery().execute({
      repId,
      year: 2026,
      month: 6,
      weekYear: 2026,
      weekNumber: 28,
      timezone,
      now,
    });

    expect(result.calls.count).toBe(1);
    expect(result.asks.count).toBe(0);
  });
});

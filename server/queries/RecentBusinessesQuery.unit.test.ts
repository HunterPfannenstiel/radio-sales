import { describe, it, expect } from "vitest";
import { sortAndDedupBusinesses } from "./RecentBusinessesQuery";

describe("sortAndDedupBusinesses", () => {
  it("logs A, then B, then A again → recent = [A, B] (MRU by loggedAt desc, deduped by businessId)", () => {
    const businesses = [
      { id: "biz-a", name: "Acme", createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "biz-b", name: "Bravo Co", createdAt: "2026-01-01T00:00:00.000Z" },
    ];
    const callLogs = [
      {
        id: "log-1",
        businessId: "biz-a",
        stage: "approach",
        whatNext: "followup_call" as const,
        loggedAt: "2026-07-01T09:00:00.000Z",
      },
      {
        id: "log-2",
        businessId: "biz-b",
        stage: "uncover",
        whatNext: "send_spec_spot" as const,
        loggedAt: "2026-07-02T09:00:00.000Z",
      },
      {
        id: "log-3",
        businessId: "biz-a",
        stage: "present",
        whatNext: "send_proposal" as const,
        loggedAt: "2026-07-03T09:00:00.000Z",
      },
    ];

    expect(sortAndDedupBusinesses(callLogs, businesses)).toEqual([
      { id: "biz-a", name: "Acme" },
      { id: "biz-b", name: "Bravo Co" },
    ]);
  });

  // biz-ghost is unreachable via the real create-on-log flow (a business is
  // always created before its first log), but the query must not crash if
  // the data ever drifts out of sync.
  it("a callLog whose businessId isn't in businesses[] → dropped silently, no crash", () => {
    const businesses = [
      { id: "biz-a", name: "Acme", createdAt: "2026-01-01T00:00:00.000Z" },
    ];
    const callLogs = [
      {
        id: "log-1",
        businessId: "biz-ghost",
        stage: "approach",
        whatNext: "followup_call" as const,
        loggedAt: "2026-07-01T09:00:00.000Z",
      },
      {
        id: "log-2",
        businessId: "biz-a",
        stage: "uncover",
        whatNext: "send_spec_spot" as const,
        loggedAt: "2026-06-01T09:00:00.000Z",
      },
    ];

    expect(sortAndDedupBusinesses(callLogs, businesses)).toEqual([
      { id: "biz-a", name: "Acme" },
    ]);
  });
});

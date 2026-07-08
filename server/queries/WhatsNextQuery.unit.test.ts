import { describe, it, expect } from "vitest";
import { computeWhatsNext } from "./WhatsNextQuery";

describe("computeWhatsNext", () => {
  it("latest log stage=present, whatNext=send_proposal, no manual override → stage 'present', next step 'Send proposal'", () => {
    const businesses = [
      { id: "biz-a", name: "Acme", createdAt: "2026-01-01T00:00:00.000Z" },
    ];
    const callLogs = [
      {
        id: "log-1",
        businessId: "biz-a",
        stage: "present",
        whatNext: "send_proposal" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    expect(computeWhatsNext(businesses, callLogs)).toEqual([
      {
        id: "biz-a",
        name: "Acme",
        stage: "present",
        nextStepText: "Send proposal",
        lastContactedAt: "2026-07-01T10:00:00.000Z",
      },
    ]);
  });

  it("business.nextStepUpdatedAt after the latest log's loggedAt → shows the manual nextStep text instead", () => {
    const businesses = [
      {
        id: "biz-b",
        name: "Bravo Co",
        createdAt: "2026-01-01T00:00:00.000Z",
        nextStep: "Call back Friday",
        nextStepUpdatedAt: "2026-07-05T00:00:00.000Z",
      },
    ];
    const callLogs = [
      {
        id: "log-2",
        businessId: "biz-b",
        stage: "uncover",
        whatNext: "send_spec_spot" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    const [result] = computeWhatsNext(businesses, callLogs);
    expect(result.nextStepText).toBe("Call back Friday");
  });

  // The comparison is strict `>` — an edit timestamped exactly at the log's
  // loggedAt does not count as "after," so the log's own label still wins.
  it("business.nextStepUpdatedAt exactly equal to the latest log's loggedAt → the log's label wins, not the manual text (strict >, not >=)", () => {
    const businesses = [
      {
        id: "biz-c",
        name: "Charlie LLC",
        createdAt: "2026-01-01T00:00:00.000Z",
        nextStep: "Ignored manual text",
        nextStepUpdatedAt: "2026-07-01T10:00:00.000Z",
      },
    ];
    const callLogs = [
      {
        id: "log-3",
        businessId: "biz-c",
        stage: "close",
        whatNext: "send_contract" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    const [result] = computeWhatsNext(businesses, callLogs);
    expect(result.nextStepText).toBe("Send contract");
  });

  it("a newer call logged after that manual edit → reverts to the new log's label", () => {
    const businesses = [
      {
        id: "biz-d",
        name: "Delta Inc",
        createdAt: "2026-01-01T00:00:00.000Z",
        nextStep: "Manual text (stale)",
        nextStepUpdatedAt: "2026-07-02T00:00:00.000Z",
      },
    ];
    const callLogs = [
      {
        id: "log-4a",
        businessId: "biz-d",
        stage: "present",
        whatNext: "send_proposal" as const,
        loggedAt: "2026-07-01T00:00:00.000Z",
      },
      {
        id: "log-4b",
        businessId: "biz-d",
        stage: "close",
        whatNext: "set_appointment" as const,
        loggedAt: "2026-07-03T00:00:00.000Z",
      },
    ];

    const [result] = computeWhatsNext(businesses, callLogs);
    expect(result.stage).toBe("close");
    expect(result.nextStepText).toBe("Set appointment");
  });

  it("business with zero logs → omitted entirely", () => {
    const businesses = [
      { id: "biz-e", name: "Echo Corp", createdAt: "2026-01-01T00:00:00.000Z" },
    ];

    expect(computeWhatsNext(businesses, [])).toEqual([]);
  });

  // A business is only ever pushed into the result once it has a latest log
  // (see the "zero logs → omitted entirely" case above), so lastContactedAt
  // is never null on an entry that reaches the final sort. The comparator's
  // "null sorts last, alphabetically" branch below is defensive dead code
  // under current business rules, not a reachable "never contacted" case —
  // asserting it here would require unrealistic data (e.g. an empty loggedAt)
  // to force a falsy lastContactedAt through, which principle 6 rules out.
  it("two contacted businesses sort newest-first by lastContactedAt", () => {
    const businesses = [
      { id: "biz-f", name: "Foxtrot", createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "biz-g", name: "Golf", createdAt: "2026-01-01T00:00:00.000Z" },
    ];
    const callLogs = [
      {
        id: "log-5",
        businessId: "biz-f",
        stage: "approach",
        whatNext: "followup_call" as const,
        loggedAt: "2026-07-10T00:00:00.000Z",
      },
      {
        id: "log-6",
        businessId: "biz-g",
        stage: "approach",
        whatNext: "check_in" as const,
        loggedAt: "2026-07-08T00:00:00.000Z",
      },
    ];

    const result = computeWhatsNext(businesses, callLogs);
    expect(result.map((r) => r.id)).toEqual(["biz-f", "biz-g"]);
  });
});

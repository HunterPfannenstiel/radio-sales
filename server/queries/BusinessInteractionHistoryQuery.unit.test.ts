import { describe, it, expect } from "vitest";
import { buildInteractionHistory } from "./BusinessInteractionHistoryQuery";

describe("buildInteractionHistory", () => {
  it("two logs for one business → newest-first", () => {
    const logs = [
      {
        id: "log-1",
        businessId: "biz-a",
        stage: "approach",
        whatNext: "followup_call" as const,
        loggedAt: "2026-07-01T00:00:00.000Z",
      },
      {
        id: "log-2",
        businessId: "biz-a",
        stage: "present",
        whatNext: "send_proposal" as const,
        loggedAt: "2026-07-05T00:00:00.000Z",
      },
    ];

    expect(buildInteractionHistory(logs).map((e) => e.id)).toEqual([
      "log-2",
      "log-1",
    ]);
  });

  it("budget:6000, termValue:3, termUnit:'months', confidence:'sure' → ask = {amount:6000, term:'3 months', confidence:'sure'}", () => {
    const logs = [
      {
        id: "log-3",
        businessId: "biz-b",
        stage: "present",
        whatNext: "send_proposal" as const,
        budget: 6000,
        termValue: 3,
        termUnit: "months" as const,
        confidence: "sure" as const,
        loggedAt: "2026-07-01T00:00:00.000Z",
      },
    ];

    expect(buildInteractionHistory(logs)[0].ask).toEqual({
      amount: 6000,
      term: "3 months",
      confidence: "sure",
    });
  });

  it("whatNext:'send_proposal' → nextStep: 'Send proposal'", () => {
    const logs = [
      {
        id: "log-4",
        businessId: "biz-c",
        stage: "present",
        whatNext: "send_proposal" as const,
        loggedAt: "2026-07-01T00:00:00.000Z",
      },
    ];

    expect(buildInteractionHistory(logs)[0].nextStep).toBe("Send proposal");
  });

  it("outcome:'yes' → sold", () => {
    const logs = [
      {
        id: "log-5",
        businessId: "biz-d",
        stage: "close",
        whatNext: "send_contract" as const,
        outcome: "yes" as const,
        loggedAt: "2026-07-01T00:00:00.000Z",
      },
    ];

    expect(buildInteractionHistory(logs)[0].outcome).toBe("sold");
  });

  it("outcome:'no' → not_sold", () => {
    const logs = [
      {
        id: "log-6",
        businessId: "biz-e",
        stage: "close",
        whatNext: "check_in" as const,
        outcome: "no" as const,
        loggedAt: "2026-07-01T00:00:00.000Z",
      },
    ];

    expect(buildInteractionHistory(logs)[0].outcome).toBe("not_sold");
  });

  it("outcome:'pending' → follow_up", () => {
    const logs = [
      {
        id: "log-7",
        businessId: "biz-f",
        stage: "close",
        whatNext: "followup_call" as const,
        outcome: "pending" as const,
        loggedAt: "2026-07-01T00:00:00.000Z",
      },
    ];

    expect(buildInteractionHistory(logs)[0].outcome).toBe("follow_up");
  });

  // Regression check for the §0.3 bug: a call logged with no outcome at all
  // must still collapse to follow_up, not be left undefined/crash the mapping.
  it("outcome absent (not recorded on the log) → follow_up", () => {
    const logs = [
      {
        id: "log-8",
        businessId: "biz-g",
        stage: "uncover",
        whatNext: "send_spec_spot" as const,
        loggedAt: "2026-07-01T00:00:00.000Z",
      },
    ];

    expect(buildInteractionHistory(logs)[0].outcome).toBe("follow_up");
  });
});

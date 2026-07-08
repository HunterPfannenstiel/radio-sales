import { describe, it, expect } from "vitest";
import { computeMoneyPace, computeActivityPace } from "./DashboardQuery";

describe("computeMoneyPace", () => {
  it("$12,000 budget / 12-month term, outcome=yes → $1,000 sold, $950 projected", () => {
    const logs = [
      {
        id: "log-1",
        businessId: "biz-a",
        stage: "close",
        whatNext: "send_contract" as const,
        budget: 12000,
        termValue: 12,
        termUnit: "months" as const,
        outcome: "yes" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    const result = computeMoneyPace(logs, {
      year: 2026,
      month: 6, // July
      goalAmount: 5000,
      now: new Date("2026-07-15T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.soldAmount).toBe(1000);
    expect(result.projectedAmount).toBe(950);
  });

  // Deal starts Jan 2026 with a 12-month term, so the span is [Jan 2026, Jan 2027).
  // Dec 2026 is the last month inside that span; Jul 2027 is well past the end.
  it("$12,000/12mo deal logged Jan 2026 → $1,000 sold in Dec 2026, $0 sold in Jul 2027 (deal-span window)", () => {
    const logs = [
      {
        id: "log-2",
        businessId: "biz-a",
        stage: "close",
        whatNext: "send_contract" as const,
        budget: 12000,
        termValue: 12,
        termUnit: "months" as const,
        outcome: "yes" as const,
        loggedAt: "2026-01-15T10:00:00.000Z",
      },
    ];

    const inSpan = computeMoneyPace(logs, {
      year: 2026,
      month: 11, // December
      goalAmount: 5000,
      now: new Date("2026-12-10T12:00:00.000Z"),
      timezone: "UTC",
    });
    expect(inSpan.soldAmount).toBe(1000);

    const afterSpan = computeMoneyPace(logs, {
      year: 2027,
      month: 6, // July
      goalAmount: 5000,
      now: new Date("2027-07-10T12:00:00.000Z"),
      timezone: "UTC",
    });
    expect(afterSpan.soldAmount).toBe(0);
  });

  it("$12,000 budget / 52-week term, outcome=yes → $1,000/mo sold (weeks×12/52 conversion)", () => {
    const logs = [
      {
        id: "log-3",
        businessId: "biz-a",
        stage: "close",
        whatNext: "send_contract" as const,
        budget: 12000,
        termValue: 52,
        termUnit: "weeks" as const,
        outcome: "yes" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    const result = computeMoneyPace(logs, {
      year: 2026,
      month: 6,
      goalAmount: 5000,
      now: new Date("2026-07-15T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.soldAmount).toBe(1000);
  });

  it("open ask, confidence='sure', no outcome → $800 projected, $0 sold", () => {
    const logs = [
      {
        id: "log-4",
        businessId: "biz-a",
        stage: "present",
        whatNext: "send_proposal" as const,
        budget: 12000,
        termValue: 12,
        termUnit: "months" as const,
        confidence: "sure" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    const result = computeMoneyPace(logs, {
      year: 2026,
      month: 6,
      goalAmount: 5000,
      now: new Date("2026-07-15T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.soldAmount).toBe(0);
    expect(result.projectedAmount).toBe(800);
  });

  it("open ask, confidence='expect', no outcome → $400 projected, $0 sold", () => {
    const logs = [
      {
        id: "log-5",
        businessId: "biz-a",
        stage: "present",
        whatNext: "send_proposal" as const,
        budget: 12000,
        termValue: 12,
        termUnit: "months" as const,
        confidence: "expect" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    const result = computeMoneyPace(logs, {
      year: 2026,
      month: 6,
      goalAmount: 5000,
      now: new Date("2026-07-15T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.soldAmount).toBe(0);
    expect(result.projectedAmount).toBe(400);
  });

  it("open ask, confidence='hope', no outcome → $100 projected, $0 sold", () => {
    const logs = [
      {
        id: "log-6",
        businessId: "biz-a",
        stage: "present",
        whatNext: "send_proposal" as const,
        budget: 12000,
        termValue: 12,
        termUnit: "months" as const,
        confidence: "hope" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    const result = computeMoneyPace(logs, {
      year: 2026,
      month: 6,
      goalAmount: 5000,
      now: new Date("2026-07-15T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.soldAmount).toBe(0);
    expect(result.projectedAmount).toBe(100);
  });

  it("outcome='no' → $0 sold and $0 projected, even with a confidence weight present", () => {
    const logs = [
      {
        id: "log-7",
        businessId: "biz-a",
        stage: "close",
        whatNext: "check_in" as const,
        budget: 12000,
        termValue: 12,
        termUnit: "months" as const,
        confidence: "sure" as const,
        outcome: "no" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    const result = computeMoneyPace(logs, {
      year: 2026,
      month: 6,
      goalAmount: 5000,
      now: new Date("2026-07-15T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.soldAmount).toBe(0);
    expect(result.projectedAmount).toBe(0);
  });

  it("budget set but termValue absent → deal excluded entirely (guard clause)", () => {
    const logs = [
      {
        id: "log-8",
        businessId: "biz-a",
        stage: "close",
        whatNext: "send_contract" as const,
        budget: 12000,
        outcome: "yes" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    const result = computeMoneyPace(logs, {
      year: 2026,
      month: 6,
      goalAmount: 5000,
      now: new Date("2026-07-15T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.soldAmount).toBe(0);
    expect(result.projectedAmount).toBe(0);
  });

  // July 2026 has 23 working days; by Jul 15 (a Wednesday) 11 of them have
  // elapsed, so expected = $23,000 * 11/23 = $11,000.
  it("$23,000 goal, 11 of 23 workdays elapsed, $15,000 sold (above $11,000 expected) → ahead", () => {
    const logs = [
      {
        id: "log-9",
        businessId: "biz-a",
        stage: "close",
        whatNext: "send_contract" as const,
        budget: 180000,
        termValue: 12,
        termUnit: "months" as const,
        outcome: "yes" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    const result = computeMoneyPace(logs, {
      year: 2026,
      month: 6,
      goalAmount: 23000,
      now: new Date("2026-07-15T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.paceStatus).toBe("ahead");
  });

  it("$23,000 goal, 11 of 23 workdays elapsed, $0 sold but $11,000 projected (meets $11,000 expected) → on_pace", () => {
    const logs = [
      {
        id: "log-10",
        businessId: "biz-a",
        stage: "present",
        whatNext: "send_proposal" as const,
        budget: 165000,
        termValue: 12,
        termUnit: "months" as const,
        confidence: "sure" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    const result = computeMoneyPace(logs, {
      year: 2026,
      month: 6,
      goalAmount: 23000,
      now: new Date("2026-07-15T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.paceStatus).toBe("on_pace");
  });

  it("$23,000 goal, 11 of 23 workdays elapsed, only $100 projected (short of $11,000 expected) → behind", () => {
    const logs = [
      {
        id: "log-11",
        businessId: "biz-a",
        stage: "present",
        whatNext: "send_proposal" as const,
        budget: 12000,
        termValue: 12,
        termUnit: "months" as const,
        confidence: "hope" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    const result = computeMoneyPace(logs, {
      year: 2026,
      month: 6,
      goalAmount: 23000,
      now: new Date("2026-07-15T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.paceStatus).toBe("behind");
  });

  it("$1,000 goal fully sold on day 2 of the month → goal_reached regardless of how few workdays have elapsed", () => {
    const logs = [
      {
        id: "log-12",
        businessId: "biz-a",
        stage: "close",
        whatNext: "send_contract" as const,
        budget: 12000,
        termValue: 12,
        termUnit: "months" as const,
        outcome: "yes" as const,
        loggedAt: "2026-07-01T10:00:00.000Z",
      },
    ];

    const result = computeMoneyPace(logs, {
      year: 2026,
      month: 6,
      goalAmount: 1000,
      now: new Date("2026-07-02T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.paceStatus).toBe("goal_reached");
  });

  it("$10,000 June goal, $0 sold, now mid-July (June already over) → missed", () => {
    const result = computeMoneyPace([], {
      year: 2026,
      month: 5, // June
      goalAmount: 10000,
      now: new Date("2026-07-15T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.paceStatus).toBe("missed");
  });

  it("goalAmount=0 → behind, soldPercent 0 (guard clause, not a divide-by-zero)", () => {
    const result = computeMoneyPace([], {
      year: 2026,
      month: 6,
      goalAmount: 0,
      now: new Date("2026-07-15T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.paceStatus).toBe("behind");
    expect(result.soldPercent).toBe(0);
  });
});

describe("computeActivityPace", () => {
  // Week 28 of 2026 runs Mon Jul 6 – Fri Jul 10.
  it("3 logs Mon–Fri (one with a budget) → calls=3, asks=1", () => {
    const logs = [
      {
        id: "log-1",
        businessId: "biz-a",
        stage: "uncover",
        whatNext: "followup_call" as const,
        loggedAt: "2026-07-06T09:00:00.000Z", // Monday
      },
      {
        id: "log-2",
        businessId: "biz-a",
        stage: "present",
        whatNext: "send_proposal" as const,
        budget: 5000,
        termValue: 12,
        termUnit: "months" as const,
        loggedAt: "2026-07-08T09:00:00.000Z", // Wednesday
      },
      {
        id: "log-3",
        businessId: "biz-a",
        stage: "approach",
        whatNext: "check_in" as const,
        loggedAt: "2026-07-10T09:00:00.000Z", // Friday
      },
    ];

    const result = computeActivityPace(logs, {
      weekYear: 2026,
      weekNumber: 28,
      weeklyCallTarget: 10,
      weeklyAskTarget: 10,
      now: new Date("2026-07-08T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.calls.count).toBe(3);
    expect(result.asks.count).toBe(1);
  });

  it("log dated Sunday Jul 5 (the day before week 28's Monday) → excluded, calls=0 (Mon–Fri boundary, not a rolling 7 days)", () => {
    const logs = [
      {
        id: "log-1",
        businessId: "biz-a",
        stage: "uncover",
        whatNext: "followup_call" as const,
        loggedAt: "2026-07-05T09:00:00.000Z", // Sunday
      },
    ];

    const result = computeActivityPace(logs, {
      weekYear: 2026,
      weekNumber: 28,
      weeklyCallTarget: 10,
      weeklyAskTarget: 10,
      now: new Date("2026-07-08T12:00:00.000Z"),
      timezone: "UTC",
    });

    expect(result.calls.count).toBe(0);
  });

  // The exact day of each log doesn't matter here — the claim is purely that
  // hitting the numeric target flips the status, so a generated spread of 40
  // logs across the week's 5 weekdays stands in for 40 real logs.
  it("weeklyCallTarget=40, 40 logged (even early in the week) → goal_reached", () => {
    const weekdays = [
      "2026-07-06", // Monday
      "2026-07-07",
      "2026-07-08",
      "2026-07-09",
      "2026-07-10", // Friday
    ];
    const logs = Array.from({ length: 40 }, (_, i) => ({
      id: `log-${i}`,
      businessId: "biz-a",
      stage: "uncover",
      whatNext: "followup_call" as const,
      loggedAt: `${weekdays[i % 5]}T09:00:00.000Z`,
    }));

    const result = computeActivityPace(logs, {
      weekYear: 2026,
      weekNumber: 28,
      weeklyCallTarget: 40,
      weeklyAskTarget: 40,
      now: new Date("2026-07-06T09:00:00.000Z"), // Monday — only 1 of 5 workdays elapsed
      timezone: "UTC",
    });

    expect(result.calls.paceStatus).toBe("goal_reached");
  });

  it("weeklyCallTarget=40, 39 logged by Friday (all 5 workdays elapsed, expected=40) → behind", () => {
    const weekdays = [
      "2026-07-06",
      "2026-07-07",
      "2026-07-08",
      "2026-07-09",
      "2026-07-10",
    ];
    const logs = Array.from({ length: 39 }, (_, i) => ({
      id: `log-${i}`,
      businessId: "biz-a",
      stage: "uncover",
      whatNext: "followup_call" as const,
      loggedAt: `${weekdays[i % 5]}T09:00:00.000Z`,
    }));

    const result = computeActivityPace(logs, {
      weekYear: 2026,
      weekNumber: 28,
      weeklyCallTarget: 40,
      weeklyAskTarget: 40,
      now: new Date("2026-07-10T09:00:00.000Z"), // Friday — 5 of 5 workdays elapsed
      timezone: "UTC",
    });

    expect(result.calls.paceStatus).toBe("behind");
  });
});

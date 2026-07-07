import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepStore, emptyRepStore } from "@/lib/blob/schema";

export type DashboardQueryParams = {
  repId: string;
  year: number;
  month: number; // 0-based (0 = January)
  weekYear: number;
  weekNumber: number; // ISO week number
  timezone: string;
  now: Date; // "today" — injected so the math is deterministic and testable
};

export const PACE_STATUSES = ["ahead", "on_pace", "behind", "missed", "goal_reached"] as const;
export type PaceStatus = typeof PACE_STATUSES[number];

export const ACTIVITY_PACE_STATUSES = ["on_pace", "behind", "missed", "goal_reached"] as const;
export type ActivityPaceStatus = typeof ACTIVITY_PACE_STATUSES[number];

export type MoneyPaceDTO = {
  soldAmount: number;
  projectedAmount: number;
  goalAmount: number;
  soldPercent: number;
  paceStatus: PaceStatus;
};

export type ActivityCountDTO = {
  count: number;
  target: number;
  paceStatus: ActivityPaceStatus;
};

export type DashboardDTO = {
  moneyPace: MoneyPaceDTO;
  calls: ActivityCountDTO;
  asks: ActivityCountDTO;
  daysRemainingInWeek: number;
  weekNumber: number;
  weeklyPresentTarget: number;
};

export interface IDashboardQuery {
  execute(params: DashboardQueryParams): Promise<DashboardDTO>;
}

type CallLog = RepStore["callLogs"][number];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Count Mon–Fri days in [start, end] inclusive. */
function countWorkingDays(start: Date, end: Date): number {
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const dow = cur.getUTCDay(); // 0=Sun, 6=Sat
    if (dow >= 1 && dow <= 5) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

/**
 * Return the Monday of the ISO week identified by (isoYear, isoWeek).
 * ISO week 1 is the week containing January 4.
 */
function isoWeekMonday(isoYear: number, isoWeek: number): Date {
  // Jan 4 of isoYear is always in week 1
  const jan4 = new Date(Date.UTC(isoYear, 0, 4));
  const jan4Dow = jan4.getUTCDay() || 7; // make Sunday = 7
  // Monday of week 1
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - (jan4Dow - 1));
  // Add (isoWeek - 1) weeks
  const monday = new Date(week1Monday);
  monday.setUTCDate(week1Monday.getUTCDate() + (isoWeek - 1) * 7);
  return monday;
}

/**
 * The rep's "today" as a UTC-midnight Date, derived from `now` in their local
 * timezone — avoids the UTC-midnight skew that would otherwise put a late-evening
 * local action on the wrong calendar day.
 */
function localTodayUTC(now: Date, timezone: string): Date {
  const localTodayStr = now.toLocaleDateString("en-CA", { timeZone: timezone });
  const [ty, tm, td] = localTodayStr.split("-").map(Number);
  return new Date(Date.UTC(ty, tm - 1, td));
}

const CONFIDENCE_WEIGHTS: Record<string, number> = {
  in: 0.95,
  sure: 0.8,
  expect: 0.4,
  hope: 0.1,
};

// ---------------------------------------------------------------------------
// Pure pace calculations — no I/O, no hidden clock. Seed logs + a fixed `now`
// and every output is verifiable by hand (see testing/beta-test-plan.md §1).
// ---------------------------------------------------------------------------

export function computeMoneyPace(
  logs: CallLog[],
  params: { year: number; month: number; goalAmount: number; now: Date; timezone: string }
): MoneyPaceDTO {
  const { year, month, goalAmount, now, timezone } = params;

  // First day of target month (local calendar month, treat as UTC midnight)
  const targetMonthStart = new Date(Date.UTC(year, month, 1));

  let soldAmount = 0;
  let projectedAmount = 0;

  for (const log of logs) {
    const { budget, termValue, termUnit, outcome, confidence } = log;

    // Skip if no budget or no term info
    if (budget == null || termValue == null || termValue <= 0 || termUnit == null) {
      continue;
    }

    // termInMonths
    const termInMonths = termUnit === "months" ? termValue : termValue * (12 / 52);
    if (termInMonths <= 0) continue;

    const monthlyValue = budget / termInMonths;

    // Deal span: starts on the first day of the month in which loggedAt falls
    const loggedDate = new Date(log.loggedAt);
    const dealStartYear = loggedDate.getUTCFullYear();
    const dealStartMonth = loggedDate.getUTCMonth(); // 0-based

    // End: dealStart + termInMonths months (fractional months → compare in total months)
    const dealStartTotalMonths = dealStartYear * 12 + dealStartMonth;
    const dealEndTotalMonths = dealStartTotalMonths + termInMonths;
    const targetTotalMonths = year * 12 + month;

    // Month M is within span if M >= dealStart month AND M < dealEnd month
    const withinSpan =
      targetTotalMonths >= dealStartTotalMonths && targetTotalMonths < dealEndTotalMonths;
    if (!withinSpan) continue;

    if (outcome === "yes") {
      soldAmount += monthlyValue;
      projectedAmount += monthlyValue * 0.95;
    } else if (outcome !== "no" && confidence != null) {
      const weight = CONFIDENCE_WEIGHTS[confidence];
      if (weight != null) {
        projectedAmount += weight * monthlyValue;
      }
    }
  }

  const todayUTC = localTodayUTC(now, timezone);
  const monthEnd = new Date(Date.UTC(year, month + 1, 0)); // last day of month

  // For a historical month (month already passed), count all working days
  const refDay = todayUTC > monthEnd ? monthEnd : todayUTC;
  const workingDaysElapsed = countWorkingDays(targetMonthStart, refDay);
  const totalWorkingDays = countWorkingDays(targetMonthStart, monthEnd);
  const isPastMonth = todayUTC > monthEnd;

  let paceStatus: PaceStatus;
  let soldPercent: number;

  if (goalAmount === 0) {
    paceStatus = "behind";
    soldPercent = 0;
  } else {
    soldPercent = Math.round((soldAmount / goalAmount) * 100);
    const expectedAmount = goalAmount * (workingDaysElapsed / (totalWorkingDays || 1));

    if (soldAmount >= goalAmount) {
      paceStatus = "goal_reached";
    } else if (isPastMonth) {
      paceStatus = "missed";
    } else if (soldAmount >= expectedAmount) {
      paceStatus = "ahead";
    } else if (projectedAmount >= expectedAmount) {
      paceStatus = "on_pace";
    } else {
      paceStatus = "behind";
    }
  }

  return { soldAmount, projectedAmount, goalAmount, soldPercent, paceStatus };
}

export function computeActivityPace(
  logs: CallLog[],
  params: {
    weekYear: number;
    weekNumber: number;
    weeklyCallTarget: number;
    weeklyAskTarget: number;
    now: Date;
    timezone: string;
  }
): { calls: ActivityCountDTO; asks: ActivityCountDTO; daysRemainingInWeek: number } {
  const { weekYear, weekNumber, weeklyCallTarget, weeklyAskTarget, now, timezone } = params;

  const todayUTC = localTodayUTC(now, timezone);
  const weekMonday = isoWeekMonday(weekYear, weekNumber);
  const weekFriday = new Date(weekMonday);
  weekFriday.setUTCDate(weekMonday.getUTCDate() + 4);

  // Filter logs in this week (Mon–Fri)
  const weekLogs = logs.filter((log) => {
    const d = new Date(log.loggedAt);
    const dUTC = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    return dUTC >= weekMonday && dUTC <= weekFriday;
  });

  const callCount = weekLogs.length;
  const askCount = weekLogs.filter((log) => log.budget != null).length;

  // Days remaining in week including today (Mon–Fri only)
  let daysRemainingInWeek = 0;
  if (todayUTC <= weekFriday) {
    const startFrom = todayUTC >= weekMonday ? todayUTC : weekMonday;
    daysRemainingInWeek = countWorkingDays(startFrom, weekFriday);
  }

  // Working days elapsed in week (Mon through today, capped at 5)
  const weekElapsedEnd = todayUTC > weekFriday ? weekFriday : todayUTC;
  const workingDaysElapsedInWeek =
    todayUTC < weekMonday ? 0 : countWorkingDays(weekMonday, weekElapsedEnd);

  const callExpected = weeklyCallTarget * (workingDaysElapsedInWeek / 5);
  const askExpected = weeklyAskTarget * (workingDaysElapsedInWeek / 5);
  const isPastWeek = todayUTC > weekFriday;

  const callPaceStatus: ActivityPaceStatus =
    callCount >= weeklyCallTarget ? "goal_reached"
    : isPastWeek ? "missed"
    : callCount >= callExpected ? "on_pace"
    : "behind";
  const askPaceStatus: ActivityPaceStatus =
    askCount >= weeklyAskTarget ? "goal_reached"
    : isPastWeek ? "missed"
    : askCount >= askExpected ? "on_pace"
    : "behind";

  return {
    calls: { count: callCount, target: weeklyCallTarget, paceStatus: callPaceStatus },
    asks: { count: askCount, target: weeklyAskTarget, paceStatus: askPaceStatus },
    daysRemainingInWeek,
  };
}

/** Weekly $ a rep must present to close the remaining gap by month end. */
export function computeWeeklyPresentTarget(params: {
  goalAmount: number;
  soldAmount: number;
  year: number;
  month: number;
  now: Date;
  timezone: string;
}): number {
  const { goalAmount, soldAmount, year, month, now, timezone } = params;

  const todayUTC = localTodayUTC(now, timezone);
  const monthEnd = new Date(Date.UTC(year, month + 1, 0));
  const isPastMonth = todayUTC > monthEnd;
  const gap = goalAmount - soldAmount;

  if (gap > 0 && goalAmount > 0 && !isPastMonth) {
    const daysInMonth = monthEnd.getUTCDate();
    const remainingDays =
      todayUTC.getUTCFullYear() === year && todayUTC.getUTCMonth() === month
        ? Math.max(1, daysInMonth - todayUTC.getUTCDate())
        : daysInMonth;
    const weeksLeft = Math.max(1, remainingDays / 5);
    return Math.ceil(gap / weeksLeft);
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Implementation — reads the rep store, then delegates to the pure functions.
// ---------------------------------------------------------------------------

export class BlobDashboardQuery implements IDashboardQuery {
  async execute(params: DashboardQueryParams): Promise<DashboardDTO> {
    const { repId, year, month, weekYear, weekNumber, timezone, now } = params;

    const store = (await blob.read<RepStore>(paths.repStore(repId))) ?? emptyRepStore();

    const goals = store.repGoals;
    const goalAmount = goals?.monthlyGoalAmount ?? 0;
    const weeklyCallTarget = goals?.weeklyCallTarget ?? 0;
    const weeklyAskTarget = goals?.weeklyAskTarget ?? 0;
    const logs = store.callLogs;

    const moneyPace = computeMoneyPace(logs, { year, month, goalAmount, now, timezone });
    const activity = computeActivityPace(logs, {
      weekYear,
      weekNumber,
      weeklyCallTarget,
      weeklyAskTarget,
      now,
      timezone,
    });
    const weeklyPresentTarget = computeWeeklyPresentTarget({
      goalAmount,
      soldAmount: moneyPace.soldAmount,
      year,
      month,
      now,
      timezone,
    });

    return {
      moneyPace,
      calls: activity.calls,
      asks: activity.asks,
      daysRemainingInWeek: activity.daysRemainingInWeek,
      weekNumber,
      weeklyPresentTarget,
    };
  }
}

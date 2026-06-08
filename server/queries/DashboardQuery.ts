import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";

type Store = {
  reps: { id: string; name: string }[];
  businesses: {
    id: string;
    repId: string;
    name: string;
    createdAt: string;
  }[];
  callLogs: {
    id: string;
    repId: string;
    businessId: string;
    stage: string;
    whatNext: string;
    budget?: number;
    termValue?: number;
    termUnit?: "weeks" | "months";
    confidence?: string;
    outcome: string;
    loggedAt: string;
  }[];
  repGoals: {
    repId: string;
    monthlyGoalAmount: number;
    weeklyCallTarget: number;
    weeklyAskTarget: number;
  }[];
};

export type DashboardQueryParams = {
  repId: string;
  year: number;
  month: number; // 0-based (0 = January)
  weekYear: number;
  weekNumber: number; // ISO week number
};

export type DashboardDTO = {
  moneyPace: {
    soldAmount: number;
    projectedAmount: number;
    goalAmount: number;
    soldPercent: number;
    paceStatus: "ahead" | "on_pace" | "behind" | "goal_reached";
  };
  calls: { count: number; target: number; paceStatus: "on_pace" | "behind" };
  asks: { count: number; target: number; paceStatus: "on_pace" | "behind" };
  daysRemainingInWeek: number;
  weekNumber: number;
};

export interface IDashboardQuery {
  execute(params: DashboardQueryParams): Promise<DashboardDTO>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Count Mon–Fri days in [start, end] inclusive. */
function countWorkingDays(start: Date, end: Date): number {
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const dow = cur.getDay(); // 0=Sun, 6=Sat
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

const CONFIDENCE_WEIGHTS: Record<string, number> = {
  SURE: 0.8,
  EXPECT: 0.4,
  HOPE: 0.1,
};

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

export class BlobDashboardQuery implements IDashboardQuery {
  async execute(params: DashboardQueryParams): Promise<DashboardDTO> {
    const { repId, year, month, weekYear, weekNumber } = params;

    const store = (await blob.read<Store>(paths.store)) ?? {
      reps: [],
      businesses: [],
      callLogs: [],
      repGoals: [],
    };

    // -- Goals --
    const goals = store.repGoals?.find((g) => g.repId === repId);
    const goalAmount = goals?.monthlyGoalAmount ?? 0;
    const weeklyCallTarget = goals?.weeklyCallTarget ?? 0;
    const weeklyAskTarget = goals?.weeklyAskTarget ?? 0;

    // -- All call logs for this rep --
    const repLogs = store.callLogs.filter((c) => c.repId === repId);

    // -------------------------------------------------------------------------
    // Money Pace
    // -------------------------------------------------------------------------

    // First day of target month (local calendar month, treat as UTC midnight)
    const targetMonthStart = new Date(Date.UTC(year, month, 1));

    let soldAmount = 0;
    let projectedAmount = 0;

    for (const log of repLogs) {
      const { budget, termValue, termUnit, outcome, confidence } = log;

      // Skip if no budget or no term info
      if (
        budget == null ||
        termValue == null ||
        termValue <= 0 ||
        termUnit == null
      ) {
        continue;
      }

      // termInMonths
      const termInMonths =
        termUnit === "months" ? termValue : termValue * (12 / 52);

      if (termInMonths <= 0) continue;

      const monthlyValue = budget / termInMonths;

      // Deal span: starts on the first day of the month in which loggedAt falls
      const loggedDate = new Date(log.loggedAt);
      const dealStartYear = loggedDate.getUTCFullYear();
      const dealStartMonth = loggedDate.getUTCMonth(); // 0-based
      const dealStart = new Date(Date.UTC(dealStartYear, dealStartMonth, 1));

      // End: dealStart + termInMonths months (fractional months → floor for span check)
      // We add termInMonths to the start expressed as year+month offsets.
      // Use fractional month → total months from epoch for comparison.
      const dealStartTotalMonths = dealStartYear * 12 + dealStartMonth;
      const dealEndTotalMonths = dealStartTotalMonths + termInMonths;

      const targetTotalMonths = year * 12 + month;

      // Month M is within span if M >= dealStart month AND M < dealEnd month
      const withinSpan =
        targetTotalMonths >= dealStartTotalMonths &&
        targetTotalMonths < dealEndTotalMonths;

      if (!withinSpan) continue;

      if (outcome === "Yes") {
        soldAmount += monthlyValue;
        projectedAmount += monthlyValue * 0.95;
      } else if (confidence != null && confidence !== "") {
        const weight = CONFIDENCE_WEIGHTS[confidence];
        if (weight != null) {
          projectedAmount += weight * monthlyValue;
        }
      }
    }

    // Working days elapsed
    const today = new Date();
    const todayUTC = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
    );

    const monthEnd = new Date(Date.UTC(year, month + 1, 0)); // last day of month

    // For a historical month (month already passed), count all working days
    const refDay = todayUTC > monthEnd ? monthEnd : todayUTC;

    const workingDaysElapsed = countWorkingDays(targetMonthStart, refDay);
    const totalWorkingDays = countWorkingDays(
      targetMonthStart,
      new Date(Date.UTC(year, month + 1, 0))
    );

    let paceStatus: DashboardDTO["moneyPace"]["paceStatus"];
    let soldPercent: number;

    if (goalAmount === 0) {
      paceStatus = "behind";
      soldPercent = 0;
    } else {
      soldPercent = Math.round((soldAmount / goalAmount) * 100);
      const expectedAmount =
        goalAmount * (workingDaysElapsed / (totalWorkingDays || 1));

      if (soldAmount >= goalAmount) {
        paceStatus = "goal_reached";
      } else if (soldAmount >= expectedAmount) {
        paceStatus = "ahead";
      } else if (soldAmount + projectedAmount >= expectedAmount) {
        paceStatus = "on_pace";
      } else {
        paceStatus = "behind";
      }
    }

    // -------------------------------------------------------------------------
    // Activity Pace (Calls & Asks)
    // -------------------------------------------------------------------------

    const weekMonday = isoWeekMonday(weekYear, weekNumber);
    const weekFriday = new Date(weekMonday);
    weekFriday.setUTCDate(weekMonday.getUTCDate() + 4);

    // Filter logs in this week
    const weekLogs = repLogs.filter((log) => {
      const d = new Date(log.loggedAt);
      const dUTC = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      );
      return dUTC >= weekMonday && dUTC <= weekFriday;
    });

    const callCount = weekLogs.length;
    const askCount = weekLogs.filter(
      (log) => log.budget != null && log.budget !== undefined
    ).length;

    // Days remaining in week after today (Mon–Fri only)
    let daysRemainingInWeek = 0;
    if (todayUTC <= weekFriday) {
      // Days remaining = Mon–Fri days strictly after today through Friday
      const afterToday = new Date(todayUTC);
      afterToday.setUTCDate(todayUTC.getUTCDate() + 1);
      if (afterToday <= weekFriday) {
        daysRemainingInWeek = countWorkingDays(afterToday, weekFriday);
      }
    }

    // Working days elapsed in week (Mon through today, capped at 5)
    const weekElapsedEnd = todayUTC > weekFriday ? weekFriday : todayUTC;
    const workingDaysElapsedInWeek =
      todayUTC < weekMonday
        ? 0
        : countWorkingDays(weekMonday, weekElapsedEnd);

    const callExpected = weeklyCallTarget * (workingDaysElapsedInWeek / 5);
    const askExpected = weeklyAskTarget * (workingDaysElapsedInWeek / 5);

    const callPaceStatus: "on_pace" | "behind" =
      callCount >= callExpected ? "on_pace" : "behind";
    const askPaceStatus: "on_pace" | "behind" =
      askCount >= askExpected ? "on_pace" : "behind";

    return {
      moneyPace: {
        soldAmount,
        projectedAmount,
        goalAmount,
        soldPercent,
        paceStatus,
      },
      calls: {
        count: callCount,
        target: weeklyCallTarget,
        paceStatus: callPaceStatus,
      },
      asks: {
        count: askCount,
        target: weeklyAskTarget,
        paceStatus: askPaceStatus,
      },
      daysRemainingInWeek,
      weekNumber,
    };
  }
}

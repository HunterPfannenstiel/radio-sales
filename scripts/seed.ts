import { LocalBlobStore } from "../lib/blob/local.ts";
import { paths } from "../lib/blob/paths.ts";
import { BlobLogCallMutation } from "../server/mutations/LogCallMutation.ts";
import { BlobSetRepGoalMutation } from "../server/mutations/SetRepGoalMutation.ts";

// ---------------------------------------------------------------------------
// Config from environment
// ---------------------------------------------------------------------------

const REP_ID = process.env.CURRENT_REP_ID;
const REP_NAME = process.env.CURRENT_REP_NAME;

if (!REP_ID) throw new Error("CURRENT_REP_ID is not set in .env.local");
if (!REP_NAME) throw new Error("CURRENT_REP_NAME is not set in .env.local");

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

function nthWorkingDayOfMonth(year: number, month: number, n: number): Date {
  const date = new Date(Date.UTC(year, month, 1));
  let count = 0;
  while (true) {
    const dow = date.getUTCDay();
    if (dow >= 1 && dow <= 5) {
      count++;
      if (count === n) return new Date(date);
    }
    date.setUTCDate(date.getUTCDate() + 1);
  }
}

/** Monday of the ISO week containing the given date. */
function isoWeekMonday(date: Date): Date {
  const d = new Date(date);
  const dow = d.getUTCDay() || 7; // Sun=7
  d.setUTCDate(d.getUTCDate() - (dow - 1));
  d.setUTCHours(9, 0, 0, 0);
  return d;
}

/** Working days (Mon–Fri) only, offset from a Monday. */
function workingDayOffset(monday: Date, offset: number): Date {
  const d = new Date(monday);
  d.setUTCDate(d.getUTCDate() + offset);
  return d;
}

// ---------------------------------------------------------------------------
// Seed constants
// ---------------------------------------------------------------------------

const GOALS = {
  monthlyGoalAmount: 12_000,
  weeklyCallTarget: 15,
  weeklyAskTarget: 5,
};

const now = new Date();
const year = now.getUTCFullYear();
const month = now.getUTCMonth();

// Sold deals: logged on working days 1 and 2 of this month
const day1 = nthWorkingDayOfMonth(year, month, 1);
day1.setUTCHours(10, 0, 0, 0);
const day2 = nthWorkingDayOfMonth(year, month, 2);
day2.setUTCHours(14, 0, 0, 0);

// Pipeline calls: logged on working day 3 of this month
const day3 = nthWorkingDayOfMonth(year, month, 3);
day3.setUTCHours(11, 0, 0, 0);

// Previous month sold deals
const prevMonthYear = month === 0 ? year - 1 : year;
const prevMonth = month === 0 ? 11 : month - 1;
const prevDay1 = nthWorkingDayOfMonth(prevMonthYear, prevMonth, 1);
prevDay1.setUTCHours(10, 0, 0, 0);
const prevDay2 = nthWorkingDayOfMonth(prevMonthYear, prevMonth, 2);
prevDay2.setUTCHours(14, 0, 0, 0);

// Weekly activity: spread across Mon–Fri of the current ISO week
// If today is a weekend, use last week's Monday so logs fall in a completed week
const todayDow = now.getUTCDay();
const referenceDate = todayDow === 0 || todayDow === 6
  ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (todayDow === 0 ? 6 : todayDow - 1) - 7))
  : now;
const weekMon = isoWeekMonday(referenceDate);

// 16 call log timestamps: mix of Mon(4), Tue(4), Wed(3), Thu(3), Fri(2)
const WEEK_OFFSETS = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4];
const WEEK_HOURS = [9, 11, 14, 16, 9, 10, 13, 15, 9, 11, 14, 10, 13, 15, 9, 11];

const weekTimestamps = WEEK_OFFSETS.map((offset, i) => {
  const d = workingDayOffset(weekMon, offset);
  d.setUTCHours(WEEK_HOURS[i], 0, 0, 0);
  return d.toISOString();
});

// ---------------------------------------------------------------------------
// Call log definitions
// ---------------------------------------------------------------------------

type CallDef = {
  businessName: string;
  stage: string;
  whatNext: "followup_call" | "send_proposal" | "schedule_demo" | "send_contract" | "check_in";
  outcome: "yes" | "no" | "pending";
  budget?: number;
  termValue?: number;
  termUnit?: "weeks" | "months";
  confidence?: "in" | "sure" | "expect" | "hope";
  loggedAt: string;
};

// Two won deals (sold last month)
const PREV_MONTH_SOLD_CALLS: CallDef[] = [
  {
    businessName: "Lakeside Brewing",
    stage: "close",
    whatNext: "send_contract",
    outcome: "yes",
    budget: 5_400,
    termValue: 3,
    termUnit: "months",
    loggedAt: prevDay1.toISOString(),
  },
  {
    businessName: "Downtown Dental",
    stage: "close",
    whatNext: "send_contract",
    outcome: "yes",
    budget: 6_000,
    termValue: 2,
    termUnit: "months",
    loggedAt: prevDay2.toISOString(),
  },
];

// Two won deals (sold this month)
const SOLD_CALLS: CallDef[] = [
  {
    businessName: "McDonald's",
    stage: "close",
    whatNext: "send_contract",
    outcome: "yes",
    budget: 4_800,
    termValue: 4,
    termUnit: "months",
    loggedAt: day1.toISOString(),
  },
  {
    businessName: "Regional Auto Group",
    stage: "close",
    whatNext: "send_contract",
    outcome: "yes",
    budget: 7_500,
    termValue: 3,
    termUnit: "months",
    loggedAt: day2.toISOString(),
  },
];

// Three pipeline deals (pending)
const PIPELINE_CALLS: CallDef[] = [
  {
    businessName: "Sunrise Healthcare",
    stage: "present",
    whatNext: "followup_call",
    outcome: "pending",
    budget: 3_000,
    termValue: 3,
    termUnit: "months",
    confidence: "sure",
    loggedAt: day3.toISOString(),
  },
  {
    businessName: "The Pizza House",
    stage: "uncover",
    whatNext: "send_proposal",
    outcome: "pending",
    budget: 4_500,
    termValue: 3,
    termUnit: "months",
    confidence: "expect",
    loggedAt: day3.toISOString(),
  },
  {
    businessName: "City Toyota",
    stage: "approach",
    whatNext: "followup_call",
    outcome: "pending",
    budget: 6_000,
    termValue: 3,
    termUnit: "months",
    confidence: "hope",
    loggedAt: day3.toISOString(),
  },
];

// 16 activity calls this week — first 6 include budget asks, rest are touchpoints
const WEEKLY_BUSINESSES = [
  "McDonald's",
  "Regional Auto Group",
  "Sunrise Healthcare",
  "The Pizza House",
  "City Toyota",
  "Valley Ford",
  "Green Thumb Nursery",
  "Lakeview Dental",
  "Apex Fitness",
  "Harbor Insurance",
  "Main Street Bakery",
  "Summit Realty",
  "Blue River Brewing",
  "Northside Pharmacy",
  "Premier Roofing",
  "Westside Diner",
];

const WEEKLY_CALLS: CallDef[] = weekTimestamps.map((loggedAt, i) => {
  const withAsk = i < 6;
  return {
    businessName: WEEKLY_BUSINESSES[i],
    stage: "approach",
    whatNext: "followup_call",
    outcome: "pending",
    ...(withAsk
      ? { budget: 1_500 + i * 300, termValue: 3, termUnit: "months" as const, confidence: "hope" as const }
      : {}),
    loggedAt,
  };
});

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

const store = new LocalBlobStore();
const logCall = new BlobLogCallMutation();
const setRepGoal = new BlobSetRepGoalMutation();

async function run() {
  console.log("Wiping existing store...");
  await store.wipe();

  console.log("Setting rep goal...");
  await setRepGoal.execute({
    repId: REP_ID as string,
    ...GOALS,
    script: { repName: REP_NAME as string },
  });

  const allCalls = [...PREV_MONTH_SOLD_CALLS, ...SOLD_CALLS, ...PIPELINE_CALLS, ...WEEKLY_CALLS];
  console.log(`Seeding ${allCalls.length} call logs...`);

  for (const call of allCalls) {
    await logCall.execute({ repId: REP_ID as string, ...call });
  }

  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

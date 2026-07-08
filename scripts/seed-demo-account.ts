import { blob } from "../lib/blob";
import { paths } from "../lib/blob/paths";
import {
  type RepsIndex,
  type RepStore,
  type CallOutcome,
  type CallConfidence,
  type WhatNext,
  type TermUnit,
  CALL_CONFIDENCES,
  emptyRepStore,
} from "../lib/blob/schema";
import { type CurrentStage } from "../lib/types";
import { Mutations } from "../server/mutations";

// ---------------------------------------------------------------------------
// Demo account for the beta seminar — a single rep, no manager relationship.
// Wipes and reseeds the "Demo" account's goals + call log history every run
// so it can be rehearsed against repeatedly.
//
// Dates are computed relative to whenever this script runs (not hardcoded),
// so re-running it a week from now still produces "the last 6 months."
// ---------------------------------------------------------------------------

const REP_NAME = "Demo";
const REP_PIN = "1234";

const GOALS = {
  monthlyGoalAmount: 20_833,
  weeklyCallTarget: 20,
  weeklyAskTarget: 5,
};

const BUSINESSES = [
  "Anchor Diner", "Bowers Plumbing", "Cedar Auto Group", "Deacon Law",
  "Eastgate Credit Union", "Fenwick HVAC", "GraceMed Clinic", "Harbor Steakhouse",
  "INTRUST Bank", "Jasper Aircraft", "Kessler Heart Hospital", "Lindale Chevrolet",
  "Meridian Shopping Center", "Northstar Medical Center", "Oakhollow Federal Credit Union",
  "Pruitt Plumbing", "Quarry Auto & Truck", "Ridgeline Law Group", "Skyward Bank",
  "Towne Square Mall",
] as const;

type State = "over" | "under" | "on";

type CallDef = {
  businessName: string;
  stage: CurrentStage;
  whatNext: WhatNext;
  budget?: number;
  termValue?: number;
  termUnit?: TermUnit;
  confidence?: CallConfidence;
  outcome?: CallOutcome;
  loggedAt: Date;
};

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randPick<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

/** Shuffle a balanced array of `count` states (as even a 3-way split as possible). */
function shuffledStates(count: number): State[] {
  const cycle: State[] = ["over", "under", "on"];
  const states = Array.from({ length: count }, (_, i) => cycle[i % 3]);
  for (let i = states.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [states[i], states[j]] = [states[j], states[i]];
  }
  return states;
}

function utcDate(year: number, month: number, day: number, hour = 0): Date {
  return new Date(Date.UTC(year, month, day, hour));
}

function mondayOf(d: Date): Date {
  const dow = d.getUTCDay(); // 0 = Sun
  const diff = dow === 0 ? -6 : 1 - dow;
  return utcDate(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + diff);
}

/** Pick a random weekday (Mon-Fri) in [start, end] inclusive, at a random daytime hour. */
function randWeekday(start: Date, end: Date): Date {
  const days: Date[] = [];
  for (
    let cur = utcDate(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
    cur <= end;
    cur = utcDate(cur.getUTCFullYear(), cur.getUTCMonth(), cur.getUTCDate() + 1)
  ) {
    const dow = cur.getUTCDay();
    if (dow >= 1 && dow <= 5) days.push(cur);
  }
  const day = days.length ? randPick(days) : start;
  return utcDate(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), randInt(9, 16));
}

/** Split `total` into `parts` positive amounts (rounded to the nearest 100). */
function splitAmount(total: number, parts: number): number[] {
  const cuts = Array.from({ length: parts - 1 }, () => randInt(1, total - 1)).sort((a, b) => a - b);
  const raw: number[] = [];
  let prev = 0;
  for (const c of cuts) {
    raw.push(c - prev);
    prev = c;
  }
  raw.push(total - prev);
  return raw.map((a) => Math.max(500, Math.round(a / 100) * 100));
}

// ---------------------------------------------------------------------------
// Build the 6-month window (oldest -> current, partial) and weekly buckets
// ---------------------------------------------------------------------------

const now = new Date();
const today = utcDate(now.getFullYear(), now.getMonth(), now.getDate());
const currentMonthStart = utcDate(today.getUTCFullYear(), today.getUTCMonth(), 1);

const MONTHS = Array.from({ length: 6 }, (_, i) => {
  const offset = 5 - i; // oldest first
  const d = utcDate(currentMonthStart.getUTCFullYear(), currentMonthStart.getUTCMonth() - offset, 1);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
});

const windowStart = utcDate(MONTHS[0].year, MONTHS[0].month, 1);

// ---------------------------------------------------------------------------
// Monthly revenue calls — closed ("actual") deals sized to land the month
// over/under/on the monthly goal, plus a couple of pending ("projected")
// pipeline calls per month for confidence-driven variety.
// ---------------------------------------------------------------------------

const calls: CallDef[] = [];

const monthStates = shuffledStates(MONTHS.length);

for (let mi = 0; mi < MONTHS.length; mi++) {
  const { year, month } = MONTHS[mi];
  const isCurrentMonth = mi === MONTHS.length - 1;
  const monthStart = utcDate(year, month, 1);
  const monthEnd = isCurrentMonth ? today : utcDate(year, month + 1, 0);

  const state = monthStates[mi];
  const targetSum =
    state === "over" ? randInt(25_000, 30_000)
    : state === "under" ? randInt(11_500, 16_500)
    : randInt(20_200, 21_400);

  const dealCount = randInt(2, 4);
  for (const amount of splitAmount(targetSum, dealCount)) {
    calls.push({
      businessName: randPick(BUSINESSES),
      stage: "close",
      whatNext: "send_contract",
      budget: amount,
      termValue: 1,
      termUnit: "months",
      outcome: "yes",
      loggedAt: randWeekday(monthStart, monthEnd),
    });
  }

  const pipelineCount = randInt(1, 2);
  for (let p = 0; p < pipelineCount; p++) {
    calls.push({
      businessName: randPick(BUSINESSES),
      stage: randPick(["uncover", "present"] as const),
      whatNext: randPick(["send_proposal", "followup_call"] as const),
      budget: randInt(1_500, 6_000),
      termValue: randPick([1, 2, 3]),
      termUnit: "months",
      confidence: randPick(CALL_CONFIDENCES),
      outcome: "pending",
      loggedAt: randWeekday(monthStart, monthEnd),
    });
  }
}

// ---------------------------------------------------------------------------
// Weekly activity — plain calls fill the weekly call target, a subset of
// which carry a budget ("asks") to independently fill the weekly ask target.
// The revenue calls above already contribute calls/asks to whichever week
// they landed in, so fill only the remainder.
// ---------------------------------------------------------------------------

const weekBuckets: { monday: Date; days: Date[] }[] = [];
{
  const seen = new Map<string, Date[]>();
  for (
    let cur = new Date(windowStart);
    cur <= today;
    cur = utcDate(cur.getUTCFullYear(), cur.getUTCMonth(), cur.getUTCDate() + 1)
  ) {
    const dow = cur.getUTCDay();
    if (dow < 1 || dow > 5) continue;
    const key = mondayOf(cur).toISOString();
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key)!.push(cur);
  }
  for (const [key, days] of [...seen.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    weekBuckets.push({ monday: new Date(key), days });
  }
}

const callStates = shuffledStates(weekBuckets.length);
const askStates = shuffledStates(weekBuckets.length);

function bandFor(state: State, target: number, over: [number, number], under: [number, number]): number {
  if (state === "over") return target + randInt(over[0], over[1]);
  if (state === "under") return Math.max(0, target - randInt(under[0], under[1]));
  return target + randInt(0, 1);
}

for (let wi = 0; wi < weekBuckets.length; wi++) {
  const { monday, days } = weekBuckets[wi];
  const friday = utcDate(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate() + 4);

  const existing = calls.filter((c) => c.loggedAt >= monday && c.loggedAt <= friday);
  const existingCalls = existing.length;
  const existingAsks = existing.filter((c) => c.budget != null).length;

  const targetCalls = bandFor(callStates[wi], GOALS.weeklyCallTarget, [8, 12], [5, 10]);
  const targetAsks = Math.min(
    bandFor(askStates[wi], GOALS.weeklyAskTarget, [3, 5], [1, 3]),
    targetCalls
  );

  const remainingCalls = Math.max(0, targetCalls - existingCalls);
  const remainingAsks = Math.min(remainingCalls, Math.max(0, targetAsks - existingAsks));

  for (let i = 0; i < remainingCalls; i++) {
    const isAsk = i < remainingAsks;
    const day = randPick(days);
    calls.push({
      businessName: randPick(BUSINESSES),
      stage: isAsk ? randPick(["uncover", "present"] as const) : randPick(["approach", "service"] as const),
      whatNext: isAsk
        ? randPick(["send_proposal", "send_spec_spot", "set_appointment"] as const)
        : randPick(["followup_call", "check_in"] as const),
      budget: isAsk ? randInt(600, 3_000) : undefined,
      loggedAt: utcDate(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), randInt(9, 16)),
    });
  }
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

async function run() {
  const index: RepsIndex = (await blob.read<RepsIndex>(paths.repsIndex)) ?? { reps: [] };
  const nameLower = REP_NAME.toLowerCase();
  let rep = index.reps.find((r) => r.name.toLowerCase() === nameLower);

  if (!rep) {
    rep = { id: crypto.randomUUID(), name: REP_NAME, pin: REP_PIN };
    index.reps.push(rep);
    await blob.write(paths.repsIndex, index);
  } else if (rep.pin !== REP_PIN) {
    rep.pin = REP_PIN;
    await blob.write(paths.repsIndex, index);
  }

  console.log(`Resetting store for "${rep.name}" (${rep.id})...`);
  await blob.write(paths.repStore(rep.id), emptyRepStore() satisfies RepStore);

  await Mutations.setRepGoal.execute({ repId: rep.id, ...GOALS });

  console.log(`Logging ${calls.length} calls across ${MONTHS.length} months...`);
  for (const call of calls) {
    await Mutations.logCall.execute({
      repId: rep.id,
      businessName: call.businessName,
      stage: call.stage,
      whatNext: call.whatNext,
      budget: call.budget,
      termValue: call.termValue,
      termUnit: call.termUnit,
      confidence: call.confidence,
      outcome: call.outcome,
      loggedAt: call.loggedAt.toISOString(),
    });
  }

  const businessCount = new Set(calls.map((c) => c.businessName.toLowerCase())).size;
  console.log(`Done. ${businessCount} businesses, ${calls.length} call logs.`);
  console.log(`Sign in with name "${rep.name}" and PIN "${rep.pin}".`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { LocalBlobStore } from "../lib/blob/local.ts";
import { paths } from "../lib/blob/paths.ts";
import { BlobLogCallMutation } from "../server/mutations/LogCallMutation.ts";
import { BlobSetRepGoalMutation } from "../server/mutations/SetRepGoalMutation.ts";

const REP_ID = process.env.CURRENT_REP_ID;
const REP_NAME = process.env.CURRENT_REP_NAME;
if (!REP_ID) throw new Error("CURRENT_REP_ID is not set in .env.local");
if (!REP_NAME) throw new Error("CURRENT_REP_NAME is not set in .env.local");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function iso(month: number, day: number, hour = 10): string {
  return new Date(Date.UTC(2026, month - 1, day, hour, 0, 0)).toISOString();
}

// ---------------------------------------------------------------------------
// Goals
// ---------------------------------------------------------------------------

const GOALS = {
  monthlyGoalAmount: 12_000,
  weeklyCallTarget: 15,
  weeklyAskTarget: 5,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type WhatNext = "followup_call" | "send_proposal" | "schedule_demo" | "send_contract" | "check_in";
type Confidence = "in" | "sure" | "expect" | "hope";
type Outcome = "yes" | "no" | "pending";
type TermUnit = "weeks" | "months";

type CallDef = {
  businessName: string;
  stage: string;
  whatNext: WhatNext;
  budget?: number;
  termValue?: number;
  termUnit?: TermUnit;
  confidence?: Confidence;
  outcome?: Outcome;
  loggedAt: string;
};

// ---------------------------------------------------------------------------
// January 2026 — Way behind (~$4,200 of $12k goal)
// ---------------------------------------------------------------------------

const JAN: CallDef[] = [
  // Won deals
  { businessName: "Doo-Dah Diner", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 2_400, termValue: 1, termUnit: "months", loggedAt: iso(1, 5, 10) },
  { businessName: "Eck Services", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 1_800, termValue: 1, termUnit: "months", loggedAt: iso(1, 9, 14) },

  // Pipeline
  { businessName: "Don Hattan Chevrolet", stage: "present", whatNext: "followup_call", outcome: "pending", budget: 6_000, termValue: 3, termUnit: "months", confidence: "expect", loggedAt: iso(1, 15, 11) },
  { businessName: "INTRUST Bank", stage: "uncover", whatNext: "send_proposal", outcome: "pending", budget: 4_800, termValue: 1, termUnit: "months", confidence: "sure", loggedAt: iso(1, 20, 14) },
  { businessName: "Spirit AeroSystems", stage: "approach", whatNext: "followup_call", outcome: "pending", budget: 3_600, termValue: 2, termUnit: "months", confidence: "hope", loggedAt: iso(1, 22, 9) },

  // Activity — Week 1 (Jan 5–9)
  { businessName: "Davis-Moore Auto Group", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 5, 14) },
  { businessName: "Super Car Guys", stage: "approach", whatNext: "followup_call", budget: 2_400, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(1, 6, 9) },
  { businessName: "Fahnestock HVAC", stage: "approach", whatNext: "followup_call", budget: 1_800, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(1, 6, 13) },
  { businessName: "Siena Steakhouse", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 7, 10) },
  { businessName: "Towne East Square", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 7, 15) },
  { businessName: "Meritrust Credit Union", stage: "approach", whatNext: "followup_call", budget: 3_000, termValue: 2, termUnit: "months", confidence: "hope", loggedAt: iso(1, 8, 10) },
  { businessName: "Martin Pringle Law", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 8, 14) },
  { businessName: "Wesley Medical Center", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 9, 9) },

  // Activity — Week 2 (Jan 12–16)
  { businessName: "Bowers Plumbing", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 12, 9) },
  { businessName: "Donovan Auto & Truck Center", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 12, 13) },
  { businessName: "American Services", stage: "approach", whatNext: "followup_call", budget: 1_800, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(1, 13, 10) },
  { businessName: "The Anchor", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 13, 14) },
  { businessName: "Skyward Credit Union", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 14, 9) },
  { businessName: "GraceMed Health Clinic", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 15, 9) },

  // Activity — Week 3 (Jan 20–23, MLK Day the 19th)
  { businessName: "Hunter Health Clinic", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 20, 9) },
  { businessName: "Pizza Hut Corporate", stage: "approach", whatNext: "followup_call", budget: 2_400, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(1, 21, 11) },
  { businessName: "Kansas Heart Hospital", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 22, 13) },
  { businessName: "Wichita Federal Credit Union", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 23, 9) },

  // Activity — Week 4 (Jan 26–30)
  { businessName: "Doo-Dah Diner", stage: "check_in", whatNext: "check_in", loggedAt: iso(1, 26, 10) },
  { businessName: "Don Hattan Chevrolet", stage: "present", whatNext: "followup_call", loggedAt: iso(1, 27, 9) },
  { businessName: "Cessna Aircraft", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 27, 14) },
  { businessName: "Morris Laing Law", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 28, 11) },
  { businessName: "Bradley Fair Shopping Center", stage: "approach", whatNext: "followup_call", loggedAt: iso(1, 29, 9) },
  { businessName: "Eck Services", stage: "check_in", whatNext: "check_in", loggedAt: iso(1, 30, 10) },
];

// ---------------------------------------------------------------------------
// February 2026 — Almost there (~$10,800 of $12k goal)
// ---------------------------------------------------------------------------

const FEB: CallDef[] = [
  // Won deals
  { businessName: "INTRUST Bank", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 4_800, termValue: 1, termUnit: "months", loggedAt: iso(2, 4, 10) },
  { businessName: "Davis-Moore Auto Group", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 3_600, termValue: 1, termUnit: "months", loggedAt: iso(2, 11, 11) },
  { businessName: "American Services", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 2_400, termValue: 1, termUnit: "months", loggedAt: iso(2, 18, 14) },

  // Pipeline
  { businessName: "Don Hattan Chevrolet", stage: "present", whatNext: "schedule_demo", outcome: "pending", budget: 6_000, termValue: 3, termUnit: "months", confidence: "sure", loggedAt: iso(2, 10, 11) },
  { businessName: "Meritrust Credit Union", stage: "present", whatNext: "send_proposal", outcome: "pending", budget: 4_800, termValue: 2, termUnit: "months", confidence: "expect", loggedAt: iso(2, 17, 10) },
  { businessName: "Super Car Guys", stage: "uncover", whatNext: "send_proposal", outcome: "pending", budget: 3_000, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(2, 24, 9) },

  // Activity — Week 1 (Feb 2–6)
  { businessName: "Kansas Heart Hospital", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 2, 9) },
  { businessName: "Spirit AeroSystems", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 3, 10) },
  { businessName: "Siena Steakhouse", stage: "approach", whatNext: "followup_call", budget: 2_400, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(2, 3, 14) },
  { businessName: "Fahnestock HVAC", stage: "uncover", whatNext: "send_proposal", budget: 2_400, termValue: 2, termUnit: "months", confidence: "hope", loggedAt: iso(2, 4, 14) },
  { businessName: "Martin Pringle Law", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 5, 9) },
  { businessName: "Towne East Square", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 5, 14) },
  { businessName: "Bowers Plumbing", stage: "approach", whatNext: "followup_call", budget: 1_800, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(2, 6, 10) },

  // Activity — Week 2 (Feb 9–13)
  { businessName: "Hunter Health Clinic", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 9, 9) },
  { businessName: "INTRUST Bank", stage: "present", whatNext: "followup_call", loggedAt: iso(2, 10, 9) },
  { businessName: "Cessna Aircraft", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 10, 14) },
  { businessName: "GraceMed Health Clinic", stage: "approach", whatNext: "followup_call", budget: 1_800, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(2, 11, 14) },
  { businessName: "The Anchor", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 12, 9) },
  { businessName: "Wichita Federal Credit Union", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 13, 10) },
  { businessName: "Donovan Auto & Truck Center", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 13, 14) },

  // Activity — Week 3 (Feb 17–20, Presidents Day the 16th)
  { businessName: "Davis-Moore Auto Group", stage: "close", whatNext: "send_contract", loggedAt: iso(2, 17, 9) },
  { businessName: "Wesley Medical Center", stage: "present", whatNext: "followup_call", budget: 3_600, termValue: 2, termUnit: "months", confidence: "expect", loggedAt: iso(2, 18, 9) },
  { businessName: "Skyward Credit Union", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 19, 10) },
  { businessName: "Morris Laing Law", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 20, 9) },

  // Activity — Week 4 (Feb 23–27)
  { businessName: "Pizza Hut Corporate", stage: "approach", whatNext: "followup_call", budget: 2_400, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(2, 23, 10) },
  { businessName: "American Services", stage: "check_in", whatNext: "check_in", loggedAt: iso(2, 24, 11) },
  { businessName: "Bradley Fair Shopping Center", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 25, 9) },
  { businessName: "Doo-Dah Diner", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 25, 14) },
  { businessName: "Spirit AeroSystems", stage: "uncover", whatNext: "send_proposal", budget: 3_600, termValue: 2, termUnit: "months", confidence: "hope", loggedAt: iso(2, 26, 10) },
  { businessName: "Eck Services", stage: "approach", whatNext: "followup_call", loggedAt: iso(2, 27, 9) },
];

// ---------------------------------------------------------------------------
// March 2026 — Spot on, great month (~$13,200 of $12k goal)
// ---------------------------------------------------------------------------

const MAR: CallDef[] = [
  // Won deals
  { businessName: "Don Hattan Chevrolet", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 6_000, termValue: 1, termUnit: "months", loggedAt: iso(3, 3, 10) },
  { businessName: "Meritrust Credit Union", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 3_600, termValue: 1, termUnit: "months", loggedAt: iso(3, 10, 11) },
  { businessName: "Martin Pringle Law", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 2_400, termValue: 1, termUnit: "months", loggedAt: iso(3, 17, 14) },
  { businessName: "Siena Steakhouse", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 1_200, termValue: 1, termUnit: "months", loggedAt: iso(3, 25, 10) },

  // Pipeline
  { businessName: "Fahnestock HVAC", stage: "present", whatNext: "schedule_demo", outcome: "pending", budget: 4_800, termValue: 3, termUnit: "months", confidence: "sure", loggedAt: iso(3, 12, 10) },
  { businessName: "Wesley Medical Center", stage: "present", whatNext: "send_proposal", outcome: "pending", budget: 3_600, termValue: 2, termUnit: "months", confidence: "expect", loggedAt: iso(3, 19, 9) },
  { businessName: "Cessna Aircraft", stage: "uncover", whatNext: "followup_call", outcome: "pending", budget: 6_000, termValue: 3, termUnit: "months", confidence: "hope", loggedAt: iso(3, 26, 11) },

  // Activity — Week 1 (Mar 2–6)
  { businessName: "Kansas Heart Hospital", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 2, 9) },
  { businessName: "Bowers Plumbing", stage: "approach", whatNext: "followup_call", budget: 2_400, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(3, 2, 14) },
  { businessName: "Super Car Guys", stage: "uncover", whatNext: "send_proposal", budget: 3_000, termValue: 1, termUnit: "months", confidence: "expect", loggedAt: iso(3, 3, 14) },
  { businessName: "Hunter Health Clinic", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 4, 9) },
  { businessName: "Donovan Auto & Truck Center", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 4, 13) },
  { businessName: "GraceMed Health Clinic", stage: "approach", whatNext: "followup_call", budget: 1_800, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(3, 5, 10) },
  { businessName: "Morris Laing Law", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 5, 14) },
  { businessName: "Skyward Credit Union", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 6, 9) },

  // Activity — Week 2 (Mar 9–13)
  { businessName: "American Services", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 9, 9) },
  { businessName: "The Anchor", stage: "approach", whatNext: "followup_call", budget: 2_400, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(3, 9, 14) },
  { businessName: "Bradley Fair Shopping Center", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 10, 9) },
  { businessName: "Davis-Moore Auto Group", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 11, 10) },
  { businessName: "Towne East Square", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 11, 14) },
  { businessName: "Spirit AeroSystems", stage: "present", whatNext: "followup_call", budget: 3_600, termValue: 2, termUnit: "months", confidence: "expect", loggedAt: iso(3, 12, 14) },
  { businessName: "Pizza Hut Corporate", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 13, 9) },
  { businessName: "Wichita Federal Credit Union", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 13, 14) },

  // Activity — Week 3 (Mar 16–20)
  { businessName: "Eck Services", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 16, 9) },
  { businessName: "INTRUST Bank", stage: "check_in", whatNext: "check_in", loggedAt: iso(3, 16, 14) },
  { businessName: "Don Hattan Chevrolet", stage: "check_in", whatNext: "check_in", loggedAt: iso(3, 17, 9) },
  { businessName: "Doo-Dah Diner", stage: "approach", whatNext: "followup_call", budget: 2_400, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(3, 18, 10) },
  { businessName: "Davis-Moore Auto Group", stage: "uncover", whatNext: "send_proposal", budget: 3_600, termValue: 2, termUnit: "months", confidence: "hope", loggedAt: iso(3, 19, 13) },
  { businessName: "Kansas Heart Hospital", stage: "uncover", whatNext: "send_proposal", budget: 6_000, termValue: 3, termUnit: "months", confidence: "sure", loggedAt: iso(3, 20, 10) },

  // Activity — Week 4 (Mar 23–27)
  { businessName: "Bowers Plumbing", stage: "uncover", whatNext: "send_proposal", budget: 2_400, termValue: 1, termUnit: "months", confidence: "expect", loggedAt: iso(3, 23, 9) },
  { businessName: "Hunter Health Clinic", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 23, 14) },
  { businessName: "Donovan Auto & Truck Center", stage: "approach", whatNext: "followup_call", budget: 4_800, termValue: 2, termUnit: "months", confidence: "hope", loggedAt: iso(3, 24, 10) },
  { businessName: "GraceMed Health Clinic", stage: "approach", whatNext: "followup_call", loggedAt: iso(3, 25, 14) },
  { businessName: "Super Car Guys", stage: "present", whatNext: "schedule_demo", budget: 3_000, termValue: 1, termUnit: "months", confidence: "expect", loggedAt: iso(3, 26, 9) },
  { businessName: "Skyward Credit Union", stage: "approach", whatNext: "followup_call", budget: 1_800, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(3, 27, 10) },
];

// ---------------------------------------------------------------------------
// April 2026 — Way behind (~$3,600 of $12k goal)
// ---------------------------------------------------------------------------

const APR: CallDef[] = [
  // Won deals
  { businessName: "Bowers Plumbing", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 2_400, termValue: 1, termUnit: "months", loggedAt: iso(4, 7, 10) },
  { businessName: "Fahnestock HVAC", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 1_200, termValue: 1, termUnit: "months", loggedAt: iso(4, 14, 11) },

  // Pipeline
  { businessName: "Kansas Heart Hospital", stage: "present", whatNext: "send_proposal", outcome: "pending", budget: 6_000, termValue: 3, termUnit: "months", confidence: "sure", loggedAt: iso(4, 8, 10) },
  { businessName: "Donovan Auto & Truck Center", stage: "present", whatNext: "followup_call", outcome: "pending", budget: 4_800, termValue: 2, termUnit: "months", confidence: "expect", loggedAt: iso(4, 15, 9) },
  { businessName: "Cessna Aircraft", stage: "uncover", whatNext: "send_proposal", outcome: "pending", budget: 6_000, termValue: 3, termUnit: "months", confidence: "hope", loggedAt: iso(4, 22, 10) },

  // Activity — Week 1 (Apr 1–3)
  { businessName: "Spirit AeroSystems", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 1, 9) },
  { businessName: "Morris Laing Law", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 1, 14) },
  { businessName: "Wesley Medical Center", stage: "present", whatNext: "followup_call", budget: 3_600, termValue: 2, termUnit: "months", confidence: "hope", loggedAt: iso(4, 2, 10) },
  { businessName: "Pizza Hut Corporate", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 3, 9) },

  // Activity — Week 2 (Apr 6–10)
  { businessName: "INTRUST Bank", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 6, 9) },
  { businessName: "Super Car Guys", stage: "approach", whatNext: "followup_call", budget: 3_000, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(4, 7, 14) },
  { businessName: "Eck Services", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 8, 14) },
  { businessName: "The Anchor", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 9, 9) },
  { businessName: "Davis-Moore Auto Group", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 10, 10) },

  // Activity — Week 3 (Apr 13–17)
  { businessName: "Doo-Dah Diner", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 13, 9) },
  { businessName: "American Services", stage: "approach", whatNext: "followup_call", budget: 1_800, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(4, 14, 9) },
  { businessName: "Skyward Credit Union", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 15, 13) },
  { businessName: "Siena Steakhouse", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 16, 10) },

  // Activity — Week 4 (Apr 20–24)
  { businessName: "GraceMed Health Clinic", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 20, 9) },
  { businessName: "Bradley Fair Shopping Center", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 21, 10) },
  { businessName: "Hunter Health Clinic", stage: "approach", whatNext: "followup_call", budget: 1_800, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(4, 22, 14) },
  { businessName: "Wichita Federal Credit Union", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 23, 9) },
  { businessName: "Towne East Square", stage: "approach", whatNext: "followup_call", loggedAt: iso(4, 24, 10) },
];

// ---------------------------------------------------------------------------
// May 2026 — Almost there (~$11,400 of $12k goal)
// ---------------------------------------------------------------------------

const MAY: CallDef[] = [
  // Won deals
  { businessName: "Kansas Heart Hospital", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 4_800, termValue: 1, termUnit: "months", loggedAt: iso(5, 5, 10) },
  { businessName: "Donovan Auto & Truck Center", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 3_600, termValue: 1, termUnit: "months", loggedAt: iso(5, 12, 11) },
  { businessName: "Skyward Credit Union", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 1_800, termValue: 1, termUnit: "months", loggedAt: iso(5, 19, 14) },
  { businessName: "Hunter Health Clinic", stage: "close", whatNext: "send_contract", outcome: "yes", budget: 1_200, termValue: 1, termUnit: "months", loggedAt: iso(5, 29, 10) },

  // Pipeline — open at end of May, carrying into June
  { businessName: "The Anchor", stage: "present", whatNext: "send_proposal", outcome: "pending", budget: 3_600, termValue: 2, termUnit: "months", confidence: "sure", loggedAt: iso(5, 13, 9) },
  { businessName: "Morris Laing Law", stage: "present", whatNext: "followup_call", outcome: "pending", budget: 4_800, termValue: 1, termUnit: "months", confidence: "expect", loggedAt: iso(5, 20, 10) },
  { businessName: "Super Car Guys", stage: "uncover", whatNext: "send_proposal", outcome: "pending", budget: 3_600, termValue: 2, termUnit: "months", confidence: "hope", loggedAt: iso(5, 28, 9) },

  // Activity — Week 1 (May 1)
  { businessName: "Don Hattan Chevrolet", stage: "approach", whatNext: "followup_call", loggedAt: iso(5, 1, 9) },

  // Activity — Week 2 (May 4–8)
  { businessName: "INTRUST Bank", stage: "approach", whatNext: "followup_call", loggedAt: iso(5, 4, 9) },
  { businessName: "Davis-Moore Auto Group", stage: "approach", whatNext: "followup_call", budget: 3_600, termValue: 2, termUnit: "months", confidence: "hope", loggedAt: iso(5, 4, 14) },
  { businessName: "GraceMed Health Clinic", stage: "approach", whatNext: "followup_call", loggedAt: iso(5, 5, 14) },
  { businessName: "Spirit AeroSystems", stage: "approach", whatNext: "followup_call", budget: 3_600, termValue: 2, termUnit: "months", confidence: "hope", loggedAt: iso(5, 6, 10) },
  { businessName: "Bradley Fair Shopping Center", stage: "approach", whatNext: "followup_call", loggedAt: iso(5, 6, 14) },
  { businessName: "Cessna Aircraft", stage: "present", whatNext: "schedule_demo", budget: 6_000, termValue: 3, termUnit: "months", confidence: "expect", loggedAt: iso(5, 7, 9) },
  { businessName: "Wesley Medical Center", stage: "approach", whatNext: "followup_call", loggedAt: iso(5, 7, 14) },
  { businessName: "Siena Steakhouse", stage: "approach", whatNext: "followup_call", loggedAt: iso(5, 8, 9) },

  // Activity — Week 3 (May 11–15)
  { businessName: "Fahnestock HVAC", stage: "check_in", whatNext: "check_in", loggedAt: iso(5, 11, 9) },
  { businessName: "Bowers Plumbing", stage: "check_in", whatNext: "check_in", loggedAt: iso(5, 11, 14) },
  { businessName: "Doo-Dah Diner", stage: "approach", whatNext: "followup_call", budget: 2_400, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(5, 12, 9) },
  { businessName: "Donovan Auto & Truck Center", stage: "close", whatNext: "send_contract", loggedAt: iso(5, 12, 9) },
  { businessName: "American Services", stage: "approach", whatNext: "followup_call", loggedAt: iso(5, 13, 14) },
  { businessName: "Towne East Square", stage: "approach", whatNext: "followup_call", loggedAt: iso(5, 14, 9) },
  { businessName: "Pizza Hut Corporate", stage: "approach", whatNext: "followup_call", budget: 2_400, termValue: 1, termUnit: "months", confidence: "hope", loggedAt: iso(5, 15, 10) },

  // Activity — Week 4 (May 18–22)
  { businessName: "Wichita Federal Credit Union", stage: "approach", whatNext: "followup_call", loggedAt: iso(5, 18, 9) },
  { businessName: "Meritrust Credit Union", stage: "approach", whatNext: "followup_call", budget: 3_600, termValue: 2, termUnit: "months", confidence: "hope", loggedAt: iso(5, 18, 14) },
  { businessName: "Eck Services", stage: "approach", whatNext: "followup_call", loggedAt: iso(5, 19, 9) },
  { businessName: "Kansas Heart Hospital", stage: "check_in", whatNext: "check_in", loggedAt: iso(5, 20, 14) },
  { businessName: "The Anchor", stage: "present", whatNext: "send_proposal", loggedAt: iso(5, 21, 9) },
  { businessName: "Morris Laing Law", stage: "uncover", whatNext: "send_proposal", loggedAt: iso(5, 22, 10) },

  // Activity — Week 5 (May 26–29, Memorial Day the 25th)
  { businessName: "Don Hattan Chevrolet", stage: "approach", whatNext: "followup_call", loggedAt: iso(5, 26, 9) },
  { businessName: "Super Car Guys", stage: "uncover", whatNext: "send_proposal", loggedAt: iso(5, 27, 10) },
  { businessName: "Spirit AeroSystems", stage: "present", whatNext: "followup_call", budget: 4_200, termValue: 2, termUnit: "months", confidence: "expect", loggedAt: iso(5, 28, 14) },
  { businessName: "Hunter Health Clinic", stage: "close", whatNext: "send_contract", loggedAt: iso(5, 29, 14) },
];

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

  const allCalls = [...JAN, ...FEB, ...MAR, ...APR, ...MAY];
  console.log(`Seeding ${allCalls.length} call logs across Jan–May 2026...`);

  for (const call of allCalls) {
    await logCall.execute({ repId: REP_ID as string, ...call });
  }

  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

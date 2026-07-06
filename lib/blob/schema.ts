export const CALL_OUTCOMES = ["yes", "no", "pending"] as const;
export type CallOutcome = typeof CALL_OUTCOMES[number];

export const CALL_CONFIDENCES = ["in", "sure", "expect", "hope"] as const;
export type CallConfidence = typeof CALL_CONFIDENCES[number];

export const WHAT_NEXT_OPTIONS = ["followup_call", "send_spec_spot", "send_proposal", "set_appointment", "send_contract", "check_in"] as const;
export type WhatNext = typeof WHAT_NEXT_OPTIONS[number];

export const TERM_UNITS = ["weeks", "months"] as const;
export type TermUnit = typeof TERM_UNITS[number];

export type RepsIndex = {
  reps: { id: string; name: string; pin: string }[];
};

export type RepStore = {
  businesses: {
    id: string;
    name: string;
    createdAt: string;
    nextStep?: string;
    nextStepUpdatedAt?: string;
  }[];
  callLogs: {
    id: string;
    businessId: string;
    stage: string;
    whatNext: WhatNext;
    budget?: number;
    termValue?: number;
    termUnit?: TermUnit;
    confidence?: CallConfidence;
    outcome?: CallOutcome;
    loggedAt: string;
  }[];
  repGoals: {
    monthlyGoalAmount: number;
    weeklyCallTarget: number;
    weeklyAskTarget: number;
  } | null;
};

export const emptyRepStore = (): RepStore => ({ businesses: [], callLogs: [], repGoals: null });

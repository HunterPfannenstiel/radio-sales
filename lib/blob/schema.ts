export type Store = {
  reps: { id: string; name: string }[];
  businesses: {
    id: string;
    repId: string;
    name: string;
    createdAt: string;
    nextStep?: string;
    nextStepUpdatedAt?: string;
  }[];
  callLogs: {
    id: string;
    repId: string;
    businessId: string;
    stage: string;
    whatNext: "followup_call" | "send_proposal" | "schedule_demo" | "send_contract" | "check_in";
    budget?: number;
    termValue?: number;
    termUnit?: "weeks" | "months";
    confidence?: string;
    outcome: "sold" | "not_sold" | "follow_up";
    loggedAt: string;
  }[];
  repGoals: {
    repId: string;
    monthlyGoalAmount: number;
    weeklyCallTarget: number;
    weeklyAskTarget: number;
  }[];
};

export const emptyStore = (): Store => ({
  reps: [],
  businesses: [],
  callLogs: [],
  repGoals: [],
});

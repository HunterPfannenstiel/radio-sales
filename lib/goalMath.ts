export const CLOSING_RATIO = 0.3;
export const WORK_WEEKS_PER_YEAR = 50;

export type StaticWeeklyTargets = {
  weeklyCloseTarget: number;
  weeklyPresentTarget: number;
};

export function computeStaticWeeklyTargets(params: {
  monthlyGoalAmount: number;
}): StaticWeeklyTargets {
  const { monthlyGoalAmount } = params;
  if (!monthlyGoalAmount || monthlyGoalAmount <= 0) {
    return { weeklyCloseTarget: 0, weeklyPresentTarget: 0 };
  }
  const annualGoalAmount = monthlyGoalAmount * 12;
  const weeklyCloseTarget = annualGoalAmount / WORK_WEEKS_PER_YEAR;
  const weeklyPresentTarget = weeklyCloseTarget / CLOSING_RATIO;
  return { weeklyCloseTarget, weeklyPresentTarget };
}

import { blob } from "../../lib/blob/index.ts";
import { paths } from "../../lib/blob/paths.ts";

type Store = {
  reps: { id: string; name: string }[];
  businesses: { id: string; repId: string; name: string; createdAt: string }[];
  callLogs: unknown[];
  repGoals: {
    repId: string;
    monthlyGoalAmount: number;
    weeklyCallTarget: number;
    weeklyAskTarget: number;
  }[];
};

const emptyStore = (): Store => ({
  reps: [],
  businesses: [],
  callLogs: [],
  repGoals: [],
});

export type SetRepGoalPayload = {
  repId: string;
  monthlyGoalAmount: number;
  weeklyCallTarget: number;
  weeklyAskTarget: number;
  script?: {
    repName?: string;
  };
};

export interface ISetRepGoalMutation {
  execute(payload: SetRepGoalPayload): Promise<void>;
}

export class BlobSetRepGoalMutation implements ISetRepGoalMutation {
  async execute(payload: SetRepGoalPayload): Promise<void> {
    const { repId, monthlyGoalAmount, weeklyCallTarget, weeklyAskTarget } =
      payload;

    const store: Store = (await blob.read<Store>(paths.store)) ?? emptyStore();

    // Upsert rep record (only sets name if provided via script)
    const repName = payload.script?.repName;
    const existingRep = store.reps.find((r) => r.id === repId);
    if (existingRep) {
      if (repName) existingRep.name = repName;
    } else {
      store.reps.push({ id: repId, name: repName ?? "Rep" });
    }

    // Upsert goal
    const existingGoal = store.repGoals.find((g) => g.repId === repId);
    if (existingGoal) {
      existingGoal.monthlyGoalAmount = monthlyGoalAmount;
      existingGoal.weeklyCallTarget = weeklyCallTarget;
      existingGoal.weeklyAskTarget = weeklyAskTarget;
    } else {
      store.repGoals.push({
        repId,
        monthlyGoalAmount,
        weeklyCallTarget,
        weeklyAskTarget,
      });
    }

    await blob.write(paths.store, store);
  }
}

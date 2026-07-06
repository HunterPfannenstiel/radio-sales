import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepStore, emptyRepStore } from "@/lib/blob/schema";

export type SetRepGoalPayload = {
  repId: string;
  monthlyGoalAmount: number;
  weeklyCallTarget: number;
  weeklyAskTarget: number;
};

export interface ISetRepGoalMutation {
  execute(payload: SetRepGoalPayload): Promise<void>;
}

export class BlobSetRepGoalMutation implements ISetRepGoalMutation {
  async execute(payload: SetRepGoalPayload): Promise<void> {
    const { repId, monthlyGoalAmount, weeklyCallTarget, weeklyAskTarget } =
      payload;

    const store: RepStore = (await blob.read<RepStore>(paths.repStore(repId))) ?? emptyRepStore();

    store.repGoals = { monthlyGoalAmount, weeklyCallTarget, weeklyAskTarget };

    await blob.write(paths.repStore(repId), store);
  }
}

import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type Store, emptyStore } from "@/lib/blob/schema";

export type UpdateBusinessStagePayload = {
  repId: string;
  businessId: string;
  stage: string;
};

export interface IUpdateBusinessStageMutation {
  execute(payload: UpdateBusinessStagePayload): Promise<void>;
}

export class BlobUpdateBusinessStageMutation
  implements IUpdateBusinessStageMutation
{
  async execute(payload: UpdateBusinessStagePayload): Promise<void> {
    const { repId, businessId, stage } = payload;

    const store: Store = (await blob.read<Store>(paths.store)) ?? emptyStore();

    // Find the most recent call log for this business owned by this rep
    const businessLogs = store.callLogs
      .filter((c) => c.repId === repId && c.businessId === businessId)
      .sort(
        (a, b) =>
          new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
      );

    const latestLog = businessLogs[0];
    if (!latestLog) {
      throw new Error("No call log found for this business");
    }

    // Update stage on the most recent log
    latestLog.stage = stage;

    await blob.write(paths.store, store);
  }
}

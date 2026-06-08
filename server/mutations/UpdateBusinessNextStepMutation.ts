import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type Store, emptyStore } from "@/lib/blob/schema";

export type UpdateBusinessNextStepPayload = {
  repId: string;
  businessId: string;
  nextStep: string;
};

export interface IUpdateBusinessNextStepMutation {
  execute(payload: UpdateBusinessNextStepPayload): Promise<void>;
}

export class BlobUpdateBusinessNextStepMutation
  implements IUpdateBusinessNextStepMutation
{
  async execute(payload: UpdateBusinessNextStepPayload): Promise<void> {
    const { repId, businessId, nextStep } = payload;

    const store: Store = (await blob.read<Store>(paths.store)) ?? emptyStore();

    const business = store.businesses.find(
      (b) => b.id === businessId && b.repId === repId
    );
    if (!business) {
      throw new Error("Business not found");
    }

    business.nextStep = nextStep;
    business.nextStepUpdatedAt = new Date().toISOString();

    await blob.write(paths.store, store);
  }
}

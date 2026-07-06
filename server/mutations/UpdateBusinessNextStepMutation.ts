import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepStore, emptyRepStore } from "@/lib/blob/schema";

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

    const store: RepStore = (await blob.read<RepStore>(paths.repStore(repId))) ?? emptyRepStore();

    const business = store.businesses.find((b) => b.id === businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    business.nextStep = nextStep;
    business.nextStepUpdatedAt = new Date().toISOString();

    await blob.write(paths.repStore(repId), store);
  }
}

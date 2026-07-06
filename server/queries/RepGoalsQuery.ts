import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepStore } from "@/lib/blob/schema";

export type RepGoalsDTO = RepStore["repGoals"];

export interface IRepGoalsQuery {
  execute(repId: string): Promise<RepGoalsDTO>;
}

export class BlobRepGoalsQuery implements IRepGoalsQuery {
  async execute(repId: string): Promise<RepGoalsDTO> {
    const store = await blob.read<RepStore>(paths.repStore(repId));
    return store?.repGoals ?? null;
  }
}

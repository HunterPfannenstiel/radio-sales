import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepsIndex } from "@/lib/blob/schema";

export type CurrentRepDTO = { id: string; name: string } | null;

export interface ICurrentRepQuery {
  execute(repId: string): Promise<CurrentRepDTO>;
}

export class BlobCurrentRepQuery implements ICurrentRepQuery {
  async execute(repId: string): Promise<CurrentRepDTO> {
    const index = await blob.read<RepsIndex>(paths.repsIndex);
    const rep = index?.reps.find((r) => r.id === repId);
    return rep ? { id: rep.id, name: rep.name } : null;
  }
}

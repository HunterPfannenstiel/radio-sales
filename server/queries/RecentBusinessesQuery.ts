import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepStore } from "@/lib/blob/schema";

export type BusinessDTO = {
  id: string;
  name: string;
};

export interface IRecentBusinessesQuery {
  execute(repId: string): Promise<BusinessDTO[]>;
}

export class BlobRecentBusinessesQuery implements IRecentBusinessesQuery {
  async execute(repId: string): Promise<BusinessDTO[]> {
    const store = await blob.read<RepStore>(paths.repStore(repId));
    if (!store) return [];

    const repLogs = [...store.callLogs].sort(
      (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
    );

    const seen = new Set<string>();
    const orderedIds: string[] = [];
    for (const log of repLogs) {
      if (!seen.has(log.businessId)) {
        seen.add(log.businessId);
        orderedIds.push(log.businessId);
      }
    }

    const businessMap = new Map(store.businesses.map((b) => [b.id, b]));

    return orderedIds
      .map((id) => businessMap.get(id))
      .filter((b): b is NonNullable<typeof b> => b !== undefined)
      .map((b) => ({ id: b.id, name: b.name }));
  }
}

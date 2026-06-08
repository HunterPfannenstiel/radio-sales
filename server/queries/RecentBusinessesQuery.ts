import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";

type Store = {
  businesses: { id: string; repId: string; name: string }[];
  callLogs: { repId: string; businessId: string; loggedAt: string }[];
};

export type BusinessDTO = {
  id: string;
  name: string;
};

export interface IRecentBusinessesQuery {
  execute(repId: string): Promise<BusinessDTO[]>;
}

export class BlobRecentBusinessesQuery implements IRecentBusinessesQuery {
  async execute(repId: string): Promise<BusinessDTO[]> {
    const store = await blob.read<Store>(paths.store);
    if (!store) return [];

    const repLogs = store.callLogs
      .filter((c) => c.repId === repId)
      .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());

    const seen = new Set<string>();
    const orderedIds: string[] = [];
    for (const log of repLogs) {
      if (!seen.has(log.businessId)) {
        seen.add(log.businessId);
        orderedIds.push(log.businessId);
      }
    }

    const businessMap = new Map(
      store.businesses.filter((b) => b.repId === repId).map((b) => [b.id, b])
    );

    return orderedIds
      .map((id) => businessMap.get(id))
      .filter((b): b is { id: string; repId: string; name: string } => b !== undefined)
      .map((b) => ({ id: b.id, name: b.name }));
  }
}

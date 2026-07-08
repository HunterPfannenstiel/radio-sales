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

// Pure: MRU-sorts callLogs, dedupes by businessId (first occurrence wins), and
// resolves the surviving ids against businesses[]. A businessId with no match
// in businesses[] is dropped rather than thrown on — see unit test for why
// that's a defensive guard, not a real scenario.
export function sortAndDedupBusinesses(
  callLogs: RepStore["callLogs"],
  businesses: RepStore["businesses"]
): BusinessDTO[] {
  const sortedLogs = [...callLogs].sort(
    (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
  );

  const seen = new Set<string>();
  const orderedIds: string[] = [];
  for (const log of sortedLogs) {
    if (!seen.has(log.businessId)) {
      seen.add(log.businessId);
      orderedIds.push(log.businessId);
    }
  }

  const businessMap = new Map(businesses.map((b) => [b.id, b]));

  return orderedIds
    .map((id) => businessMap.get(id))
    .filter((b): b is NonNullable<typeof b> => b !== undefined)
    .map((b) => ({ id: b.id, name: b.name }));
}

export class BlobRecentBusinessesQuery implements IRecentBusinessesQuery {
  async execute(repId: string): Promise<BusinessDTO[]> {
    const store = await blob.read<RepStore>(paths.repStore(repId));
    if (!store) return [];

    return sortAndDedupBusinesses(store.callLogs, store.businesses);
  }
}

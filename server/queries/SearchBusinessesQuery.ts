import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";

type Store = {
  reps: { id: string; name: string }[];
  businesses: {
    id: string;
    repId: string;
    name: string;
    createdAt: string;
  }[];
  callLogs: unknown[];
};

export type BusinessDTO = {
  id: string;
  name: string;
};

export interface ISearchBusinessesQuery {
  execute(repId: string, q: string): Promise<BusinessDTO[]>;
}

export class BlobSearchBusinessesQuery implements ISearchBusinessesQuery {
  async execute(repId: string, q: string): Promise<BusinessDTO[]> {
    const store = await blob.read<Store>(paths.store);
    if (!store) return [];

    const lower = q.toLowerCase();
    const filtered = store.businesses.filter(
      (b) =>
        b.repId === repId &&
        (q === "" || b.name.toLowerCase().includes(lower))
    );

    return filtered.map((b) => ({ id: b.id, name: b.name }));
  }
}

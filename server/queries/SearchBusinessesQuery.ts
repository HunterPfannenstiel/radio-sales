import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepStore } from "@/lib/blob/schema";

export type BusinessDTO = {
  id: string;
  name: string;
};

export interface ISearchBusinessesQuery {
  execute(repId: string, q: string): Promise<BusinessDTO[]>;
}

export class BlobSearchBusinessesQuery implements ISearchBusinessesQuery {
  async execute(repId: string, q: string): Promise<BusinessDTO[]> {
    const store = await blob.read<RepStore>(paths.repStore(repId));
    if (!store) return [];

    const lower = q.toLowerCase();
    const filtered = store.businesses.filter(
      (b) => q === "" || b.name.toLowerCase().includes(lower)
    );

    return filtered.map((b) => ({ id: b.id, name: b.name }));
  }
}

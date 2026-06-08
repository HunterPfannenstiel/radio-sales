import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type Store } from "@/lib/blob/schema";

export type CallActivityDTO = {
  callsToday: number;
};

export interface ICallActivityQuery {
  execute(repId: string): Promise<CallActivityDTO>;
}

export class BlobCallActivityQuery implements ICallActivityQuery {
  async execute(repId: string): Promise<CallActivityDTO> {
    const store = await blob.read<Store>(paths.store);
    if (!store) return { callsToday: 0 };

    const now = new Date();
    const todayStr = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;

    const callsToday = store.callLogs.filter((c) => {
      if (c.repId !== repId) return false;
      const d = new Date(c.loggedAt);
      const logStr = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
      return logStr === todayStr;
    }).length;

    return { callsToday };
  }
}

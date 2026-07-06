import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepStore } from "@/lib/blob/schema";

export type CallActivityDTO = {
  callsToday: number;
};

export interface ICallActivityQuery {
  execute(params: { repId: string; timezone: string }): Promise<CallActivityDTO>;
}

export class BlobCallActivityQuery implements ICallActivityQuery {
  async execute({ repId, timezone }: { repId: string; timezone: string }): Promise<CallActivityDTO> {
    const store = await blob.read<RepStore>(paths.repStore(repId));
    if (!store) return { callsToday: 0 };

    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: timezone });

    const callsToday = store.callLogs.filter((c) => {
      return new Date(c.loggedAt).toLocaleDateString('en-CA', { timeZone: timezone }) === todayStr;
    }).length;

    return { callsToday };
  }
}

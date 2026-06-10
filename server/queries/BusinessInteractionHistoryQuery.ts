import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type Store, type CallOutcome } from "@/lib/blob/schema";

export type InteractionHistoryEntryDTO = {
  id: string;
  date: string;
  stage: string;
  outcome?: CallOutcome;
  ask?: { amount: number; term: string; confidence: string };
  nextStep: string;
};

export interface IBusinessInteractionHistoryQuery {
  execute(repId: string, businessId: string): Promise<InteractionHistoryEntryDTO[]>;
}

const NEXT_STEP_LABELS: Record<string, string> = {
  followup_call: "Follow-up call",
  send_proposal: "Send proposal",
  schedule_demo: "Schedule demo",
  send_contract: "Send contract",
  check_in: "Check in",
};

export class BlobBusinessInteractionHistoryQuery
  implements IBusinessInteractionHistoryQuery
{
  async execute(
    repId: string,
    businessId: string
  ): Promise<InteractionHistoryEntryDTO[]> {
    const store =
      (await blob.read<Store>(paths.store)) ?? {
        reps: [],
        businesses: [],
        callLogs: [],
        repGoals: [],
      };

    const logs = store.callLogs
      .filter((c) => c.repId === repId && c.businessId === businessId)
      .sort(
        (a, b) =>
          new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
      );

    return logs.map((log) => {
      const entry: InteractionHistoryEntryDTO = {
        id: log.id,
        date: log.loggedAt,
        stage: log.stage,
        outcome: log.outcome,
        nextStep: NEXT_STEP_LABELS[log.whatNext] ?? log.whatNext,
      };

      if (log.budget !== undefined) {
        const termValue = log.termValue ?? 1;
        const termUnit = log.termUnit ?? "months";
        const term = `${termValue} ${termUnit}`;
        entry.ask = {
          amount: log.budget,
          term,
          confidence: log.confidence ?? "",
        };
      }

      return entry;
    });
  }
}

import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepStore, type CallOutcome, emptyRepStore } from "@/lib/blob/schema";
import { NEXT_STEPS } from "@/lib/types";

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

const NEXT_STEP_LABELS = Object.fromEntries(NEXT_STEPS.map((s) => [s.value, s.label]));

export class BlobBusinessInteractionHistoryQuery
  implements IBusinessInteractionHistoryQuery
{
  async execute(
    repId: string,
    businessId: string
  ): Promise<InteractionHistoryEntryDTO[]> {
    const store =
      (await blob.read<RepStore>(paths.repStore(repId))) ?? emptyRepStore();

    const logs = store.callLogs
      .filter((c) => c.businessId === businessId)
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

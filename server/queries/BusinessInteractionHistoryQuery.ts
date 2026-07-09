import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepStore, type CallOutcome, emptyRepStore } from "@/lib/blob/schema";
import { NEXT_STEPS } from "@/lib/types";

// The interaction-history timeline (components/InteractionHistory.tsx) renders a
// display vocabulary — sold / not_sold / follow_up — not the raw stored outcome
// (yes / no / pending). Map at the query boundary, the same place this file
// already maps `whatNext` → a human label, so the DTO is the presentation
// contract the UI consumes directly.
export const INTERACTION_OUTCOMES = ["sold", "not_sold", "follow_up"] as const;
export type InteractionOutcome = typeof INTERACTION_OUTCOMES[number];

// A call logged without a recorded outcome ("no outcome yet") collapses to the
// neutral follow_up state, which the timeline renders with no won/lost indicator.
const OUTCOME_DISPLAY: Record<CallOutcome, InteractionOutcome> = {
  yes: "sold",
  no: "not_sold",
  pending: "follow_up",
};

export type InteractionHistoryEntryDTO = {
  id: string;
  date: string;
  stage: string;
  outcome: InteractionOutcome;
  ask?: { amount: number; term: string; confidence: string };
  nextStep: string;
};

export interface IBusinessInteractionHistoryQuery {
  execute(repId: string, businessId: string): Promise<InteractionHistoryEntryDTO[]>;
}

const NEXT_STEP_LABELS = Object.fromEntries(NEXT_STEPS.map((s) => [s.value, s.label]));

// Pure: sorts a business's call logs newest-first and maps each to the
// timeline's display DTO (outcome vocabulary, ask, next-step label).
// Absent outcome collapses to "follow_up" — regression guard for the §0.3 bug.
export function buildInteractionHistory(
  logs: RepStore["callLogs"]
): InteractionHistoryEntryDTO[] {
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
  );

  return sortedLogs.map((log) => {
    const entry: InteractionHistoryEntryDTO = {
      id: log.id,
      date: log.loggedAt,
      stage: log.stage,
      outcome: log.outcome ? OUTCOME_DISPLAY[log.outcome] : "follow_up",
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

export class BlobBusinessInteractionHistoryQuery
  implements IBusinessInteractionHistoryQuery
{
  async execute(
    repId: string,
    businessId: string
  ): Promise<InteractionHistoryEntryDTO[]> {
    const store =
      (await blob.read<RepStore>(paths.repStore(repId))) ?? emptyRepStore();

    const logs = store.callLogs.filter((c) => c.businessId === businessId);

    return buildInteractionHistory(logs);
  }
}

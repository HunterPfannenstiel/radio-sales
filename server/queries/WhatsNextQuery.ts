import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepStore, emptyRepStore } from "@/lib/blob/schema";
import { NEXT_STEPS } from "@/lib/types";

export type WhatsNextBusinessDTO = {
  id: string;
  name: string;
  stage: string;
  nextStepText: string;
  lastContactedAt: string | null;
};

export interface IWhatsNextQuery {
  execute(repId: string): Promise<WhatsNextBusinessDTO[]>;
}

const NEXT_STEP_LABELS = Object.fromEntries(NEXT_STEPS.map((s) => [s.value, s.label]));

// Pure: for each business, resolves its latest logged next step (or the
// manual override if it was set strictly after that log), then sorts
// most-recently-contacted first. A business with no call logs is skipped
// entirely, not appended with a null lastContactedAt — see unit test.
export function computeWhatsNext(
  businesses: RepStore["businesses"],
  callLogs: RepStore["callLogs"]
): WhatsNextBusinessDTO[] {
  const results: WhatsNextBusinessDTO[] = [];

  for (const business of businesses) {
    // Find all call logs for this business, sorted newest first
    const businessLogs = callLogs
      .filter((c) => c.businessId === business.id)
      .sort(
        (a, b) =>
          new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
      );

    // Only include businesses that have a logged next step
    const latestLog = businessLogs[0];
    if (!latestLog || !latestLog.whatNext) continue;

    const businessNextStepIsNewer =
      business.nextStepUpdatedAt &&
      new Date(business.nextStepUpdatedAt) > new Date(latestLog.loggedAt);

    results.push({
      id: business.id,
      name: business.name,
      stage: latestLog.stage,
      nextStepText: businessNextStepIsNewer
        ? business.nextStep!
        : (NEXT_STEP_LABELS[latestLog.whatNext] ?? latestLog.whatNext),
      lastContactedAt: latestLog.loggedAt,
    });
  }

  // Sort: most recently contacted first; null lastContactedAt at bottom alphabetically
  results.sort((a, b) => {
    if (a.lastContactedAt && b.lastContactedAt) {
      return (
        new Date(b.lastContactedAt).getTime() -
        new Date(a.lastContactedAt).getTime()
      );
    }
    if (a.lastContactedAt && !b.lastContactedAt) return -1;
    if (!a.lastContactedAt && b.lastContactedAt) return 1;
    return a.name.localeCompare(b.name);
  });

  return results;
}

export class BlobWhatsNextQuery implements IWhatsNextQuery {
  async execute(repId: string): Promise<WhatsNextBusinessDTO[]> {
    const store = (await blob.read<RepStore>(paths.repStore(repId))) ?? emptyRepStore();

    return computeWhatsNext(store.businesses, store.callLogs);
  }
}

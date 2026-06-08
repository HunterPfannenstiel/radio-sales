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
  callLogs: {
    id: string;
    repId: string;
    businessId: string;
    stage: string;
    whatNext: string;
    outcome: string;
    loggedAt: string;
  }[];
};

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

const NEXT_STEP_LABELS: Record<string, string> = {
  followup_call: "Follow-up call",
  send_proposal: "Send proposal",
  schedule_demo: "Schedule demo",
  send_contract: "Send contract",
  check_in: "Check in",
};

export class BlobWhatsNextQuery implements IWhatsNextQuery {
  async execute(repId: string): Promise<WhatsNextBusinessDTO[]> {
    const store = (await blob.read<Store>(paths.store)) ?? {
      reps: [],
      businesses: [],
      callLogs: [],
    };

    const repBusinesses = store.businesses.filter((b) => b.repId === repId);

    const results: WhatsNextBusinessDTO[] = [];

    for (const business of repBusinesses) {
      // Find all call logs for this business, sorted newest first
      const businessLogs = store.callLogs
        .filter((c) => c.repId === repId && c.businessId === business.id)
        .sort(
          (a, b) =>
            new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
        );

      // Only include businesses that have a logged next step
      const latestLog = businessLogs[0];
      if (!latestLog || !latestLog.whatNext) continue;

      results.push({
        id: business.id,
        name: business.name,
        stage: latestLog.stage,
        nextStepText: NEXT_STEP_LABELS[latestLog.whatNext] ?? latestLog.whatNext,
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
}

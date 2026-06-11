import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type Store, type CallOutcome, type CallConfidence, type WhatNext, emptyStore } from "@/lib/blob/schema";

export type LogCallPayload = {
  repId: string;
  businessName: string;
  businessId?: string;
  stage: string;
  whatNext: WhatNext;
  budget?: number;
  termValue?: number;
  termUnit?: "weeks" | "months";
  confidence?: CallConfidence;
  outcome?: CallOutcome;
  loggedAt?: string;
};

export type LogCallResult = {
  callLogId: string;
  businessId: string;
};

export interface ILogCallMutation {
  execute(payload: LogCallPayload): Promise<LogCallResult>;
}

export class BlobLogCallMutation implements ILogCallMutation {
  async execute(payload: LogCallPayload): Promise<LogCallResult> {
    const {
      repId,
      businessName,
      businessId: providedBusinessId,
      stage,
      whatNext,
      budget,
      termValue,
      termUnit,
      confidence,
      outcome,
    } = payload;

    // 1. Read store (initialize if null)
    const store: Store = (await blob.read<Store>(paths.store)) ?? emptyStore();

    // 2. Ensure rep record exists
    const repExists = store.reps.some((r) => r.id === repId);
    if (!repExists) {
      store.reps.push({ id: repId, name: "Demo Rep" });
    }

    // 3. Resolve business
    let resolvedBusinessId: string | undefined;

    // Try provided businessId first
    if (providedBusinessId) {
      const found = store.businesses.find(
        (b) => b.id === providedBusinessId && b.repId === repId
      );
      if (found) {
        resolvedBusinessId = found.id;
      }
    }

    // Fall back to name lookup
    if (!resolvedBusinessId) {
      const nameLower = businessName.toLowerCase();
      const found = store.businesses.find(
        (b) => b.repId === repId && b.name.toLowerCase() === nameLower
      );
      if (found) {
        resolvedBusinessId = found.id;
      }
    }

    // Create new business if still not resolved
    if (!resolvedBusinessId) {
      const newBusiness = {
        id: crypto.randomUUID(),
        repId,
        name: businessName,
        createdAt: new Date().toISOString(),
      };
      store.businesses.push(newBusiness);
      resolvedBusinessId = newBusiness.id;
    }

    // 4. Create call log
    const callLogId = crypto.randomUUID();
    const callLog: Store["callLogs"][number] = {
      id: callLogId,
      repId,
      businessId: resolvedBusinessId,
      stage,
      whatNext,
      loggedAt: payload.loggedAt ?? new Date().toISOString(),
    };
    if (outcome !== undefined) callLog.outcome = outcome;
    if (budget !== undefined && budget > 0) callLog.budget = budget;
    if (termValue !== undefined && termValue > 0) callLog.termValue = termValue;
    if (termUnit !== undefined) callLog.termUnit = termUnit;
    if (confidence !== undefined) callLog.confidence = confidence;

    store.callLogs.push(callLog);

    // 5. Write updated store
    await blob.write(paths.store, store);

    // 6. Return result
    return { callLogId, businessId: resolvedBusinessId };
  }
}

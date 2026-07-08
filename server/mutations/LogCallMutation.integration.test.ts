import { describe, it, expect, beforeEach } from "vitest";
import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepStore, emptyRepStore } from "@/lib/blob/schema";
import { BlobLogCallMutation } from "./LogCallMutation";
import { BlobUpdateBusinessStageMutation } from "./UpdateBusinessStageMutation";
import { BlobUpdateBusinessNextStepMutation } from "./UpdateBusinessNextStepMutation";
import { BlobRecentBusinessesQuery } from "@/server/queries/RecentBusinessesQuery";
import { BlobSearchBusinessesQuery } from "@/server/queries/SearchBusinessesQuery";
import { BlobWhatsNextQuery } from "@/server/queries/WhatsNextQuery";
import { BlobBusinessInteractionHistoryQuery } from "@/server/queries/BusinessInteractionHistoryQuery";

// Integration layer: a real mutation writes the real LocalBlobStore, a real
// query reads it back. vitest runs against LocalBlobStore, which is a
// different implementation than the SupabaseBlobStore used in deployed
// environments (lib/blob/index.ts switches on USE_LOCAL_BLOB). These tests
// prove query/mutation logic, not that Supabase serialization/paths work —
// only the e2e journey covers that.
describe("LogCallMutation integration", () => {
  const repId = "rep-1";

  beforeEach(async () => {
    await blob.wipe();
  });

  describe("Flow B: a call makes a business discoverable, exactly once", () => {
    it("logging a call to a brand-new business makes it appear in recent-businesses, search(''), and what's-next", async () => {
      const logCall = new BlobLogCallMutation();
      const { businessId } = await logCall.execute({
        repId,
        businessName: "Acme Radio",
        stage: "present",
        whatNext: "send_proposal",
      });

      const recent = await new BlobRecentBusinessesQuery().execute(repId);
      expect(recent).toContainEqual({ id: businessId, name: "Acme Radio" });

      const searched = await new BlobSearchBusinessesQuery().execute(repId, "");
      expect(searched).toContainEqual({ id: businessId, name: "Acme Radio" });

      const whatsNext = await new BlobWhatsNextQuery().execute(repId);
      expect(whatsNext.some((b) => b.id === businessId)).toBe(true);
    });

    it("logging to 'acme radio' then 'Acme Radio' resolves to one business with two call logs", async () => {
      const logCall = new BlobLogCallMutation();
      await logCall.execute({
        repId,
        businessName: "acme radio",
        stage: "approach",
        whatNext: "followup_call",
        loggedAt: "2026-01-01T10:00:00.000Z",
      });
      await logCall.execute({
        repId,
        businessName: "Acme Radio",
        stage: "uncover",
        whatNext: "send_spec_spot",
        loggedAt: "2026-01-02T10:00:00.000Z",
      });

      const store = await blob.read<RepStore>(paths.repStore(repId));
      expect(store!.businesses).toHaveLength(1);
      expect(store!.callLogs).toHaveLength(2);
      expect(store!.callLogs.every((c) => c.businessId === store!.businesses[0].id)).toBe(true);
    });

    it("logging with an explicit existing businessId reuses it and mints nothing new", async () => {
      const logCall = new BlobLogCallMutation();
      const first = await logCall.execute({
        repId,
        businessName: "Test Co",
        stage: "approach",
        whatNext: "followup_call",
      });

      await logCall.execute({
        repId,
        businessId: first.businessId,
        businessName: "Ignored Name",
        stage: "uncover",
        whatNext: "send_spec_spot",
      });

      const store = await blob.read<RepStore>(paths.repStore(repId));
      expect(store!.businesses).toHaveLength(1);
      expect(store!.businesses[0].name).toBe("Test Co");
      expect(store!.callLogs).toHaveLength(2);
      expect(store!.callLogs.every((c) => c.businessId === first.businessId)).toBe(true);
    });
  });

  describe("Flow C: status/history round-trip; edits take effect", () => {
    it("logging approach -> uncover -> present across three calls returns all three newest-first with correct stages/next-steps", async () => {
      const logCall = new BlobLogCallMutation();
      const first = await logCall.execute({
        repId,
        businessName: "Round Trip Radio",
        stage: "approach",
        whatNext: "followup_call",
        loggedAt: "2026-01-01T10:00:00.000Z",
      });
      await logCall.execute({
        repId,
        businessId: first.businessId,
        businessName: "Round Trip Radio",
        stage: "uncover",
        whatNext: "send_spec_spot",
        loggedAt: "2026-01-02T10:00:00.000Z",
      });
      await logCall.execute({
        repId,
        businessId: first.businessId,
        businessName: "Round Trip Radio",
        stage: "present",
        whatNext: "send_proposal",
        loggedAt: "2026-01-03T10:00:00.000Z",
      });

      const history = await new BlobBusinessInteractionHistoryQuery().execute(repId, first.businessId);
      expect(history).toHaveLength(3);
      expect(history[0]).toMatchObject({ stage: "present", nextStep: "Send proposal" });
      expect(history[1]).toMatchObject({ stage: "uncover", nextStep: "Send spec spot" });
      expect(history[2]).toMatchObject({ stage: "approach", nextStep: "Follow-up call" });
    });

    it("PATCHing stage to 'close' on a business with logs makes what's-next show stage 'close'", async () => {
      const logCall = new BlobLogCallMutation();
      const { businessId } = await logCall.execute({
        repId,
        businessName: "Closer Co",
        stage: "present",
        whatNext: "send_contract",
      });

      await new BlobUpdateBusinessStageMutation().execute({ repId, businessId, stage: "close" });

      const whatsNext = await new BlobWhatsNextQuery().execute(repId);
      const entry = whatsNext.find((b) => b.id === businessId);
      expect(entry).toBeDefined();
      // WhatsNextQuery returns the raw stage value; the "Close" display label
      // (STAGE_LABELS in lib/types.ts) is a UI-layer concern, out of scope here.
      expect(entry!.stage).toBe("close");
    });

    it("PATCHing stage on a zero-log business throws (documents the 'No call log found' precondition)", async () => {
      const store = emptyRepStore();
      const businessId = crypto.randomUUID();
      store.businesses.push({ id: businessId, name: "No Logs Yet", createdAt: new Date().toISOString() });
      await blob.write(paths.repStore(repId), store);

      await expect(
        new BlobUpdateBusinessStageMutation().execute({ repId, businessId, stage: "close" })
      ).rejects.toThrow("No call log found for this business");
    });

    it("editing next-step then logging a newer call reflects the newer call's step, not the manual edit", async () => {
      const logCall = new BlobLogCallMutation();
      const { businessId } = await logCall.execute({
        repId,
        businessName: "Precedence Radio",
        stage: "approach",
        whatNext: "followup_call",
      });

      // UpdateBusinessNextStepMutation hard-codes nextStepUpdatedAt to the real
      // wall-clock now internally (not injectable), so the follow-up log's
      // loggedAt must be pinned safely after this real call, not a fixed date.
      await new BlobUpdateBusinessNextStepMutation().execute({
        repId,
        businessId,
        nextStep: "Manually written next step",
      });

      await logCall.execute({
        repId,
        businessId,
        businessName: "Precedence Radio",
        stage: "present",
        whatNext: "send_contract",
        loggedAt: new Date(Date.now() + 60_000).toISOString(),
      });

      const whatsNext = await new BlobWhatsNextQuery().execute(repId);
      const entry = whatsNext.find((b) => b.id === businessId);
      expect(entry).toBeDefined();
      expect(entry!.nextStepText).toBe("Send contract");
    });
  });
});

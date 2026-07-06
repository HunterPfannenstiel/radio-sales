import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepsIndex, emptyRepStore } from "@/lib/blob/schema";

export type LoginPayload = { name: string; pin: string };

export type LoginResult =
  | { ok: true; repId: string; name: string; isNewRep: boolean }
  | { ok: false; reason: "pin_mismatch" };

export interface ILoginMutation {
  execute(payload: LoginPayload): Promise<LoginResult>;
}

export class BlobLoginMutation implements ILoginMutation {
  async execute(payload: LoginPayload): Promise<LoginResult> {
    const index: RepsIndex = (await blob.read<RepsIndex>(paths.repsIndex)) ?? { reps: [] };
    const nameLower = payload.name.trim().toLowerCase();
    const existing = index.reps.find((r) => r.name.toLowerCase() === nameLower);

    if (existing) {
      if (existing.pin !== payload.pin) return { ok: false, reason: "pin_mismatch" };
      return { ok: true, repId: existing.id, name: existing.name, isNewRep: false };
    }

    const newRep = { id: crypto.randomUUID(), name: payload.name.trim(), pin: payload.pin };
    index.reps.push(newRep);
    await blob.write(paths.repsIndex, index);
    await blob.write(paths.repStore(newRep.id), emptyRepStore());
    return { ok: true, repId: newRep.id, name: newRep.name, isNewRep: true };
  }
}

import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepsIndex, emptyRepStore } from "@/lib/blob/schema";

export type SignupPayload = { name: string; pin: string };

export type SignupResult =
  | { ok: true; repId: string; name: string }
  | { ok: false; reason: "already_exists" };

export interface ISignupMutation {
  execute(payload: SignupPayload): Promise<SignupResult>;
}

export class BlobSignupMutation implements ISignupMutation {
  async execute(payload: SignupPayload): Promise<SignupResult> {
    const index: RepsIndex = (await blob.read<RepsIndex>(paths.repsIndex)) ?? { reps: [] };
    const nameLower = payload.name.trim().toLowerCase();
    const alreadyExists = index.reps.some(
      (r) => r.name.toLowerCase() === nameLower && r.pin === payload.pin
    );
    if (alreadyExists) return { ok: false, reason: "already_exists" };

    const newRep = { id: crypto.randomUUID(), name: payload.name.trim(), pin: payload.pin };
    index.reps.push(newRep);
    await blob.write(paths.repsIndex, index);
    await blob.write(paths.repStore(newRep.id), emptyRepStore());
    return { ok: true, repId: newRep.id, name: newRep.name };
  }
}

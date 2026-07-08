import { blob } from "@/lib/blob";
import { paths } from "@/lib/blob/paths";
import { type RepsIndex } from "@/lib/blob/schema";

export type LoginPayload = { name: string; pin: string };

export type LoginResult =
  | { ok: true; repId: string; name: string }
  | { ok: false; reason: "not_found" | "pin_mismatch" };

export interface ILoginMutation {
  execute(payload: LoginPayload): Promise<LoginResult>;
}

export class BlobLoginMutation implements ILoginMutation {
  async execute(payload: LoginPayload): Promise<LoginResult> {
    const index: RepsIndex = (await blob.read<RepsIndex>(paths.repsIndex)) ?? { reps: [] };
    const nameLower = payload.name.trim().toLowerCase();
    const matchingName = index.reps.filter((r) => r.name.toLowerCase() === nameLower);

    if (matchingName.length === 0) return { ok: false, reason: "not_found" };

    const match = matchingName.find((r) => r.pin === payload.pin);
    if (!match) return { ok: false, reason: "pin_mismatch" };

    return { ok: true, repId: match.id, name: match.name };
  }
}

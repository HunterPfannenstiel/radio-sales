import { describe, it, expect, beforeEach } from "vitest";
import { blob } from "@/lib/blob";
import { BlobLoginMutation } from "./LoginMutation";
import { BlobSignupMutation } from "./SignupMutation";

describe("BlobLoginMutation", () => {
  beforeEach(async () => {
    await blob.wipe();
  });

  it("rejects a name with no matching account", async () => {
    const result = await new BlobLoginMutation().execute({ name: "Alice", pin: "1234" });
    expect(result).toEqual({ ok: false, reason: "not_found" });
  });

  it("logs in an existing rep with the correct pin", async () => {
    await new BlobSignupMutation().execute({ name: "Alice", pin: "1234" });
    const result = await new BlobLoginMutation().execute({ name: "Alice", pin: "1234" });
    expect(result).toMatchObject({ ok: true, name: "Alice" });
  });

  it("rejects an existing rep with the wrong pin", async () => {
    await new BlobSignupMutation().execute({ name: "Alice", pin: "1234" });
    const result = await new BlobLoginMutation().execute({ name: "Alice", pin: "9999" });
    expect(result).toEqual({ ok: false, reason: "pin_mismatch" });
  });

  it("logs in the correct rep when the same name has multiple pins", async () => {
    const first = await new BlobSignupMutation().execute({ name: "Alice", pin: "1234" });
    const second = await new BlobSignupMutation().execute({ name: "Alice", pin: "5678" });
    if (!first.ok || !second.ok) throw new Error("setup signups failed");

    const result = await new BlobLoginMutation().execute({ name: "Alice", pin: "5678" });
    expect(result).toMatchObject({ ok: true, repId: second.repId });
    expect(result).not.toMatchObject({ repId: first.repId });
  });
});

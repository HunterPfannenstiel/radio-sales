import { describe, it, expect, beforeEach } from "vitest";
import { blob } from "@/lib/blob";
import { BlobLoginMutation } from "./LoginMutation";

describe("BlobLoginMutation", () => {
  beforeEach(async () => {
    await blob.wipe();
  });

  it("creates a new rep on first login", async () => {
    const result = await new BlobLoginMutation().execute({ name: "Alice", pin: "1234" });
    expect(result).toMatchObject({ ok: true, isNewRep: true, name: "Alice" });
  });

  it("rejects an existing rep with the wrong pin", async () => {
    await new BlobLoginMutation().execute({ name: "Alice", pin: "1234" });
    const result = await new BlobLoginMutation().execute({ name: "Alice", pin: "9999" });
    expect(result).toEqual({ ok: false, reason: "pin_mismatch" });
  });
});

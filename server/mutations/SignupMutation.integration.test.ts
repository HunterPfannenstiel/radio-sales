import { describe, it, expect, beforeEach } from "vitest";
import { blob } from "@/lib/blob";
import { BlobSignupMutation } from "./SignupMutation";

describe("BlobSignupMutation", () => {
  beforeEach(async () => {
    await blob.wipe();
  });

  it("creates a new rep on first signup", async () => {
    const result = await new BlobSignupMutation().execute({ name: "Alice", pin: "1234" });
    expect(result).toMatchObject({ ok: true, name: "Alice" });
  });

  it("rejects an exact name+pin combo that already exists", async () => {
    await new BlobSignupMutation().execute({ name: "Alice", pin: "1234" });
    const result = await new BlobSignupMutation().execute({ name: "Alice", pin: "1234" });
    expect(result).toEqual({ ok: false, reason: "already_exists" });
  });

  it("allows the same name with a different pin", async () => {
    await new BlobSignupMutation().execute({ name: "Alice", pin: "1234" });
    const result = await new BlobSignupMutation().execute({ name: "Alice", pin: "5678" });
    expect(result).toMatchObject({ ok: true, name: "Alice" });
  });
});

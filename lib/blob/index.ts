import type { IBlobStore } from "./IBlobStore";
import { LocalBlobStore } from "./local";
import { SupabaseBlobStore } from "./supabase";

export const blob: IBlobStore =
  process.env.USE_LOCAL_BLOB === "true"
    ? new LocalBlobStore()
    : new SupabaseBlobStore();

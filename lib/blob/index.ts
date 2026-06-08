import type { IBlobStore } from "./IBlobStore.ts";
import { LocalBlobStore } from "./local.ts";
import { SupabaseBlobStore } from "./supabase.ts";

export const blob: IBlobStore =
  process.env.USE_LOCAL_BLOB === "true"
    ? new LocalBlobStore()
    : new SupabaseBlobStore();

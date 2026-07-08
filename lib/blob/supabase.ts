import { createClient } from "@supabase/supabase-js";
import type { IBlobStore } from "./IBlobStore.ts";

function isNotFoundError(error: { statusCode?: string }): boolean {
  return error.statusCode === "404";
}

export class SupabaseBlobStore implements IBlobStore {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
  private bucket = process.env.SUPABASE_BUCKET!;

  async read<T>(pathname: string): Promise<T | null> {
    const { data, error } = await this.supabase.storage.from(this.bucket).download(pathname);
    if (error) {
      if (isNotFoundError(error)) return null;
      throw error;
    }
    return JSON.parse(await data.text()) as T;
  }

  async write(pathname: string, data: unknown): Promise<void> {
    const { error } = await this.supabase.storage.from(this.bucket).upload(pathname, JSON.stringify(data), {
      upsert: true,
      contentType: "application/json",
    });
    if (error) throw error;
  }

  async delete(pathname: string): Promise<void> {
    await this.supabase.storage.from(this.bucket).remove([pathname]);
  }

  async wipe(): Promise<void> {
    await this.wipeFolder("");
  }

  private async wipeFolder(folder: string): Promise<void> {
    const { data } = await this.supabase.storage.from(this.bucket).list(folder);
    if (!data) return;
    const prefix = folder ? `${folder}/` : "";
    const files = data.filter((i) => i.id !== null).map((i) => `${prefix}${i.name}`);
    const folders = data.filter((i) => i.id === null).map((i) => `${prefix}${i.name}`);
    if (files.length > 0) await this.supabase.storage.from(this.bucket).remove(files);
    for (const sub of folders) await this.wipeFolder(sub);
  }
}

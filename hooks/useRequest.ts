"use client";
import { useState } from "react";

export function useRequest<T = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function execute(url: string, options?: RequestInit): Promise<T | null> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(res.statusText);
      return await res.json() as T;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { execute, loading, error };
}

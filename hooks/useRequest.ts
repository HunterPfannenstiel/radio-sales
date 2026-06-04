"use client";
import { useState } from "react";
import { useToast } from "./useToast";

export function useRequest<T = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toastError } = useToast();

  async function execute(url: string, options?: RequestInit): Promise<T | null> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(res.statusText);
      return await res.json() as T;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Request failed";
      setError(message);
      toastError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { execute, loading, error };
}

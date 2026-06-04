"use client";
import { useEffect, useState } from "react";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);
        setData(await res.json() as T);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Fetch failed");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [url]);

  return { data, loading, error };
}

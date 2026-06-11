"use client";
import { useCallback, useEffect, useState } from "react";
import { getClientTimezone } from "@/lib/timezone";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const initialLoading = loading && data === null;
  const refreshing = loading && data !== null;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    async function load() {
      try {
        const tz = getClientTimezone()
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { 'X-Timezone': tz },
        });
        if (!res.ok) throw new Error(res.statusText);
        setData(await res.json() as T);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Fetch failed");
      } finally {
        setLoading(false);
      }
    }
    load();

    return () => controller.abort();
  }, [url, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { data, setData, loading, initialLoading, refreshing, error, refetch };
}

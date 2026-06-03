"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SAVE_DEBOUNCE_MS = 600;

export function useCloudStore<T>(
  key: string,
  initialValue: T
): readonly [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [value, setValueState] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSerialized = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const persistInitialFromLocal = (parsed: T) => {
      lastSerialized.current = JSON.stringify(parsed);
      fetch(`/api/kv/${encodeURIComponent(key)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: parsed }),
      }).catch(() => {});
    };

    (async () => {
      try {
        const res = await fetch(`/api/kv/${encodeURIComponent(key)}`, { cache: "no-store" });
        if (cancelled) return;
        if (res.ok) {
          const { value: cloudValue } = (await res.json()) as { value: T | null };
          if (cloudValue !== null && cloudValue !== undefined) {
            setValueState(cloudValue);
            lastSerialized.current = JSON.stringify(cloudValue);
          } else {
            // Cloud empty — one-time migration from localStorage if present
            try {
              const local = window.localStorage.getItem(key);
              if (local) {
                const parsed = JSON.parse(local) as T;
                setValueState(parsed);
                persistInitialFromLocal(parsed);
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      } catch {
        // Network failure — try localStorage as read-only fallback
        try {
          const local = window.localStorage.getItem(key);
          if (local && !cancelled) setValueState(JSON.parse(local) as T);
        } catch {
          // ignore
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (next: T | ((v: T) => T)) => {
      setValueState((prev) => {
        const resolved = typeof next === "function" ? (next as (v: T) => T)(prev) : next;
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => {
          const serialized = JSON.stringify(resolved);
          if (serialized === lastSerialized.current) return;
          lastSerialized.current = serialized;
          try {
            window.localStorage.setItem(key, serialized);
          } catch {
            // ignore quota
          }
          fetch(`/api/kv/${encodeURIComponent(key)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: resolved }),
          }).catch(() => {});
        }, SAVE_DEBOUNCE_MS);
        return resolved;
      });
    },
    [key]
  );

  return [value, setValue, hydrated] as const;
}

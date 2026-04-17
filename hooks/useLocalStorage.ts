"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore =
      value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    try {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      // ignore
    }
  };

  return [storedValue, setValue, hydrated] as const;
}

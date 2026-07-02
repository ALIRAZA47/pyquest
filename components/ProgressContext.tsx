"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "pyquest:progress:v1";

interface ProgressValue {
  completed: Set<string>;
  isComplete: (slug: string) => boolean;
  toggle: (slug: string) => void;
  markComplete: (slug: string) => void;
  count: number;
  ready: boolean;
}

const ProgressCtx = createContext<ProgressValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(
    (slug: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(slug)) next.delete(slug);
        else next.add(slug);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const markComplete = useCallback(
    (slug: string) => {
      setCompleted((prev) => {
        if (prev.has(slug)) return prev;
        const next = new Set(prev);
        next.add(slug);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const value = useMemo<ProgressValue>(
    () => ({
      completed,
      isComplete: (slug: string) => completed.has(slug),
      toggle,
      markComplete,
      count: completed.size,
      ready,
    }),
    [completed, toggle, markComplete, ready]
  );

  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export function useProgress(): ProgressValue {
  const ctx = useContext(ProgressCtx);
  if (!ctx) {
    // Safe no-op fallback (e.g. during SSR before provider mounts)
    return {
      completed: new Set(),
      isComplete: () => false,
      toggle: () => {},
      markComplete: () => {},
      count: 0,
      ready: false,
    };
  }
  return ctx;
}

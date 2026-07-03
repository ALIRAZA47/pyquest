"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CURRICULUM, TOTAL_LESSONS } from "@/lib/curriculum";
import {
  BADGES,
  levelFromXp,
  levelProgress,
  XP,
  type BadgeSnapshot,
} from "@/lib/gamification";
import { fireConfetti } from "./confetti";
import { rankGlyph, badgeGlyph } from "./glyphs";

const STORAGE_KEY = "quest:game:v1";
const OLD_GAME_KEY = "pyquest:game:v1"; // migrate progress from the previous app name
const LEGACY_KEY = "pyquest:progress:v1"; // very old completed-only array

interface GameData {
  completed: string[];
  xpEvents: Record<string, number>;
  badges: string[];
  activeDays: string[];
  reviewedAt: Record<string, string>;
}

const EMPTY: GameData = {
  completed: [],
  xpEvents: {},
  badges: [],
  activeDays: [],
  reviewedAt: {},
};

export interface ToastItem {
  id: number;
  icon: string;
  title: string;
  subtitle?: string;
  kind: "xp" | "badge" | "level";
}

interface ProgressValue {
  // Lessons
  completed: Set<string>;
  isComplete: (slug: string) => boolean;
  toggle: (slug: string) => void;
  markComplete: (slug: string) => void;
  count: number;
  ready: boolean;
  // Gamification
  xp: number;
  level: number;
  rankName: string;
  rankEmoji: string;
  levelFraction: number;
  xpToNext: number;
  streak: number;
  longestStreak: number;
  badges: Set<string>;
  quizzesCorrect: number;
  challengesSolved: number;
  hasEvent: (key: string) => boolean;
  awardXp: (key: string, amount: number) => void;
  // Review
  reviewedAt: Record<string, string>;
  markReviewed: (slug: string) => void;
  // Toasts / celebration
  toasts: ToastItem[];
  dismissToast: (id: number) => void;
  celebrate: () => void;
}

const Ctx = createContext<ProgressValue | null>(null);

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((db - da) / 86400000);
}

function computeStreaks(activeDays: string[]): {
  current: number;
  longest: number;
} {
  if (!activeDays.length) return { current: 0, longest: 0 };
  const days = Array.from(new Set(activeDays)).sort();
  // longest run
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    if (daysBetween(days[i - 1], days[i]) === 1) run += 1;
    else run = 1;
    if (run > longest) longest = run;
  }
  // current run (ending today or yesterday)
  const today = todayStr();
  const last = days[days.length - 1];
  const gap = daysBetween(last, today);
  let current = 0;
  if (gap <= 1) {
    current = 1;
    for (let i = days.length - 1; i > 0; i--) {
      if (daysBetween(days[i - 1], days[i]) === 1) current += 1;
      else break;
    }
  }
  return { current, longest };
}

let toastSeq = 1;

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<GameData>(EMPTY);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const initRef = useRef(false);
  const prevLevelRef = useRef(1);

  // Load
  useEffect(() => {
    let loaded: GameData = { ...EMPTY };
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_GAME_KEY);
      if (raw) {
        loaded = { ...EMPTY, ...JSON.parse(raw) };
      } else {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) loaded.completed = JSON.parse(legacy);
      }
    } catch {
      /* ignore */
    }
    setData(loaded);
    setReady(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data, ready]);

  const pushToast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = toastSeq++;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const recordActivityInto = (d: GameData): GameData => {
    const today = todayStr();
    if (d.activeDays.includes(today)) return d;
    return { ...d, activeDays: [...d.activeDays, today] };
  };

  const awardXp = useCallback((key: string, amount: number) => {
    setData((prev) => {
      if (prev.xpEvents[key] !== undefined) return prev; // idempotent
      const next = recordActivityInto({
        ...prev,
        xpEvents: { ...prev.xpEvents, [key]: amount },
      });
      return next;
    });
  }, []);

  const toggle = useCallback((slug: string) => {
    setData((prev) => {
      const has = prev.completed.includes(slug);
      const completed = has
        ? prev.completed.filter((s) => s !== slug)
        : [...prev.completed, slug];
      const xpEvents = { ...prev.xpEvents };
      const key = `lesson:${slug}`;
      if (has) delete xpEvents[key];
      else xpEvents[key] = XP.LESSON_COMPLETE;
      return recordActivityInto({ ...prev, completed, xpEvents });
    });
  }, []);

  const markComplete = useCallback((slug: string) => {
    setData((prev) => {
      if (prev.completed.includes(slug)) return prev;
      return recordActivityInto({
        ...prev,
        completed: [...prev.completed, slug],
        xpEvents: { ...prev.xpEvents, [`lesson:${slug}`]: XP.LESSON_COMPLETE },
      });
    });
  }, []);

  const markReviewed = useCallback((slug: string) => {
    setData((prev) =>
      recordActivityInto({
        ...prev,
        reviewedAt: { ...prev.reviewedAt, [slug]: new Date().toISOString() },
      })
    );
  }, []);

  // Derived values
  const xp = useMemo(
    () => Object.values(data.xpEvents).reduce((a, b) => a + b, 0),
    [data.xpEvents]
  );
  const lp = useMemo(() => levelProgress(xp), [xp]);
  const streaks = useMemo(() => computeStreaks(data.activeDays), [data.activeDays]);
  const eventKeys = useMemo(() => Object.keys(data.xpEvents), [data.xpEvents]);
  const quizzesCorrect = useMemo(
    () => eventKeys.filter((k) => k.startsWith("quiz:")).length,
    [eventKeys]
  );
  const challengesSolved = useMemo(
    () => eventKeys.filter((k) => k.startsWith("chal:")).length,
    [eventKeys]
  );
  const exercisesRun = useMemo(
    () => eventKeys.filter((k) => k.startsWith("exrun:")).length,
    [eventKeys]
  );
  const completedSet = useMemo(() => new Set(data.completed), [data.completed]);
  const chaptersCompleted = useMemo(
    () =>
      CURRICULUM.filter((c) => c.slugs.every((s) => completedSet.has(s))).length,
    [completedSet]
  );

  // Detect badge unlocks & level-ups; celebrate for new ones.
  useEffect(() => {
    if (!ready) return;
    const snap: BadgeSnapshot = {
      completedCount: data.completed.length,
      totalLessons: TOTAL_LESSONS,
      xp,
      streak: streaks.current,
      longestStreak: streaks.longest,
      quizzesCorrect,
      challengesSolved,
      chaptersCompleted,
      exercisesRun,
      hour: new Date().getHours(),
    };
    const unlocked = new Set(data.badges);
    const newly = BADGES.filter((b) => b.test(snap) && !unlocked.has(b.id));
    const level = levelFromXp(xp);

    if (!initRef.current) {
      // First evaluation after load: record silently, no toasts.
      initRef.current = true;
      prevLevelRef.current = level;
      if (newly.length) {
        setData((prev) => ({
          ...prev,
          badges: Array.from(new Set([...prev.badges, ...newly.map((b) => b.id)])),
        }));
      }
      return;
    }

    if (level > prevLevelRef.current) {
      pushToast({
        kind: "level",
        icon: rankGlyph(lp.rank.name),
        title: `Level ${level} — ${lp.rank.name}!`,
        subtitle: "Keep it up, you're leveling up fast.",
      });
      fireConfetti();
    }
    prevLevelRef.current = level;

    if (newly.length) {
      newly.forEach((b) =>
        pushToast({
          kind: "badge",
          icon: badgeGlyph(b.id),
          title: `Achievement unlocked: ${b.title}`,
          subtitle: b.description,
        })
      );
      fireConfetti();
      setData((prev) => ({
        ...prev,
        badges: Array.from(new Set([...prev.badges, ...newly.map((b) => b.id)])),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ready,
    xp,
    data.completed.length,
    streaks.current,
    quizzesCorrect,
    challengesSolved,
    chaptersCompleted,
    exercisesRun,
  ]);

  const celebrate = useCallback(() => fireConfetti(), []);

  const value = useMemo<ProgressValue>(
    () => ({
      completed: completedSet,
      isComplete: (slug: string) => completedSet.has(slug),
      toggle,
      markComplete,
      count: data.completed.length,
      ready,
      xp,
      level: lp.level,
      rankName: lp.rank.name,
      rankEmoji: lp.rank.emoji,
      levelFraction: lp.fraction,
      xpToNext: lp.toNext,
      streak: streaks.current,
      longestStreak: streaks.longest,
      badges: new Set(data.badges),
      quizzesCorrect,
      challengesSolved,
      hasEvent: (key: string) => data.xpEvents[key] !== undefined,
      awardXp,
      reviewedAt: data.reviewedAt,
      markReviewed,
      toasts,
      dismissToast,
      celebrate,
    }),
    [
      completedSet,
      toggle,
      markComplete,
      data.completed.length,
      data.badges,
      data.xpEvents,
      data.reviewedAt,
      ready,
      xp,
      lp,
      streaks,
      quizzesCorrect,
      challengesSolved,
      awardXp,
      markReviewed,
      toasts,
      dismissToast,
      celebrate,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const NOOP: ProgressValue = {
  completed: new Set(),
  isComplete: () => false,
  toggle: () => {},
  markComplete: () => {},
  count: 0,
  ready: false,
  xp: 0,
  level: 1,
  rankName: "Hatchling",
  rankEmoji: "🐣",
  levelFraction: 0,
  xpToNext: 50,
  streak: 0,
  longestStreak: 0,
  badges: new Set(),
  quizzesCorrect: 0,
  challengesSolved: 0,
  hasEvent: () => false,
  awardXp: () => {},
  reviewedAt: {},
  markReviewed: () => {},
  toasts: [],
  dismissToast: () => {},
  celebrate: () => {},
};

export function useProgress(): ProgressValue {
  return useContext(Ctx) ?? NOOP;
}

// Alias for readability in gamification-focused components.
export const useGame = useProgress;

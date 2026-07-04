"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useProgress } from "@/components/ProgressContext";
import { COURSE_LIST } from "@/lib/courses";
import { Glyph, badgeGlyph, rankGlyph } from "@/components/glyphs";
import { BADGES } from "@/lib/gamification";
import { ArrowRight, FlameIcon } from "@/components/Icons";

const NAME_KEY = "quest:name";

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="font-display text-3xl font-bold tabular-nums text-fg">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  );
}

export default function ProfilePage() {
  const {
    level,
    rankName,
    levelFraction,
    xp,
    xpToNext,
    streak,
    challengesSolved,
    quizzesCorrect,
    isComplete,
    badges,
  } = useProgress();

  const [name, setName] = useState("");
  useEffect(() => {
    try {
      setName(localStorage.getItem(NAME_KEY) || localStorage.getItem("pyquest:name") || "");
    } catch {
      /* ignore */
    }
  }, []);

  const displayName = name.trim() || "Quest Learner";
  const avatar = displayName.charAt(0).toUpperCase();
  const lessonsDone = COURSE_LIST.reduce(
    (n, c) => n + c.course.allSlugs.filter((s) => isComplete(s)).length,
    0
  );
  const unlocked = BADGES.filter((b) => badges.has(b.id));

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-glow">
            <Glyph name="code" className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-fg">Quest</span>
        </Link>
        <Link
          href="/learn/certificate"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-text"
        >
          View certificate
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/[0.1] via-surface to-accent-2/[0.06] p-6 sm:p-8"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-accent to-accent-2 font-display text-4xl font-bold text-white shadow-glow">
            {avatar}
          </span>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold tracking-tight text-fg">
              {displayName}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1.5 font-semibold text-accent-text">
                <Glyph name={rankGlyph(rankName)} className="h-4 w-4" />
                {rankName} · Level {level}
              </span>
              {streak > 0 && (
                <span className="inline-flex items-center gap-1.5 font-semibold text-orange-500">
                  <FlameIcon className="h-4 w-4" />
                  {streak}-day streak
                </span>
              )}
            </div>
          </div>
          <div className="sm:text-right">
            <div className="font-display text-4xl font-bold tabular-nums text-fg">
              {xp.toLocaleString()}
            </div>
            <div className="text-sm text-faint">total XP</div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border sm:w-48">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500"
                style={{ width: `${Math.round(levelFraction * 100)}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-faint">{xpToNext} XP to Level {level + 1}</div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat value={lessonsDone} label="Lessons done" />
        <Stat value={challengesSolved} label="Challenges solved" />
        <Stat value={quizzesCorrect} label="Quizzes aced" />
        <Stat value={streak} label="Day streak" />
      </div>

      {/* Course progress */}
      <h2 className="mb-4 mt-10 font-display text-xl font-bold tracking-tight text-fg">
        Course progress
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {COURSE_LIST.map((c) => {
          const done = c.course.allSlugs.filter((s) => isComplete(s)).length;
          const pct = c.course.totalLessons
            ? Math.round((done / c.course.totalLessons) * 100)
            : 0;
          return (
            <Link
              key={c.id}
              href={c.base}
              style={{ "--accent": c.accent, "--accent-2": c.accent2 } as React.CSSProperties}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-accent/40"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white">
                <Glyph name={c.glyph} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-fg">{c.name}</span>
                  <span className="shrink-0 font-mono text-xs font-semibold text-accent-text">
                    {pct}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight text-fg">Achievements</h2>
          <span className="rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-sm text-muted">
            {unlocked.length}/{BADGES.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {BADGES.map((b) => {
            const has = badges.has(b.id);
            return (
              <div
                key={b.id}
                className={`rounded-2xl border p-4 text-center ${
                  has
                    ? "border-accent/30 bg-gradient-to-br from-accent/[0.08] to-transparent"
                    : "border-border bg-surface"
                }`}
              >
                <div
                  className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl ${
                    has
                      ? "bg-gradient-to-br from-accent/20 to-accent-2/20 text-accent-text"
                      : "bg-surface-2 text-faint opacity-50"
                  }`}
                >
                  <Glyph name={has ? badgeGlyph(b.id) : "lock"} className="h-6 w-6" />
                </div>
                <div className={`mt-2 text-sm font-bold ${has ? "text-fg" : "text-faint"}`}>
                  {b.title}
                </div>
                <div className="mt-0.5 text-xs leading-snug text-muted">{b.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useProgress } from "@/components/ProgressContext";
import { ProgressRing } from "@/components/ProgressRing";
import { Glyph, rankGlyph, badgeGlyph } from "@/components/glyphs";
import { BADGES } from "@/lib/gamification";
import { TOTAL_LESSONS } from "@/lib/curriculum";
import { ArrowRight, FlameIcon } from "@/components/Icons";

function Stat({
  value,
  label,
  icon,
}: {
  value: string | number;
  label: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 text-center">
      <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent">
        <Glyph name={icon} className="h-5 w-5" />
      </div>
      <div className="mt-1.5 text-2xl font-black text-fg">{value}</div>
      <div className="text-xs uppercase tracking-wider text-faint">{label}</div>
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
    longestStreak,
    count,
    quizzesCorrect,
    challengesSolved,
    badges,
    ready,
  } = useProgress();

  const unlocked = BADGES.filter((b) => badges.has(b.id)).length;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/[0.1] via-surface to-accent-2/[0.08] p-6 sm:p-8"
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <ProgressRing value={levelFraction} size={104} stroke={8}>
            <div className="grid place-items-center text-accent">
              <Glyph name={rankGlyph(rankName)} className="h-9 w-9" />
            </div>
          </ProgressRing>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-accent">
              Level {level}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-fg">{rankName}</h1>
            <p className="mt-1 text-muted">
              <span className="font-semibold text-fg">{xp} XP</span> ·{" "}
              {ready ? `${xpToNext} XP to level ${level + 1}` : "…"}
            </p>
            <div className="mx-auto mt-3 h-2 max-w-xs overflow-hidden rounded-full bg-border sm:mx-0">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500"
                style={{ width: `${Math.round(levelFraction * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3">
            <FlameIcon className="h-6 w-6 text-orange-500" />
            <div>
              <div className="text-2xl font-black text-fg">{streak}</div>
              <div className="text-[10px] uppercase tracking-wider text-faint">
                day streak
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon="book" value={`${count}/${TOTAL_LESSONS}`} label="Lessons" />
        <Stat icon="target" value={quizzesCorrect} label="Quizzes" />
        <Stat icon="swords" value={challengesSolved} label="Challenges" />
        <Stat icon="flame" value={longestStreak} label="Best streak" />
      </div>

      {/* Achievements */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight text-fg">Achievements</h2>
          <span className="rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-sm text-muted">
            {unlocked}/{BADGES.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {BADGES.map((b, i) => {
            const has = badges.has(b.id);
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className={`rounded-2xl border p-4 text-center transition-all ${
                  has
                    ? "border-accent/30 bg-gradient-to-br from-accent/[0.08] to-transparent"
                    : "border-border bg-surface"
                }`}
              >
                <div
                  className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl transition-all ${
                    has
                      ? "bg-gradient-to-br from-accent/20 to-accent-2/20 text-accent"
                      : "bg-surface-2 text-faint opacity-50"
                  }`}
                >
                  <Glyph
                    name={has ? badgeGlyph(b.id) : "lock"}
                    className="h-6 w-6"
                  />
                </div>
                <div
                  className={`mt-2 text-sm font-bold ${
                    has ? "text-fg" : "text-faint"
                  }`}
                >
                  {b.title}
                </div>
                <div className="mt-0.5 text-xs leading-snug text-muted">
                  {b.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/learn"
          className="group flex items-center gap-2 rounded-2xl bg-gradient-to-br from-accent to-accent-2 px-5 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
        >
          Keep learning
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/learn/review"
          className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-5 py-3 font-semibold text-fg transition-colors hover:border-accent/50"
        >
          <Glyph name="loop" className="h-4 w-4" />
          Practice past lessons
        </Link>
        <Link
          href="/learn/certificate"
          className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-5 py-3 font-semibold text-fg transition-colors hover:border-accent/50"
        >
          <Glyph name="gradcap" className="h-4 w-4" />
          Certificate
        </Link>
      </div>
    </div>
  );
}

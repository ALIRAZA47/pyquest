"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getAllLessons } from "@/lib/content";
import { useProgress } from "@/components/ProgressContext";
import { XP } from "@/lib/gamification";
import { fireConfetti } from "@/components/confetti";
import { Glyph } from "@/components/glyphs";
import { EmptyIllustration } from "@/components/Illustrations";
import { CheckIcon, CloseIcon, ArrowRight } from "@/components/Icons";

interface RQ {
  slug: string;
  lessonTitle: string;
  qIndex: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

const SESSION_SIZE = 10;

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ReviewPage() {
  const { completed, ready, reviewedAt, awardXp, markReviewed } = useProgress();
  const [session, setSession] = useState<RQ[] | null>(null);
  const [pos, setPos] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"loading" | "empty" | "playing" | "done">(
    "loading"
  );

  const build = useCallback(() => {
    const lessons = getAllLessons().filter((l) => completed.has(l.slug));
    // Prioritize lessons reviewed least recently.
    lessons.sort((a, b) => {
      const ra = reviewedAt[a.slug] ?? "";
      const rb = reviewedAt[b.slug] ?? "";
      return ra.localeCompare(rb);
    });
    const pool: RQ[] = [];
    for (const l of lessons) {
      l.blocks.forEach((blk, i) => {
        if (blk.type === "quiz") {
          pool.push({
            slug: l.slug,
            lessonTitle: l.title,
            qIndex: i,
            question: blk.question,
            options: blk.options,
            answerIndex: blk.answerIndex,
            explanation: blk.explanation,
          });
        }
      });
    }
    if (pool.length === 0) {
      setPhase("empty");
      return;
    }
    // Take a mix: keep priority order for the first chunk, then shuffle.
    const chosen = shuffle(pool).slice(0, Math.min(SESSION_SIZE, pool.length));
    setSession(chosen);
    setPos(0);
    setSelected(null);
    setScore(0);
    setPhase("playing");
  }, [completed, reviewedAt]);

  useEffect(() => {
    if (!ready) return;
    if (completed.size === 0) {
      setPhase("empty");
      return;
    }
    build();
    // Only build once on first ready; retry button rebuilds.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (phase === "loading") {
    return (
      <div className="grid min-h-[60vh] place-items-center text-muted">
        Loading your practice session…
      </div>
    );
  }

  if (phase === "empty") {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-6 text-center">
        <div>
          <EmptyIllustration className="mx-auto w-52" />
          <h1 className="mt-2 text-2xl font-black tracking-tight">
            Nothing to review yet
          </h1>
          <p className="mt-2 text-muted">
            Complete a few lessons first — their quizzes will show up here so you
            can lock in what you learned.
          </p>
          <Link
            href="/learn"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-accent to-accent-2 px-5 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
          >
            Go to lessons <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const total = session?.length ?? 0;
    const pct = total ? Math.round((score / total) * 100) : 0;
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl">{pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📖"}</div>
          <h1 className="mt-4 text-3xl font-black tracking-tight">
            {score} / {total} correct
          </h1>
          <p className="mt-2 text-muted">
            {pct >= 80
              ? "Outstanding recall! You really know this."
              : pct >= 50
              ? "Solid — a little more practice and you'll master it."
              : "Good effort. Revisit these lessons and try again!"}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={build}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-br from-accent to-accent-2 px-5 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
            >
              <Glyph name="loop" className="h-4 w-4" />
              Practice again
            </button>
            <Link
              href="/learn"
              className="rounded-2xl border border-border bg-surface px-5 py-3 font-semibold text-fg transition-colors hover:border-accent/50"
            >
              Back to lessons
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // playing
  const q = session![pos];
  const answered = selected !== null;
  const correct = selected === q.answerIndex;

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    if (i === q.answerIndex) {
      setScore((s) => s + 1);
      awardXp(`review:${q.slug}:${q.qIndex}:${today()}`, XP.REVIEW_CORRECT);
    }
    markReviewed(q.slug);
  };

  const next = () => {
    if (pos + 1 >= session!.length) {
      setPhase("done");
      if (score / session!.length >= 0.8) fireConfetti();
    } else {
      setPos((p) => p + 1);
      setSelected(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
          <Glyph name="loop" className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h1 className="text-xl font-black tracking-tight text-fg">Practice</h1>
          <p className="text-sm text-muted">Spaced review of what you've learned</p>
        </div>
        <span className="font-mono text-sm text-faint">
          {pos + 1} / {session!.length}
        </span>
      </div>

      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-300"
          style={{ width: `${((pos + (answered ? 1 : 0)) / session!.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={pos}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <div className="text-xs font-medium text-faint">
            From: {q.lessonTitle}
          </div>
          <p className="mt-1 text-lg font-semibold text-fg">{q.question}</p>

          <div className="mt-4 grid gap-2.5">
            {q.options.map((opt, i) => {
              const isChosen = selected === i;
              const isCorrectOpt = i === q.answerIndex;
              let state = "idle";
              if (answered) {
                if (isCorrectOpt) state = "correct";
                else if (isChosen) state = "wrong";
                else state = "dim";
              }
              return (
                <button
                  key={i}
                  type="button"
                  disabled={answered}
                  onClick={() => choose(i)}
                  className={[
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                    state === "idle" &&
                      "border-border bg-surface hover:border-accent/50 hover:bg-accent/[0.04]",
                    state === "correct" && "border-emerald-500/50 bg-emerald-500/10",
                    state === "wrong" && "border-rose-500/50 bg-rose-500/10",
                    state === "dim" && "border-border bg-surface opacity-55",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span
                    className={[
                      "grid h-6 w-6 shrink-0 place-items-center rounded-lg border font-mono text-xs",
                      state === "correct" && "border-emerald-500 bg-emerald-500 text-white",
                      state === "wrong" && "border-rose-500 bg-rose-500 text-white",
                      (state === "idle" || state === "dim") && "border-border text-muted",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {state === "correct" ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : state === "wrong" ? (
                      <CloseIcon className="h-3.5 w-3.5" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="flex-1 font-mono">{opt}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <div
                  className={`mt-4 rounded-xl border p-4 text-sm ${
                    correct
                      ? "border-emerald-500/30 bg-emerald-500/[0.07]"
                      : "border-amber-500/30 bg-amber-500/[0.07]"
                  }`}
                >
                  <p
                    className={`mb-1 font-semibold ${
                      correct ? "text-emerald-500" : "text-amber-500"
                    }`}
                  >
                    {correct ? `Correct! +${XP.REVIEW_CORRECT} XP` : "Not quite —"}
                  </p>
                  <p className="text-muted">{q.explanation}</p>
                </div>
                <button
                  type="button"
                  onClick={next}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-accent to-accent-2 px-5 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
                >
                  {pos + 1 >= session!.length ? "See results" : "Next question"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

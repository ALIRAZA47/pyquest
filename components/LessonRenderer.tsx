"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import type { Block, Lesson, LessonMeta } from "@/lib/types";
import { CodeBlock } from "./CodeBlock";
import { Callout } from "./Callout";
import { Quiz } from "./Quiz";
import { Exercise } from "./Exercise";
import { Markdown } from "./Markdown";
import { useProgress } from "./ProgressContext";
import {
  CheckIcon,
  ArrowLeft,
  ArrowRight,
  SparklesIcon,
} from "./Icons";

const DIFFICULTY_STYLE: Record<string, string> = {
  Beginner: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
  Intermediate: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  Advanced: "border-rose-500/30 bg-rose-500/10 text-rose-500",
};

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return (
        <div className="lesson-prose text-[15.5px] text-fg/90">
          <Markdown text={block.md} />
        </div>
      );
    case "heading":
      return (
        <h2 className="group mt-10 scroll-mt-24 text-xl font-bold tracking-tight text-fg sm:text-2xl">
          <span className="mr-2 text-accent/70">#</span>
          {block.text}
        </h2>
      );
    case "code":
      return <CodeBlock code={block.code} output={block.output} caption={block.caption} />;
    case "callout":
      return <Callout variant={block.variant} title={block.title} md={block.md} />;
    case "quiz":
      return (
        <Quiz
          question={block.question}
          options={block.options}
          answerIndex={block.answerIndex}
          explanation={block.explanation}
        />
      );
    default:
      return null;
  }
}

export function LessonRenderer({
  lesson,
  prev,
  next,
  index,
  total,
}: {
  lesson: Lesson;
  prev?: LessonMeta;
  next?: LessonMeta;
  index: number;
  total: number;
}) {
  const { isComplete, toggle, markComplete } = useProgress();
  const done = isComplete(lesson.slug);

  // Reset scroll on lesson change.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [lesson.slug]);

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-medium text-muted">
            {lesson.category}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 font-medium ${
              DIFFICULTY_STYLE[lesson.difficulty] ?? DIFFICULTY_STYLE.Beginner
            }`}
          >
            {lesson.difficulty}
          </span>
          <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-medium text-muted">
            ⏱ {lesson.readingTime}
          </span>
          <span className="ml-auto font-mono text-faint">
            {String(index + 1).padStart(2, "0")} / {total}
          </span>
        </div>

        <div className="mt-5 flex items-start gap-4">
          <span className="text-4xl sm:text-5xl" aria-hidden>
            {lesson.emoji}
          </span>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-fg sm:text-4xl">
              {lesson.title}
            </h1>
            <p className="mt-2 text-base text-muted sm:text-lg">{lesson.summary}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggle(lesson.slug)}
          className={`mt-5 flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all ${
            done
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500"
              : "border-border bg-surface text-muted hover:border-accent/50 hover:text-accent"
          }`}
        >
          <span
            className={`grid h-5 w-5 place-items-center rounded-md border ${
              done ? "border-emerald-500 bg-emerald-500 text-white" : "border-border"
            }`}
          >
            {done && <CheckIcon className="h-3.5 w-3.5" />}
          </span>
          {done ? "Completed" : "Mark as complete"}
        </button>
      </motion.header>

      <div className="my-8 h-px bg-gradient-to-r from-border via-border to-transparent" />

      {/* Blocks */}
      <div>
        {lesson.blocks.map((block, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: Math.min(i * 0.045, 0.4),
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <BlockView block={block} />
          </motion.div>
        ))}
      </div>

      {/* Key takeaways */}
      {lesson.keyTakeaways.length > 0 && (
        <section className="mt-10 rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/[0.06] to-accent-2/[0.04] p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-accent" />
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-accent">
              Key takeaways
            </h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {lesson.keyTakeaways.map((t, i) => (
              <li key={i} className="flex gap-3 text-sm text-fg/90">
                <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                  <CheckIcon className="h-2.5 w-2.5" />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Exercise */}
      {lesson.exercise && <Exercise exercise={lesson.exercise} />}

      {/* Completion nudge + navigation */}
      <div className="mt-12">
        {!done && (
          <button
            type="button"
            onClick={() => markComplete(lesson.slug)}
            className="mb-6 w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] px-5 py-4 text-center text-sm font-semibold text-emerald-500 transition-colors hover:bg-emerald-500/10"
          >
            ✓ Finished this lesson? Mark it complete and keep the streak going!
          </button>
        )}

        <nav className="grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/learn/${prev.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-all hover:border-accent/50 hover:shadow-soft"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 text-faint transition-transform group-hover:-translate-x-1 group-hover:text-accent" />
              <span className="min-w-0">
                <span className="block text-xs text-faint">Previous</span>
                <span className="block truncate font-semibold text-fg">
                  {prev.emoji} {prev.title}
                </span>
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? (
            <Link
              href={`/learn/${next.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-right transition-all hover:border-accent/50 hover:shadow-soft sm:justify-end"
            >
              <span className="min-w-0">
                <span className="block text-xs text-faint">Up next</span>
                <span className="block truncate font-semibold text-fg">
                  {next.emoji} {next.title}
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-faint transition-transform group-hover:translate-x-1 group-hover:text-accent" />
            </Link>
          ) : (
            <Link
              href="/learn"
              className="group flex items-center justify-end gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-right transition-all hover:bg-accent/15"
            >
              <span>
                <span className="block text-xs text-accent/70">You made it</span>
                <span className="block font-semibold text-accent">
                  🎓 Back to dashboard
                </span>
              </span>
              <ArrowRight className="h-5 w-5 text-accent" />
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}

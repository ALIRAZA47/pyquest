"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import type { Block, Lesson, LessonMeta } from "@/lib/types";
import { CodeBlock } from "./CodeBlock";
import { Callout } from "./Callout";
import { Quiz } from "./Quiz";
import { Exercise } from "./Exercise";
import { Slides } from "./Slides";
import { Challenges } from "./Challenges";
import { LessonToc } from "./LessonToc";
import { LessonVisualizer } from "./Visualizers";
import { Markdown } from "./Markdown";
import { useProgress } from "./ProgressContext";
import { Glyph, lessonGlyph } from "./glyphs";
import {
  CheckIcon,
  ArrowLeft,
  ArrowRight,
  SparklesIcon,
  PlayIcon,
} from "./Icons";

const DIFFICULTY_STYLE: Record<string, string> = {
  Beginner: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
  Intermediate: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  Advanced: "border-rose-500/30 bg-rose-500/10 text-rose-500",
};

function BlockView({
  block,
  slug,
  index,
  codeLang,
  runnable,
  webRun,
}: {
  block: Block;
  slug: string;
  index: number;
  codeLang: string;
  runnable: boolean;
  webRun: boolean;
}) {
  switch (block.type) {
    case "text":
      return (
        <div className="lesson-prose text-[15.5px] text-fg/90">
          <Markdown text={block.md} />
        </div>
      );
    case "heading":
      return (
        <h2
          id={`h-${index}`}
          className="group mt-10 scroll-mt-24 text-xl font-bold tracking-tight text-fg sm:text-2xl"
        >
          <span className="mr-2 text-accent/70">#</span>
          {block.text}
        </h2>
      );
    case "code":
      return (
        <CodeBlock
          code={block.code}
          output={block.output}
          caption={block.caption}
          lang={block.lang || codeLang}
          runnable={runnable}
          webRun={webRun}
        />
      );
    case "callout":
      return <Callout variant={block.variant} title={block.title} md={block.md} />;
    case "quiz":
      return (
        <Quiz
          question={block.question}
          options={block.options}
          answerIndex={block.answerIndex}
          explanation={block.explanation}
          xpKey={`quiz:${slug}:${index}`}
        />
      );
    default:
      return null;
  }
}

function WalkthroughDeck({ slides }: { slides: NonNullable<Lesson["slides"]> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mt-8 flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-accent/10 text-accent">
          <PlayIcon className="h-3 w-3" />
        </span>
        <h2 className="text-lg font-bold tracking-tight text-fg">
          See it in action
        </h2>
        <span className="hidden text-sm text-faint sm:inline">
          — step through the idea, then dive into the details below.
        </span>
      </div>
      <Slides slides={slides} />
    </motion.div>
  );
}

export function LessonRenderer({
  lesson,
  prev,
  next,
  index,
  total,
  base = "/learn",
  runtime = "python",
  codeLang = "py",
  courseId,
}: {
  lesson: Lesson;
  prev?: LessonMeta;
  next?: LessonMeta;
  index: number;
  total: number;
  base?: string;
  runtime?: string;
  codeLang?: string;
  courseId?: string;
}) {
  const runnable = runtime === "python";
  // Web courses run in a sandboxed iframe — except display-only courses: Node
  // (require/fs/http have no browser runtime) and MCP (server code needs stdio,
  // the MCP SDK, and a real host, so its examples are read-only).
  const webRun =
    runtime === "web" &&
    courseId !== "node" &&
    courseId !== "mcp" &&
    courseId !== "llm";
  const { isComplete, toggle, markComplete, celebrate } = useProgress();
  const done = isComplete(lesson.slug);

  const completeAndCelebrate = () => {
    if (!isComplete(lesson.slug)) {
      markComplete(lesson.slug);
      celebrate();
    }
  };

  const headings = lesson.blocks
    .map((b, i) => (b.type === "heading" ? { id: `h-${i}`, text: b.text } : null))
    .filter((h): h is { id: string; text: string } => h !== null);

  // Show the walkthrough deck right after the opening paragraph (index 0 when
  // it's a text block), or before all blocks otherwise.
  const deckAfter = lesson.blocks[0]?.type === "text" ? 0 : -1;

  // Reset scroll on lesson change.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [lesson.slug]);

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <LessonToc headings={headings} />
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
          <span
            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent/15 to-accent-2/15 text-accent sm:h-16 sm:w-16"
            aria-hidden
          >
            <Glyph
              name={lessonGlyph(lesson.slug)}
              className="h-7 w-7 sm:h-8 sm:w-8"
            />
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
          onClick={() => {
            if (!done) celebrate();
            toggle(lesson.slug);
          }}
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

      {/* Interactive walkthrough — placed before the deep-dive content when
          there's no leading paragraph, otherwise right after the intro. */}
      {lesson.slides && lesson.slides.length > 0 && deckAfter === -1 && (
        <WalkthroughDeck slides={lesson.slides} />
      )}

      {/* Blocks */}
      <div>
        {lesson.blocks.map((block, i) => (
          <div key={i}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: Math.min(i * 0.045, 0.4),
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <BlockView
                block={block}
                slug={lesson.slug}
                index={i}
                codeLang={codeLang}
                runnable={runnable}
                webRun={webRun}
              />
            </motion.div>
            {lesson.slides &&
              lesson.slides.length > 0 &&
              i === deckAfter && <WalkthroughDeck slides={lesson.slides} />}
          </div>
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

      {/* Interactive concept visualizer (only for supported lessons) */}
      <LessonVisualizer slug={lesson.slug} />

      {/* Interactive challenges */}
      {lesson.challenges && lesson.challenges.length > 0 && (
        <Challenges challenges={lesson.challenges} slug={lesson.slug} lang={codeLang} />
      )}

      {/* Exercise */}
      {lesson.exercise && (
        <Exercise
          exercise={lesson.exercise}
          slug={lesson.slug}
          runnable={runnable}
          webRun={webRun}
          lang={codeLang}
        />
      )}

      {/* Completion nudge + navigation */}
      <div className="mt-12">
        {!done && (
          <button
            type="button"
            onClick={completeAndCelebrate}
            className="mb-6 w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] px-5 py-4 text-center text-sm font-semibold text-emerald-500 transition-colors hover:bg-emerald-500/10"
          >
            ✓ Finished this lesson? Mark it complete and keep the streak going!
          </button>
        )}

        <nav className="grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`${base}/${prev.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-all hover:border-accent/50 hover:shadow-soft"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 text-faint transition-transform group-hover:-translate-x-1 group-hover:text-accent" />
              <span className="min-w-0">
                <span className="block text-xs text-faint">Previous</span>
                <span className="flex items-center gap-1.5 font-semibold text-fg">
                  <Glyph
                    name={lessonGlyph(prev.slug)}
                    className="h-4 w-4 shrink-0 text-accent"
                  />
                  <span className="truncate">{prev.title}</span>
                </span>
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? (
            <Link
              href={`${base}/${next.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-right transition-all hover:border-accent/50 hover:shadow-soft sm:justify-end"
            >
              <span className="min-w-0">
                <span className="block text-xs text-faint">Up next</span>
                <span className="flex items-center justify-end gap-1.5 font-semibold text-fg">
                  <span className="truncate">{next.title}</span>
                  <Glyph
                    name={lessonGlyph(next.slug)}
                    className="h-4 w-4 shrink-0 text-accent"
                  />
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-faint transition-transform group-hover:translate-x-1 group-hover:text-accent" />
            </Link>
          ) : (
            <Link
              href={base}
              className="group flex items-center justify-end gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-right transition-all hover:bg-accent/15"
            >
              <span>
                <span className="block text-xs text-accent/70">You made it</span>
                <span className="flex items-center justify-end gap-1.5 font-semibold text-accent">
                  <Glyph name="gradcap" className="h-4 w-4" />
                  Back to dashboard
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

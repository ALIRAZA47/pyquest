"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Slide } from "@/lib/types";
import { CodeBlock } from "./CodeBlock";
import { Markdown } from "./Markdown";
import {
  ArrowLeft,
  ArrowRight,
  SparklesIcon,
  CheckIcon,
  LightbulbIcon,
} from "./Icons";

export function Slides({ slides }: { slides: Slide[] }) {
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [seen, setSeen] = useState<Set<number>>(new Set([0]));
  const containerRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      setDir(clamped >= index ? 1 : -1);
      setIndex(clamped);
      setSeen((s) => new Set(s).add(clamped));
    },
    [index, total]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index - 1);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go, index]);

  if (!total) return null;

  const slide = slides[index];
  const isLast = index === total - 1;
  const isFirst = index === 0;
  const progress = ((index + 1) / total) * 100;
  const completed = seen.size >= total;

  return (
    <section
      ref={containerRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Interactive walkthrough"
      className="my-6 overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-accent/[0.07] via-surface to-accent-2/[0.05] outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      {/* Header + progress */}
      <div className="flex items-center gap-2 px-5 pt-4">
        <SparklesIcon className="h-4 w-4 text-accent" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
          Visual walkthrough
        </span>
        {completed && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-500">
            <CheckIcon className="h-3 w-3" /> Complete
          </span>
        )}
        <span className="ml-auto font-mono text-xs text-faint">
          {index + 1} / {total}
        </span>
      </div>
      <div className="mx-5 mt-3 h-1 overflow-hidden rounded-full bg-border/70">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Slide body */}
      <div className="relative px-5 pb-2 pt-4">
        <div className="min-h-[240px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/15 font-bold text-accent">
                  {index + 1}
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight text-fg">
                  {slide.title}
                </h3>
              </div>

              {slide.body && (
                <div className="mt-3 text-[15px] text-fg/90 [&_p]:my-2">
                  <Markdown text={slide.body} />
                </div>
              )}

              {slide.code && (
                <CodeBlock code={slide.code} output={slide.output} />
              )}

              {slide.tip && (
                <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-3 text-sm text-fg/90">
                  <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <span>{slide.tip}</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 border-t border-accent/15 px-5 py-3">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={isFirst}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-sm font-medium text-muted transition-colors enabled:hover:border-accent/50 enabled:hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-1 items-center justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-accent"
                  : seen.has(i)
                  ? "w-2 bg-accent/40 hover:bg-accent/60"
                  : "w-2 bg-border hover:bg-faint"
              }`}
            />
          ))}
        </div>

        {isLast ? (
          <span className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-500">
            <CheckIcon className="h-4 w-4" />
            Done
          </span>
        ) : (
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-accent to-accent-2 px-3.5 py-1.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}

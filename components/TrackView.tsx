"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { coursesInTrack, trackInfo } from "@/lib/courses";
import { WebIllustration, AiIllustration, FloatingShapes } from "./Illustrations";
import { Glyph } from "./glyphs";
import { ThemeToggle } from "./ThemeToggle";
import { ArrowRight, ArrowLeft, SparklesIcon } from "./Icons";
import { useProgress } from "./ProgressContext";

const ILLUS: Record<string, (p: { className?: string }) => JSX.Element> = {
  core: AiIllustration,
  web: WebIllustration,
};

const HIGHLIGHTS: Record<string, string[]> = {
  python: ["63 lessons", "Live code + projects"],
  ml: ["Animated algorithms", "See models learn"],
  ai: ["Animated algorithms", "Neural nets & search"],
  html: ["Beginner-friendly", "Semantic & accessible"],
  css: ["Box model & Flexbox", "Grid & responsive"],
  js: ["The DOM & events", "Async & the event loop"],
  ts: ["Types & interfaces", "Generics"],
  react: ["Components & props", "State & hooks"],
  node: ["HTTP servers", "REST APIs"],
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function TrackView({ trackId }: { trackId: string }) {
  const info = trackInfo(trackId);
  const courses = coursesInTrack(trackId);
  const { isComplete } = useProgress();
  const Illus = ILLUS[trackId] ?? AiIllustration;

  if (!info) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingShapes />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-grid" />
      <div className="pointer-events-none absolute left-1/2 top-[-10%] -z-10 h-[480px] w-[1000px] max-w-[95vw] -translate-x-1/2 rounded-full bg-accent/20 blur-[130px]" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent">
          <ArrowLeft className="h-4 w-4" />
          All paths
        </Link>
        <ThemeToggle />
      </header>

      {/* Track hero */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-6 px-5 pb-6 pt-6 sm:px-8 lg:grid-cols-2 lg:gap-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <SparklesIcon className="h-3.5 w-3.5" />
            {courses.length} courses in this path
          </span>
          <h1 className="mt-5 flex items-center gap-3 text-4xl font-black tracking-tight sm:text-5xl">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-glow">
              <Glyph name={info.glyph} className="h-6 w-6" />
            </span>
            {info.label}
          </h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{info.description}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto w-full max-w-[420px]"
        >
          <Illus className="w-full" />
        </motion.div>
      </section>

      {/* Course cards */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="mx-auto grid w-full max-w-6xl gap-5 px-5 py-10 sm:px-8 lg:grid-cols-3"
      >
        {courses.map((c, i) => {
          const done = c.course.allSlugs.filter((s) => isComplete(s)).length;
          const total = c.course.totalLessons;
          return (
            <motion.div
              key={c.id}
              variants={item}
              style={
                {
                  "--accent": c.accent,
                  "--accent-2": c.accent2,
                } as React.CSSProperties
              }
            >
              <Link
                href={c.base}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow sm:p-7"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
                <div className="flex items-center gap-3">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-glow">
                    <Glyph name={c.glyph} className="h-7 w-7" />
                  </span>
                  {i === 0 && (
                    <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-faint">
                      Start here
                    </span>
                  )}
                </div>
                <h2 className="mt-5 text-2xl font-black tracking-tight text-fg">{c.title}</h2>
                <p className="mt-1 font-semibold text-accent">{c.tagline}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{c.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(HIGHLIGHTS[c.id] ?? []).map((h) => (
                    <span key={h} className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted">
                      {h}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-semibold text-accent">
                    {done > 0 ? "Continue" : "Start course"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="font-mono text-xs text-faint">{done}/{total}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.section>
    </div>
  );
}

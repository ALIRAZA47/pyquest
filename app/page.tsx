"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TRACKS, coursesInTrack } from "@/lib/courses";
import { WebIllustration, AiIllustration, FloatingShapes } from "@/components/Illustrations";
import { Glyph } from "@/components/glyphs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, SparklesIcon } from "@/components/Icons";

const ILLUS: Record<string, (p: { className?: string }) => JSX.Element> = {
  core: AiIllustration,
  web: WebIllustration,
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Splash() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <FloatingShapes />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-grid" />
      <div className="pointer-events-none absolute left-1/2 top-[-12%] -z-10 h-[560px] w-[1100px] max-w-[96vw] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-8%] -z-10 h-[420px] w-[420px] rounded-full bg-accent-2/20 blur-[130px]" />

      {/* Nav */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-glow">
            <Glyph name="snake" className="h-5 w-5" />
          </span>
          <span className="text-xl font-black tracking-tight text-gradient">Quest</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero + choices */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-8 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <SparklesIcon className="h-3.5 w-3.5" />
            Interactive courses · beautifully taught
          </span>
          <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            What do you want to <span className="animated-gradient-text">learn?</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Pick a path to begin. You can switch anytime — your progress, XP, and
            streak follow you everywhere.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } } }}
          className="mt-12 grid gap-6 md:grid-cols-2"
        >
          {TRACKS.map((tr) => {
            const Illus = ILLUS[tr.id];
            const courses = coursesInTrack(tr.id);
            return (
              <motion.div key={tr.id} variants={item}>
                <Link
                  href={`/tracks/${tr.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-surface/80 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-glow sm:p-8"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl transition-opacity duration-300 group-hover:bg-accent/20" />
                  <div className="relative mx-auto w-full max-w-[360px]">
                    <Illus className="w-full" />
                  </div>
                  <div className="mt-4 flex items-center gap-2.5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-glow">
                      <Glyph name={tr.glyph} className="h-5 w-5" />
                    </span>
                    <h2 className="text-2xl font-black tracking-tight text-fg">{tr.label}</h2>
                  </div>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">
                    {tr.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {courses.map((c) => (
                      <span
                        key={c.id}
                        className="flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-muted"
                      >
                        <Glyph name={c.glyph} className="h-3 w-3" />
                        {c.name}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold text-accent">
                    Explore {courses.length} courses
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-5 pb-8 pt-4 text-center text-sm text-faint sm:px-8">
        Built with care · Quest — learn programming, AI &amp; the web, beautifully.
      </footer>
    </div>
  );
}

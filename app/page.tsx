"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TRACKS, coursesInTrack } from "@/lib/courses";
import { Glyph } from "@/components/glyphs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight } from "@/components/Icons";

// Per-track hero styling for the splash cards.
const TRACK_META: Record<string, { grad: string; icon: string }> = {
  core: { grad: "from-violet-500 via-purple-500 to-fuchsia-400", icon: "atom" },
  web: { grad: "from-blue-500 via-sky-500 to-cyan-400", icon: "browser" },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Splash() {
  const totalLessons = TRACKS.reduce(
    (n, t) => n + coursesInTrack(t.id).reduce((m, c) => m + c.course.totalLessons, 0),
    0
  );

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.5]" />
      <div className="pointer-events-none absolute left-1/2 top-[-14%] -z-10 h-[560px] w-[1100px] max-w-[96vw] -translate-x-1/2 rounded-full bg-accent/20 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-[-12%] right-[-6%] -z-10 h-[440px] w-[440px] rounded-full bg-accent-2/15 blur-[140px]" />

      {/* Floating code chips */}
      <div className="pointer-events-none absolute right-[8%] top-[22%] -z-10 hidden animate-float rounded-xl border border-border bg-surface/60 px-3 py-1.5 font-mono text-sm text-muted backdrop-blur-sm sm:block">
        <span className="text-accent-text">def</span> solve():
      </div>
      <div
        className="pointer-events-none absolute bottom-[14%] left-[7%] -z-10 hidden animate-float rounded-xl border border-border bg-surface/60 px-3 py-1.5 font-mono text-sm text-muted backdrop-blur-sm sm:block"
        style={{ animationDelay: "1.5s" }}
      >
        <span className="text-accent-text">&lt;/&gt;</span> ship it
      </div>
      <div className="pointer-events-none absolute left-[17%] top-[18%] -z-10 h-9 w-9 animate-float rounded-lg bg-accent/25" style={{ animationDelay: "0.8s" }} />

      {/* Nav */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-glow">
            <Glyph name="code" className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight text-fg">Quest</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.08] px-3.5 py-1.5 font-mono text-[13px] font-semibold text-accent-text">
            {totalLessons}+ interactive lessons · free · no account
          </span>
          <h1 className="mx-auto mt-7 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight text-fg sm:text-7xl">
            Learn to build,
            <br />
            by{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              actually building.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Run code in your browser, watch concepts animate, and earn your way from
            your first variable to shipping AI. Pick a path to begin.
          </p>
        </motion.div>

        {/* Track cards */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } } }}
          className="mx-auto mt-14 grid w-full max-w-5xl gap-6 md:grid-cols-2"
        >
          {TRACKS.map((tr) => {
            const meta = TRACK_META[tr.id] ?? TRACK_META.core;
            const courses = coursesInTrack(tr.id);
            const lessons = courses.reduce((m, c) => m + c.course.totalLessons, 0);
            return (
              <motion.div key={tr.id} variants={item}>
                <Link
                  href={`/tracks/${tr.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-card"
                >
                  {/* Gradient header panel */}
                  <div className={`relative flex h-40 items-end bg-gradient-to-br ${meta.grad} p-6`}>
                    <Glyph name={meta.icon} className="absolute right-5 top-5 h-9 w-9 text-white/90" />
                    <span className="font-mono text-[13px] font-medium text-white/80">
                      {courses.length} courses · {lessons} lessons
                    </span>
                  </div>
                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h2 className="font-display text-2xl font-bold tracking-tight text-fg">
                      {tr.label}
                    </h2>
                    <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-muted">
                      {tr.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {courses.slice(0, 3).map((c) => (
                        <span
                          key={c.id}
                          className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-muted"
                        >
                          {c.name}
                        </span>
                      ))}
                      {courses.length > 3 && (
                        <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-faint">
                          +{courses.length - 3}
                        </span>
                      )}
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 font-semibold text-accent-text">
                      Start this path
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-5 pb-10 pt-6 text-center text-sm text-faint sm:px-8">
        Built with care · learn programming, AI &amp; the web, beautifully.
      </footer>
    </div>
  );
}

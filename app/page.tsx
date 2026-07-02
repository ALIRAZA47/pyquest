"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { COURSE_LIST } from "@/lib/courses";
import { Glyph } from "@/components/glyphs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, SparklesIcon, PlayIcon, TargetIcon, RocketIcon } from "@/components/Icons";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const HIGHLIGHTS: Record<string, string[]> = {
  python: ["63 lessons", "Live code + projects"],
  ml: ["Animated algorithms", "See models learn"],
  ai: ["Animated algorithms", "Search, games & neural nets"],
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-grid" />
      <div className="pointer-events-none absolute left-1/2 top-[-10%] -z-10 h-[520px] w-[1000px] max-w-[95vw] -translate-x-1/2 rounded-full bg-accent/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-5%] top-[15%] -z-10 h-[380px] w-[380px] rounded-full bg-accent-2/20 blur-[120px]" />

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-glow">
            <Glyph name="snake" className="h-5 w-5" />
          </span>
          <span className="text-xl font-black tracking-tight text-gradient">PyQuest</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-5 pb-6 pt-12 text-center sm:px-8 lg:pt-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <SparklesIcon className="h-3.5 w-3.5" />
            Three interactive courses · one beautiful home
          </span>
          <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Learn to code, then teach
            <br />
            machines to <span className="animated-gradient-text">think.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Start with Python, then explore Machine Learning and AI — with lessons
            that don't just tell you how algorithms work, they{" "}
            <span className="font-semibold text-fg">show you, in motion</span>.
          </p>
        </motion.div>
      </section>

      {/* Course cards */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-6xl gap-5 px-5 py-10 sm:px-8 lg:grid-cols-3"
      >
        {COURSE_LIST.map((c, i) => (
          <motion.div key={c.id} variants={item}>
            <Link
              href={c.base}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow sm:p-7"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="flex items-center gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-glow">
                  <Glyph name={c.glyph} className="h-7 w-7" />
                </span>
                <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-faint">
                  {i === 0 ? "Start here" : `Course ${i + 1}`}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-black tracking-tight text-fg">
                {c.title}
              </h2>
              <p className="mt-1 font-semibold text-accent">{c.tagline}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {c.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {(HIGHLIGHTS[c.id] ?? []).map((h) => (
                  <span
                    key={h}
                    className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted"
                  >
                    {h}
                  </span>
                ))}
              </div>

              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-accent">
                {i === 0 ? "Begin learning" : "Explore course"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* Why */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: PlayIcon, title: "See it in motion", body: "Animated visualizers show gradient descent, k-means, A* search, minimax and neural nets working step by step." },
            { icon: TargetIcon, title: "Learn by doing", body: "Runnable code, interactive challenges, quizzes and hands-on projects — not just walls of text." },
            { icon: RocketIcon, title: "One shared journey", body: "Your XP, streak, levels and badges carry across all three courses. Keep the momentum going." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-surface p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-fg">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-faint">
          Built with care · PyQuest — learn Python, Machine Learning &amp; AI, beautifully.
        </p>
      </section>
    </div>
  );
}

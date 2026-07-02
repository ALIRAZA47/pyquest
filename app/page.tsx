"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CURRICULUM, TOTAL_LESSONS, ALL_SLUGS } from "@/lib/curriculum";
import { CodeBlock } from "@/components/CodeBlock";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowRight,
  SparklesIcon,
  PlayIcon,
  TargetIcon,
  FlameIcon,
  BookIcon,
  RocketIcon,
} from "@/components/Icons";

const HERO_CODE = `def greet(name):
    return f"Hi, {name}! Welcome to Python 🐍"

learners = ["you", "the curious", "future devs"]
for who in learners:
    print(greet(who))`;

const HERO_OUTPUT = `Hi, you! Welcome to Python 🐍
Hi, the curious! Welcome to Python 🐍
Hi, future devs! Welcome to Python 🐍`;

const FEATURES = [
  {
    icon: PlayIcon,
    title: "Runnable examples",
    body: "Every concept comes with real, copyable code and its exact output — press Run to see what happens.",
  },
  {
    icon: TargetIcon,
    title: "Quick checks",
    body: "Bite-sized quizzes after each topic lock in what you just learned, with instant feedback.",
  },
  {
    icon: FlameIcon,
    title: "Hands-on practice",
    body: "Finish each lesson with an exercise — plus a hint and a full solution when you're ready.",
  },
  {
    icon: BookIcon,
    title: "Truly from scratch",
    body: "No prior coding needed. We explain the why behind everything, in plain, friendly language.",
  },
  {
    icon: SparklesIcon,
    title: "Beautiful & focused",
    body: "A calm, distraction-free reader with gorgeous light & dark themes and smooth animations.",
  },
  {
    icon: RocketIcon,
    title: "Track your progress",
    body: "Tick off lessons as you go and watch your completion ring fill across all 14 chapters.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Home() {
  const firstSlug = ALL_SLUGS[0];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-grid" />
      <div className="pointer-events-none absolute left-1/2 top-[-10%] -z-10 h-[500px] w-[900px] max-w-[95vw] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-5%] top-[20%] -z-10 h-[380px] w-[380px] rounded-full bg-accent-2/20 blur-[120px]" />

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-lg shadow-glow">
            🐍
          </span>
          <span className="text-xl font-black tracking-tight text-gradient">PyQuest</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/learn"
            className="rounded-xl bg-fg px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
          >
            Start learning
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-8 pt-10 sm:px-8 lg:grid-cols-2 lg:gap-14 lg:pt-16">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              <SparklesIcon className="h-3.5 w-3.5" />
              {TOTAL_LESSONS}+ interactive lessons · zero to confident
            </span>
          </motion.div>
          <motion.h1
            variants={item}
            className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Learn Python,
            <br />
            <span className="animated-gradient-text">beautifully.</span>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-5 max-w-md text-lg leading-relaxed text-muted"
          >
            The friendliest, most complete way to go from “what is code?” to
            writing real Python — one delightful, click-through lesson at a time.
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/learn/${firstSlug}`}
              className="group flex items-center gap-2 rounded-2xl bg-gradient-to-br from-accent to-accent-2 px-6 py-3.5 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
            >
              Begin lesson 1
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/learn"
              className="rounded-2xl border border-border bg-surface px-6 py-3.5 font-semibold text-fg transition-colors hover:border-accent/50"
            >
              Browse the curriculum
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
          >
            {[
              [`${TOTAL_LESSONS}`, "lessons"],
              ["14", "chapters"],
              ["100%", "free & offline"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-black text-fg">{n}</div>
                <div className="text-xs uppercase tracking-wider text-faint">{l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-accent/20 to-accent-2/20 blur-2xl" />
          <CodeBlock code={HERO_CODE} output={HERO_OUTPUT} caption="hello.py" />
          <p className="mt-3 text-center text-sm text-faint">
            ↑ Real Python. Hit <span className="font-semibold text-muted">Run</span> to
            see the output.
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Everything you need to actually{" "}
            <span className="text-gradient">get it</span>.
          </h2>
          <p className="mt-4 text-muted">
            Reading about code isn't enough. PyQuest blends clear explanations,
            live examples, checks, and practice into one smooth flow.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <motion.div
              variants={item}
              key={f.title}
              className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-soft"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-fg">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Curriculum preview */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            The complete roadmap
          </h2>
          <p className="mt-4 text-muted">
            Fourteen carefully-ordered chapters take you from your first
            <code className="mx-1 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm text-accent">
              print()
            </code>
            all the way to decorators, generators, and beyond.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CURRICULUM.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
            >
              <Link
                href={`/learn/${cat.slugs[0]}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-all hover:border-accent/40 hover:shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-xl">
                    {cat.emoji}
                  </span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-faint">
                      Chapter {i + 1}
                    </div>
                    <h3 className="font-bold text-fg group-hover:text-accent">
                      {cat.name}
                    </h3>
                  </div>
                  <span className="ml-auto rounded-full bg-surface-2 px-2 py-1 font-mono text-[11px] text-faint">
                    {cat.slugs.length}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {cat.blurb}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/10 via-surface to-accent-2/10 p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
          <div className="relative">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Your Python journey starts now.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">
              It's free, works offline, and remembers your progress. All you
              need is curiosity.
            </p>
            <Link
              href={`/learn/${firstSlug}`}
              className="group mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-accent to-accent-2 px-8 py-4 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
            >
              Start with lesson 1
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-faint">
          Built with 🐍 &amp; care · PyQuest — the beautiful way to learn Python.
        </p>
      </section>
    </div>
  );
}

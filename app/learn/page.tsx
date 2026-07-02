"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getNavSections } from "@/lib/content";
import { ALL_SLUGS, TOTAL_LESSONS } from "@/lib/curriculum";
import { useProgress } from "@/components/ProgressContext";
import { ProgressRing } from "@/components/ProgressRing";
import { Glyph, categoryGlyph, lessonGlyph } from "@/components/glyphs";
import { CheckIcon, ArrowRight, TargetIcon } from "@/components/Icons";

const SECTIONS = getNavSections();

const DIFF_DOT: Record<string, string> = {
  Beginner: "bg-emerald-500",
  Intermediate: "bg-amber-500",
  Advanced: "bg-rose-500",
};

export default function LearnDashboard() {
  const { isComplete, count, ready } = useProgress();
  const pct = TOTAL_LESSONS ? count / TOTAL_LESSONS : 0;

  const nextSlug = ALL_SLUGS.find((s) => !isComplete(s)) ?? ALL_SLUGS[0];
  const allDone = ready && count >= TOTAL_LESSONS;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/[0.08] via-surface to-accent-2/[0.06] p-6 sm:p-8"
      >
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <ProgressRing value={pct} size={92} stroke={7}>
            <div className="text-center">
              <div className="text-lg font-black text-fg">
                {Math.round(pct * 100)}%
              </div>
            </div>
          </ProgressRing>
          <div className="flex-1">
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              {allDone
                ? "You finished the course! 🎓"
                : count > 0
                ? "Welcome back 👋"
                : "Let's learn Python 🐍"}
            </h1>
            <p className="mt-1.5 text-muted">
              {allDone
                ? "Incredible work. Revisit any lesson anytime — you now know the fundamentals."
                : `You've completed ${count} of ${TOTAL_LESSONS} lessons. Keep the momentum going!`}
            </p>
            <Link
              href={`/learn/${nextSlug}`}
              className="group mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-accent to-accent-2 px-5 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
            >
              {count > 0 && !allDone ? "Continue learning" : "Start learning"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Curriculum */}
      <div className="mt-10 space-y-10">
        {SECTIONS.map((section, si) => {
          const doneInSection = section.lessons.filter((l) =>
            isComplete(l.slug)
          ).length;
          return (
            <section key={section.name}>
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Glyph name={categoryGlyph(section.name)} className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-faint">
                      Chapter {si + 1}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-fg">{section.name}</h2>
                </div>
                <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted">
                  {doneInSection}/{section.lessons.length}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {section.lessons.map((lesson, li) => {
                  const done = isComplete(lesson.slug);
                  const num = ALL_SLUGS.indexOf(lesson.slug) + 1;
                  return (
                    <motion.div
                      key={lesson.slug}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: (li % 2) * 0.04 }}
                    >
                      <Link
                        href={`/learn/${lesson.slug}`}
                        className="group flex h-full items-start gap-3 rounded-2xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-soft"
                      >
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-accent"
                          aria-hidden
                        >
                          <Glyph name={lessonGlyph(lesson.slug)} className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-faint">
                              {String(num).padStart(2, "0")}
                            </span>
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                DIFF_DOT[lesson.difficulty] ?? "bg-emerald-500"
                              }`}
                            />
                            <span className="text-[11px] text-faint">
                              {lesson.difficulty}
                            </span>
                          </div>
                          <h3 className="mt-0.5 truncate font-semibold text-fg group-hover:text-accent">
                            {lesson.title}
                          </h3>
                          <p className="mt-0.5 line-clamp-2 text-sm text-muted">
                            {lesson.summary}
                          </p>
                        </div>
                        <span
                          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                            done
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-border text-transparent group-hover:border-accent/50"
                          }`}
                        >
                          {done ? (
                            <CheckIcon className="h-3.5 w-3.5" />
                          ) : (
                            <TargetIcon className="h-3 w-3 text-transparent group-hover:text-accent/60" />
                          )}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { courseFor } from "@/lib/courses";
import { useProgress } from "./ProgressContext";
import { CheckIcon, ArrowRight } from "./Icons";

export function CourseDashboard({ courseId }: { courseId: string }) {
  const info = courseFor(courseId);
  const base = info.base;
  const sections = info.course.getNavSections();
  const allSlugs = info.course.allSlugs;
  const total = info.course.totalLessons;
  const { isComplete } = useProgress();

  const done = allSlugs.filter((s) => isComplete(s)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const nextSlug = allSlugs.find((s) => !isComplete(s)) ?? allSlugs[0];
  const allDone = done >= total && total > 0;

  const metaBySlug = Object.fromEntries(
    sections.flatMap((s) => s.lessons.map((l) => [l.slug, l]))
  );
  const nextMeta = metaBySlug[nextSlug];
  const currentSection = sections.find((s) =>
    s.lessons.some((l) => l.slug === nextSlug)
  );

  const subtitle = allDone
    ? "You've finished every lesson. 🎉"
    : done === 0
    ? `Start with ${currentSection?.name ?? "the basics"}.`
    : `You're on ${currentSection?.name ?? "your course"}. Pick up where you left off.`;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10"
      >
        <div className="shrink-0">
          <div className="font-display text-5xl font-bold tabular-nums text-fg">
            {pct}%
          </div>
          <div className="mt-1 font-mono text-sm text-faint">
            {done}/{total}
          </div>
        </div>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            {info.title}
          </h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <Link
            href={`${base}/${nextSlug}`}
            className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-accent to-accent-2 px-5 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
          >
            {allDone ? "Review from the start" : done > 0 ? "Continue" : "Start course"}
            {!allDone && nextMeta && (
              <>
                <ArrowRight className="h-4 w-4 opacity-70" />
                <span className="opacity-90">{nextMeta.title}</span>
              </>
            )}
          </Link>
        </div>
      </motion.div>

      {/* Chapters */}
      <div className="mt-12 space-y-9">
        {sections.map((section, si) => {
          const doneInSection = section.lessons.filter((l) => isComplete(l.slug)).length;
          const total = section.lessons.length;
          const complete = doneInSection === total;
          const started = doneInSection > 0;
          return (
            <section key={section.name}>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="font-display text-xl font-bold tracking-tight text-fg">
                  <span className="text-faint">Chapter {si + 1} · </span>
                  {section.name}
                </h2>
                {complete ? (
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-500">
                    Complete
                  </span>
                ) : started ? (
                  <span className="text-[13px] font-semibold text-accent-text">
                    In progress
                  </span>
                ) : null}
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                {section.lessons.map((lesson, li) => {
                  const isDone = isComplete(lesson.slug);
                  const isCurrent = lesson.slug === nextSlug && !allDone;
                  return (
                    <Link
                      key={lesson.slug}
                      href={`${base}/${lesson.slug}`}
                      className={`group flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-surface-2/60 sm:px-5 ${
                        li > 0 ? "border-t border-border/70" : ""
                      }`}
                    >
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                          isDone
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : isCurrent
                            ? "border-accent"
                            : "border-border"
                        }`}
                      >
                        {isDone ? (
                          <CheckIcon className="h-3 w-3" />
                        ) : isCurrent ? (
                          <span className="h-2 w-2 rounded-full bg-accent" />
                        ) : null}
                      </span>
                      <span
                        className={`min-w-0 flex-1 truncate ${
                          isCurrent ? "font-semibold text-fg" : "text-fg/90"
                        }`}
                      >
                        {lesson.title}
                      </span>
                      {isCurrent ? (
                        <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-accent-text">
                          Resume
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      ) : (
                        <span className="shrink-0 font-mono text-xs text-faint">
                          {lesson.readingTime}
                        </span>
                      )}
                    </Link>
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

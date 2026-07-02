"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { courseFor } from "@/lib/courses";
import { useProgress } from "./ProgressContext";
import { ProgressRing } from "./ProgressRing";
import { Glyph, categoryGlyph, lessonGlyph } from "./glyphs";
import { CheckIcon, ArrowRight, TargetIcon } from "./Icons";

const DIFF_DOT: Record<string, string> = {
  Beginner: "bg-emerald-500",
  Intermediate: "bg-amber-500",
  Advanced: "bg-rose-500",
};

export function CourseDashboard({ courseId }: { courseId: string }) {
  const info = courseFor(courseId);
  const base = info.base;
  const sections = info.course.getNavSections();
  const allSlugs = info.course.allSlugs;
  const total = info.course.totalLessons;
  const { isComplete, ready } = useProgress();

  const done = allSlugs.filter((s) => isComplete(s)).length;
  const pct = total ? done / total : 0;
  const nextSlug = allSlugs.find((s) => !isComplete(s)) ?? allSlugs[0];
  const allDone = ready && done >= total;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/[0.08] via-surface to-accent-2/[0.06] p-6 sm:p-8"
      >
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <ProgressRing value={pct} size={92} stroke={7}>
            <div className="grid place-items-center text-accent">
              <Glyph name={info.glyph} className="h-8 w-8" />
            </div>
          </ProgressRing>
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-wider text-accent">
              {info.title}
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              {allDone ? "Course complete! 🎉" : info.tagline}
            </h1>
            <p className="mt-1.5 max-w-2xl text-muted">{info.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href={`${base}/${nextSlug}`}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-accent to-accent-2 px-5 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
              >
                {done > 0 && !allDone ? "Continue" : "Start course"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-sm text-muted">
                {done} of {total} lessons complete
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-10 space-y-10">
        {sections.map((section, si) => {
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
                  <div className="text-[11px] font-bold uppercase tracking-wider text-faint">
                    Chapter {si + 1}
                  </div>
                  <h2 className="text-lg font-bold text-fg">{section.name}</h2>
                </div>
                <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted">
                  {doneInSection}/{section.lessons.length}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {section.lessons.map((lesson, li) => {
                  const complete = isComplete(lesson.slug);
                  const num = allSlugs.indexOf(lesson.slug) + 1;
                  return (
                    <motion.div
                      key={lesson.slug}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: (li % 2) * 0.04 }}
                    >
                      <Link
                        href={`${base}/${lesson.slug}`}
                        className="group flex h-full items-start gap-3 rounded-2xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-soft"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-accent">
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
                            complete
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-border text-transparent group-hover:border-accent/50"
                          }`}
                        >
                          {complete ? (
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

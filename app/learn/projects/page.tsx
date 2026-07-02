"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CAPSTONES } from "@/lib/capstones";
import { useProgress } from "@/components/ProgressContext";
import { Glyph } from "@/components/glyphs";
import { CheckIcon, ArrowRight } from "@/components/Icons";

const DIFF_DOT: Record<string, string> = {
  Beginner: "bg-emerald-500",
  Intermediate: "bg-amber-500",
  Advanced: "bg-rose-500",
};

export default function ProjectsPage() {
  const { hasEvent } = useProgress();
  const done = CAPSTONES.filter((c) => hasEvent(`capstone:${c.id}`)).length;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent/15 to-accent-2/15 text-accent">
            <Glyph name="puzzle" className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-fg">Projects</h1>
            <p className="text-muted">
              Put it all together — build real programs, live in your browser.
            </p>
          </div>
          <span className="ml-auto rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-sm text-muted">
            {done}/{CAPSTONES.length}
          </span>
        </div>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {CAPSTONES.map((c, i) => {
          const complete = hasEvent(`capstone:${c.id}`);
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (i % 2) * 0.05 }}
            >
              <Link
                href={`/learn/projects/${c.id}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Glyph name={c.icon} className="h-5 w-5" />
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT[c.difficulty]}`}
                    />
                    <span className="text-[11px] uppercase tracking-wider text-faint">
                      {c.difficulty}
                    </span>
                  </div>
                  <span className="ml-auto">
                    {complete ? (
                      <span className="grid h-6 w-6 place-items-center rounded-full border border-emerald-500 bg-emerald-500 text-white">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-bold text-accent">
                        +{c.xp} XP
                      </span>
                    )}
                  </span>
                </div>
                <h3 className="mt-3 font-bold text-fg group-hover:text-accent">
                  {c.title}
                </h3>
                <p className="mt-1 flex-1 text-sm text-muted">{c.blurb}</p>
                <span className="mt-3 flex items-center gap-1 text-sm font-semibold text-accent">
                  {complete ? "Revisit" : "Start building"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

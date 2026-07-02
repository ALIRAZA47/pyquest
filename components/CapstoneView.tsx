"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Capstone } from "@/lib/capstones";
import { PyRunner } from "./PyRunner";
import { CodeBlock } from "./CodeBlock";
import { Markdown } from "./Markdown";
import { useProgress } from "./ProgressContext";
import { fireConfetti } from "./confetti";
import { Glyph } from "./glyphs";
import { CheckIcon, ArrowLeft, ChevronDown } from "./Icons";

const DIFFICULTY_STYLE: Record<string, string> = {
  Beginner: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
  Intermediate: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  Advanced: "border-rose-500/30 bg-rose-500/10 text-rose-500",
};

export function CapstoneView({ capstone }: { capstone: Capstone }) {
  const { awardXp, hasEvent, celebrate } = useProgress();
  const [showSolution, setShowSolution] = useState(false);
  const done = hasEvent(`capstone:${capstone.id}`);

  const markDone = () => {
    if (!done) {
      awardXp(`capstone:${capstone.id}`, capstone.xp);
      celebrate();
      fireConfetti();
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <Link
        href="/learn/projects"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent/15 to-accent-2/15 text-accent">
          <Glyph name={capstone.icon} className="h-7 w-7" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                DIFFICULTY_STYLE[capstone.difficulty]
              }`}
            >
              {capstone.difficulty}
            </span>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
              +{capstone.xp} XP
            </span>
            {done && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-500">
                <CheckIcon className="h-3 w-3" /> Completed
              </span>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-fg">
            {capstone.title}
          </h1>
        </div>
      </div>

      <div className="mt-5 text-fg/90">
        <Markdown text={capstone.description} />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface-2/40 p-5">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-accent">
          Requirements
        </h2>
        <ul className="mt-3 space-y-2">
          {capstone.requirements.map((r, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-fg/90">
              <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-accent/50 text-[9px] font-bold text-accent">
                {i + 1}
              </span>
              <span>
                <Markdown text={r} className="[&_p]:my-0" />
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <p className="mb-1 text-sm font-semibold text-fg">
          Build it here — edit the starter code and hit Run:
        </p>
        <PyRunner initialCode={capstone.starterCode} caption={`${capstone.id}.py`} minRows={8} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setShowSolution((s) => !s)}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${showSolution ? "rotate-180" : ""}`}
          />
          {showSolution ? "Hide solution" : "Peek at a solution"}
        </button>
        <button
          type="button"
          onClick={markDone}
          disabled={done}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
            done
              ? "cursor-default border border-emerald-500/50 bg-emerald-500/10 text-emerald-500"
              : "bg-gradient-to-br from-accent to-accent-2 text-white shadow-glow hover:scale-[1.03]"
          }`}
        >
          <CheckIcon className="h-4 w-4" />
          {done ? "Completed" : `Mark complete · +${capstone.xp} XP`}
        </button>
      </div>

      <AnimatePresence>
        {showSolution && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <CodeBlock code={capstone.solution} caption="one solution" runnable />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

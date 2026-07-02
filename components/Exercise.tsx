"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Exercise as ExerciseType } from "@/lib/types";
import { CodeBlock } from "./CodeBlock";
import { PyRunner } from "./PyRunner";
import { Markdown } from "./Markdown";
import { useProgress } from "./ProgressContext";
import { XP } from "@/lib/gamification";
import { Glyph } from "./glyphs";
import { FlameIcon, ChevronDown, LightbulbIcon } from "./Icons";

export function Exercise({
  exercise,
  slug,
}: {
  exercise: ExerciseType;
  slug: string;
}) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const { awardXp, hasEvent } = useProgress();

  const starter =
    exercise.starterCode && exercise.starterCode.trim()
      ? exercise.starterCode
      : "# Write your solution here, then press Run ▶\n";

  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-python/30 bg-gradient-to-br from-python/[0.06] to-transparent">
      <div className="flex items-center gap-2.5 border-b border-python/20 px-5 py-4">
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-python/30 bg-surface text-python">
          <FlameIcon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-python">
            Your turn
          </div>
          <div className="font-semibold text-fg">Practice exercise</div>
        </div>
        {hasEvent(`exrun:${slug}`) && (
          <span className="ml-auto rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-500">
            +{XP.EXERCISE_RUN} XP earned
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="text-fg/90">
          <Markdown text={exercise.prompt} />
        </div>

        <div className="mt-2">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-faint">
            <Glyph name="pencil" className="h-3.5 w-3.5" />
            Try it live — edit the code and hit Run to execute real Python:
          </p>
          <PyRunner
            initialCode={starter}
            caption="solution.py"
            minRows={5}
            onFirstRun={() => awardXp(`exrun:${slug}`, XP.EXERCISE_RUN)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          {exercise.hint && (
            <button
              type="button"
              onClick={() => setShowHint((s) => !s)}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showHint ? "rotate-180" : ""}`}
              />
              {showHint ? "Hide hint" : "Show hint"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowSolution((s) => !s)}
            className="flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-3.5 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/15"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showSolution ? "rotate-180" : ""}`}
            />
            {showSolution ? "Hide solution" : "Reveal solution"}
          </button>
        </div>

        <AnimatePresence>
          {showHint && exercise.hint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-border bg-surface-2/60 p-4 text-sm text-muted">
                <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{exercise.hint}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSolution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <CodeBlock code={exercise.solution} caption="one solution" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

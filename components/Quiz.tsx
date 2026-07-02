"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, CloseIcon, TargetIcon } from "./Icons";
import { Markdown } from "./Markdown";

interface QuizProps {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export function Quiz({ question, options, answerIndex, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === answerIndex;

  return (
    <div className="my-7 overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/[0.06] to-accent-2/[0.05]">
      <div className="flex items-center gap-2 border-b border-accent/15 px-5 py-3">
        <TargetIcon className="h-4 w-4 text-accent" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
          Quick check
        </span>
      </div>
      <div className="p-5">
        <p className="font-semibold text-fg">{question}</p>
        <div className="mt-4 grid gap-2.5">
          {options.map((opt, i) => {
            const isChosen = selected === i;
            const isCorrectOption = i === answerIndex;
            let state = "idle";
            if (answered) {
              if (isCorrectOption) state = "correct";
              else if (isChosen) state = "wrong";
              else state = "dim";
            }
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => setSelected(i)}
                className={[
                  "group flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                  state === "idle" &&
                    "border-border bg-surface hover:border-accent/50 hover:bg-accent/[0.04]",
                  state === "correct" &&
                    "border-emerald-500/50 bg-emerald-500/10 text-fg",
                  state === "wrong" &&
                    "border-rose-500/50 bg-rose-500/10 text-fg",
                  state === "dim" && "border-border bg-surface opacity-55",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span
                  className={[
                    "grid h-6 w-6 shrink-0 place-items-center rounded-lg border font-mono text-xs",
                    state === "correct" && "border-emerald-500 bg-emerald-500 text-white",
                    state === "wrong" && "border-rose-500 bg-rose-500 text-white",
                    (state === "idle" || state === "dim") &&
                      "border-border bg-surface-2 text-muted group-hover:border-accent/50 group-hover:text-accent",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {state === "correct" ? (
                    <CheckIcon className="h-3.5 w-3.5" />
                  ) : state === "wrong" ? (
                    <CloseIcon className="h-3.5 w-3.5" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className="flex-1 font-mono">{opt}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              className="mt-4 overflow-hidden"
            >
              <div
                className={`rounded-xl border p-4 text-sm ${
                  correct
                    ? "border-emerald-500/30 bg-emerald-500/[0.07]"
                    : "border-amber-500/30 bg-amber-500/[0.07]"
                }`}
              >
                <p
                  className={`mb-1 font-semibold ${
                    correct ? "text-emerald-500" : "text-amber-500"
                  }`}
                >
                  {correct ? "Correct! 🎉" : "Not quite — here's why:"}
                </p>
                <div className="text-muted [&_p]:my-1">
                  <Markdown text={explanation} />
                </div>
                {!correct && (
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="mt-2 text-xs font-semibold text-accent hover:underline"
                  >
                    Try again ↺
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

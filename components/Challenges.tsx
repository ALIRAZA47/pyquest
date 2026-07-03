"use client";

import { Fragment, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Challenge } from "@/lib/types";
import { CodeBlock } from "./CodeBlock";
import { Markdown } from "./Markdown";
import { useProgress } from "./ProgressContext";
import { XP } from "@/lib/gamification";
import { fireConfetti } from "./confetti";
import { CheckIcon, CloseIcon, ArrowRight, TargetIcon } from "./Icons";

const TYPE_LABEL: Record<Challenge["type"], string> = {
  "predict-output": "Predict the output",
  "fix-bug": "Fix the bug",
  "fill-blank": "Fill in the blank",
  reorder: "Reorder the lines",
};

// ---- deterministic shuffle (stable across SSR/CSR) ---------------------
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededScramble<T>(arr: T[], seed: number): number[] {
  const idx = arr.map((_, i) => i);
  const rand = mulberry32(seed);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  // Ensure it isn't accidentally already in order.
  if (idx.every((v, i) => v === i) && idx.length > 1) {
    return idx.slice(1).concat(idx[0]);
  }
  return idx;
}

function SolvedBadge() {
  return (
    <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-500">
      <CheckIcon className="h-3 w-3" /> Solved · +{XP.CHALLENGE_SOLVED} XP
    </span>
  );
}

function Explanation({ text, correct }: { text: string; correct: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="overflow-hidden"
    >
      <div
        className={`mt-3 rounded-xl border p-3.5 text-sm ${
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
          {correct ? "Nailed it! 🎉" : "Not quite — here's the idea:"}
        </p>
        <div className="text-muted [&_p]:my-1">
          <Markdown text={text} />
        </div>
      </div>
    </motion.div>
  );
}

// ---- Multiple-choice (predict-output / fix-bug) ------------------------
function ChoiceChallenge({
  challenge,
  solved,
  onSolve,
  lang,
}: {
  challenge: Extract<Challenge, { type: "predict-output" | "fix-bug" }>;
  solved: boolean;
  onSolve: () => void;
  lang?: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === challenge.answerIndex;

  const choose = (i: number) => {
    if (answered && correct) return;
    setSelected(i);
    if (i === challenge.answerIndex) onSolve();
  };

  return (
    <>
      <CodeBlock code={challenge.code} caption={challenge.type} lang={lang} />
      <div className="mt-3 grid gap-2">
        {challenge.options.map((opt, i) => {
          const isChosen = selected === i;
          const isCorrectOpt = i === challenge.answerIndex;
          let state = "idle";
          if (answered) {
            if (isCorrectOpt && (isChosen || correct)) state = "correct";
            else if (isCorrectOpt) state = "correct";
            else if (isChosen) state = "wrong";
            else state = "dim";
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={correct}
              className={[
                "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-all",
                state === "idle" &&
                  "border-border bg-surface hover:border-accent/50 hover:bg-accent/[0.04]",
                state === "correct" && "border-emerald-500/50 bg-emerald-500/10",
                state === "wrong" && "border-rose-500/50 bg-rose-500/10",
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
                  (state === "idle" || state === "dim") && "border-border text-muted",
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
              <span className="flex-1 whitespace-pre-wrap font-mono text-[13px]">
                {opt}
              </span>
            </button>
          );
        })}
      </div>
      {answered && <Explanation text={challenge.explanation} correct={correct} />}
    </>
  );
}

// ---- Fill in the blank -------------------------------------------------
function FillBlankChallenge({
  challenge,
  onSolve,
}: {
  challenge: Extract<Challenge, { type: "fill-blank" }>;
  onSolve: () => void;
}) {
  const parts = useMemo(
    () => challenge.codeTemplate.split("{{blank}}"),
    [challenge.codeTemplate]
  );
  const [vals, setVals] = useState<string[]>(challenge.blanks.map(() => ""));
  const [checked, setChecked] = useState(false);

  const matches = (val: string, i: number) => {
    const norm = val.trim();
    const b = challenge.blanks[i];
    const accepted = [b.answer, ...(b.accept ?? [])].map((a) => a.trim());
    return accepted.includes(norm);
  };
  const allCorrect = challenge.blanks.every((_, i) => matches(vals[i], i));

  const check = () => {
    setChecked(true);
    if (allCorrect) onSolve();
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-border bg-[rgb(var(--code-bg))] p-4">
        <pre className="whitespace-pre-wrap font-mono text-[13.5px] leading-[1.9] text-fg">
          {parts.map((part, i) => (
            <Fragment key={i}>
              <span>{part}</span>
              {i < challenge.blanks.length && (
                <input
                  value={vals[i]}
                  onChange={(e) => {
                    const next = [...vals];
                    next[i] = e.target.value;
                    setVals(next);
                    setChecked(false);
                  }}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  size={Math.max(3, vals[i].length + 1)}
                  className={`mx-0.5 inline-block rounded-md border-b-2 bg-accent/5 px-1.5 py-0.5 text-center font-mono text-accent outline-none transition-colors ${
                    checked
                      ? matches(vals[i], i)
                        ? "border-emerald-500"
                        : "border-rose-500"
                      : "border-accent/50 focus:border-accent"
                  }`}
                  placeholder="?"
                />
              )}
            </Fragment>
          ))}
        </pre>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={check}
          disabled={allCorrect && checked}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform enabled:hover:scale-[1.03] disabled:opacity-60"
        >
          <CheckIcon className="h-4 w-4" />
          Check
        </button>
        {checked && !allCorrect && (
          <span className="text-sm font-medium text-amber-500">
            Almost — check the highlighted blanks.
          </span>
        )}
      </div>
      {checked && (
        <Explanation text={challenge.explanation} correct={allCorrect} />
      )}
    </>
  );
}

// ---- Reorder the lines -------------------------------------------------
function ReorderChallenge({
  challenge,
  onSolve,
}: {
  challenge: Extract<Challenge, { type: "reorder" }>;
  onSolve: () => void;
}) {
  const seed = useMemo(
    () => hashString(challenge.lines.join("\n")),
    [challenge.lines]
  );
  const [order, setOrder] = useState<number[]>(() =>
    seededScramble(challenge.lines, seed)
  );
  const [checked, setChecked] = useState(false);

  const currentText = order.map((i) => challenge.lines[i]).join("\n");
  const isCorrect = currentText === challenge.lines.join("\n");

  const move = (pos: number, dir: -1 | 1) => {
    const next = [...order];
    const swap = pos + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[pos], next[swap]] = [next[swap], next[pos]];
    setOrder(next);
    setChecked(false);
  };

  const check = () => {
    setChecked(true);
    if (isCorrect) onSolve();
  };

  return (
    <>
      <div className="space-y-1.5">
        {order.map((lineIdx, pos) => (
          <div
            key={pos}
            className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 transition-colors ${
              checked
                ? isCorrect
                  ? "border-emerald-500/40 bg-emerald-500/[0.06]"
                  : "border-border bg-surface"
                : "border-border bg-surface"
            }`}
          >
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => move(pos, -1)}
                disabled={pos === 0}
                aria-label="Move line up"
                className="grid h-4 w-6 place-items-center rounded text-faint transition-colors enabled:hover:text-accent disabled:opacity-30"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => move(pos, 1)}
                disabled={pos === order.length - 1}
                aria-label="Move line down"
                className="grid h-4 w-6 place-items-center rounded text-faint transition-colors enabled:hover:text-accent disabled:opacity-30"
              >
                ▼
              </button>
            </div>
            <span className="font-mono text-faint">{pos + 1}</span>
            <pre className="flex-1 overflow-x-auto font-mono text-[13.5px] text-fg">
              {challenge.lines[lineIdx] || " "}
            </pre>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={check}
          disabled={isCorrect && checked}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform enabled:hover:scale-[1.03] disabled:opacity-60"
        >
          <CheckIcon className="h-4 w-4" />
          Check order
        </button>
        {checked && !isCorrect && (
          <span className="text-sm font-medium text-amber-500">
            Not yet — try rearranging with the arrows.
          </span>
        )}
      </div>
      {checked && <Explanation text={challenge.explanation} correct={isCorrect} />}
    </>
  );
}

function ChallengeCard({
  challenge,
  index,
  solved,
  onSolve,
  lang,
}: {
  challenge: Challenge;
  index: number;
  solved: boolean;
  onSolve: () => void;
  lang?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent">
          {TYPE_LABEL[challenge.type]}
        </span>
        {solved && <SolvedBadge />}
        <span className="ml-auto font-mono text-xs text-faint">
          #{index + 1}
        </span>
      </div>
      <p className="mb-3 font-semibold text-fg">{challenge.prompt}</p>
      {challenge.type === "predict-output" || challenge.type === "fix-bug" ? (
        <ChoiceChallenge challenge={challenge} solved={solved} onSolve={onSolve} lang={lang} />
      ) : challenge.type === "fill-blank" ? (
        <FillBlankChallenge challenge={challenge} onSolve={onSolve} />
      ) : (
        <ReorderChallenge challenge={challenge} onSolve={onSolve} />
      )}
    </div>
  );
}

export function Challenges({
  challenges,
  slug,
  lang,
}: {
  challenges: Challenge[];
  slug: string;
  lang?: string;
}) {
  const { awardXp, hasEvent } = useProgress();
  const solvedCount = challenges.filter((_, i) =>
    hasEvent(`chal:${slug}:${i}`)
  ).length;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent">
          <TargetIcon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-accent">
            Practice challenges
          </div>
          <div className="font-semibold text-fg">
            Test yourself · earn XP
          </div>
        </div>
        <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted">
          {solvedCount}/{challenges.length}
        </span>
      </div>
      <div className="space-y-4">
        {challenges.map((c, i) => (
          <ChallengeCard
            key={i}
            challenge={c}
            index={i}
            lang={lang}
            solved={hasEvent(`chal:${slug}:${i}`)}
            onSolve={() => {
              if (!hasEvent(`chal:${slug}:${i}`)) {
                awardXp(`chal:${slug}:${i}`, XP.CHALLENGE_SOLVED);
                fireConfetti({ count: 60 });
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}

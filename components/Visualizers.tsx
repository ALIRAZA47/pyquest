"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, PlayIcon, CloseIcon } from "./Icons";
import {
  GradientDescentViz,
  LinearRegressionViz,
  SigmoidViz,
  KNNViz,
  KMeansViz,
  OverfittingViz,
  DecisionTreeViz,
  NeuralNetViz,
} from "./viz-ml";
import {
  PathfindingViz,
  MinimaxViz,
  PerceptronViz,
  NextTokenViz,
} from "./viz-ai";

// ============================================================
// String slicing — s[start:stop:step] with live index labels
// ============================================================

function sliceIndices(
  n: number,
  start: number | null,
  stop: number | null,
  step: number | null
): number[] {
  const st = step ?? 1;
  if (st === 0) return [];
  let lower: number, upper: number;
  if (st < 0) {
    lower = -1;
    upper = n - 1;
  } else {
    lower = 0;
    upper = n;
  }
  const clamp = (v: number | null, isStart: boolean): number => {
    if (v === null) {
      if (isStart) return st < 0 ? upper : lower;
      return st < 0 ? lower : upper;
    }
    let x = v;
    if (x < 0) {
      x += n;
      if (x < lower) x = lower;
    } else if (x > upper) {
      x = upper;
    }
    return x;
  };
  const s = clamp(start, true);
  const e = clamp(stop, false);
  const out: number[] = [];
  if (st > 0) for (let i = s; i < e; i += st) out.push(i);
  else for (let i = s; i > e; i += st) out.push(i);
  return out;
}

function parseVal(v: string): number | null {
  const t = v.trim();
  if (t === "" || t === "-") return null;
  const n = Number(t);
  return Number.isInteger(n) ? n : null;
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col items-center gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        inputMode="numeric"
        className="w-16 rounded-lg border border-border bg-surface px-2 py-1.5 text-center font-mono text-fg placeholder:text-faint/50 focus:border-accent/60 focus:outline-none"
      />
    </label>
  );
}

export function StringSlicingVisualizer() {
  const [text, setText] = useState("PYTHON!");
  const [start, setStart] = useState("1");
  const [stop, setStop] = useState("6");
  const [step, setStep] = useState("2");

  const chars = [...text];
  const n = chars.length;
  const s = parseVal(start);
  const st = parseVal(stop);
  const sp = parseVal(step);
  const selected = useMemo(
    () => new Set(sliceIndices(n, s, st, sp === null ? 1 : sp)),
    [n, s, st, sp]
  );
  const order = sliceIndices(n, s, st, sp === null ? 1 : sp);
  const result = order.map((i) => chars[i]).join("");
  const expr = `s[${s ?? ""}:${st ?? ""}${sp !== null ? ":" + sp : ""}]`;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">
            string
          </span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 12))}
            className="w-40 rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-fg focus:border-accent/60 focus:outline-none"
          />
        </label>
        <NumField label="start" value={start} onChange={setStart} />
        <NumField label="stop" value={stop} onChange={setStop} />
        <NumField label="step" value={step} onChange={setStep} />
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1.5">
          {chars.map((c, i) => {
            const on = selected.has(i);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="font-mono text-[11px] text-faint">{i}</span>
                <div
                  className={`grid h-11 w-11 place-items-center rounded-lg border font-mono text-lg font-bold transition-all ${
                    on
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border bg-surface text-muted"
                  }`}
                >
                  {c === " " ? "␣" : c}
                </div>
                <span className="font-mono text-[11px] text-faint">{i - n}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-2/50 p-3 font-mono text-sm">
        <span className="text-muted">{expr}</span>
        <span className="text-faint">→</span>
        <span className="rounded-lg bg-accent/10 px-2.5 py-1 font-bold text-accent">
          {result === "" ? "'' (empty)" : `'${result}'`}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// List index explorer — positive & negative indexing + IndexError
// ============================================================

export function ListIndexExplorer() {
  const [raw, setRaw] = useState("10, 20, 30, 40, 50");
  const items = raw
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
  const n = items.length;
  const [idx, setIdx] = useState("2");

  const parsed = parseVal(idx);
  let resolved: number | null = null;
  let outOfRange = false;
  if (parsed !== null && n > 0) {
    resolved = parsed < 0 ? parsed + n : parsed;
    outOfRange = resolved < 0 || resolved >= n;
  }

  return (
    <div>
      <label className="mb-4 flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">
          list (comma-separated)
        </span>
        <input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-fg focus:border-accent/60 focus:outline-none"
        />
      </label>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1.5">
          {items.map((item, i) => {
            const on = !outOfRange && resolved === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(String(i))}
                className="flex flex-col items-center gap-1"
              >
                <span className="font-mono text-[11px] text-faint">{i}</span>
                <div
                  className={`grid h-12 min-w-[3rem] place-items-center rounded-lg border px-2 font-mono font-bold transition-all ${
                    on
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border bg-surface text-muted hover:border-accent/40"
                  }`}
                >
                  {item}
                </div>
                <span className="font-mono text-[11px] text-faint">{i - n}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 font-mono text-sm">
          <span className="text-muted">lst[</span>
          <input
            value={idx}
            onChange={(e) => setIdx(e.target.value)}
            inputMode="numeric"
            className="w-14 rounded-lg border border-border bg-surface px-2 py-1 text-center font-mono text-fg focus:border-accent/60 focus:outline-none"
          />
          <span className="text-muted">]</span>
        </label>
        <span className="text-faint">→</span>
        {parsed === null ? (
          <span className="font-mono text-sm text-faint">enter an index</span>
        ) : outOfRange ? (
          <span className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1 font-mono text-sm text-rose-400">
            IndexError: list index out of range
          </span>
        ) : (
          <span className="rounded-lg bg-accent/10 px-2.5 py-1 font-mono text-sm font-bold text-accent">
            {items[resolved!]}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-faint">
        Click a box or type an index — try a negative one like{" "}
        <code className="text-accent">-1</code>, or go out of range to see an
        error.
      </p>
    </div>
  );
}

// ============================================================
// Recursion call-stack stepper — factorial(n)
// ============================================================

interface Frame {
  n: number;
  val?: number;
}
interface Snap {
  frames: Frame[];
  caption: string;
  mode: "call" | "base" | "return" | "done";
}

function buildFactorialSteps(n: number): Snap[] {
  const snaps: Snap[] = [];
  const frames: Frame[] = [];
  for (let k = n; k >= 1; k--) {
    frames.push({ n: k });
    snaps.push({
      frames: frames.map((f) => ({ ...f })),
      caption:
        k === 1
          ? "factorial(1) hits the base case → returns 1"
          : `factorial(${k}) is called — it must wait for factorial(${k - 1})`,
      mode: k === 1 ? "base" : "call",
    });
  }
  let ret = 1;
  for (let k = 1; k <= n; k++) {
    ret = k <= 1 ? 1 : k * ret;
    frames[frames.length - 1].val = ret;
    snaps.push({
      frames: frames.map((f) => ({ ...f })),
      caption:
        k === 1
          ? "factorial(1) returns 1"
          : `factorial(${k}) returns ${k} × ${ret / k} = ${ret}`,
      mode: "return",
    });
    frames.pop();
  }
  snaps.push({
    frames: [],
    caption: `Done! factorial(${n}) = ${ret}`,
    mode: "done",
  });
  return snaps;
}

export function RecursionStepper() {
  const [n, setN] = useState(4);
  const steps = useMemo(() => buildFactorialSteps(n), [n]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setI(0);
    setPlaying(false);
  }, [n]);

  useEffect(() => {
    if (!playing) return;
    if (i >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setI((x) => Math.min(steps.length - 1, x + 1)), 900);
    return () => clearTimeout(t);
  }, [playing, i, steps.length]);

  const snap = steps[i];
  const modeColor: Record<Snap["mode"], string> = {
    call: "border-accent/50 bg-accent/10 text-accent",
    base: "border-emerald-500/50 bg-emerald-500/10 text-emerald-500",
    return: "border-violet-500/50 bg-violet-500/10 text-violet-500",
    done: "border-emerald-500/50 bg-emerald-500/10 text-emerald-500",
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-muted">factorial(</span>
          <select
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="rounded-lg border border-border bg-surface px-2 py-1 font-mono text-fg focus:border-accent/60 focus:outline-none"
          >
            {[2, 3, 4, 5, 6].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <span className="text-muted">)</span>
        </div>
        <span className="font-mono text-xs text-faint">
          step {i + 1} / {steps.length}
        </span>
      </div>

      <div className="flex min-h-[210px] flex-col-reverse items-center justify-start gap-1.5 rounded-2xl border border-border bg-surface-2/40 p-4">
        <AnimatePresence initial={false} mode="popLayout">
          {snap.frames.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-semibold text-emerald-500"
            >
              🎉 stack empty — recursion complete
            </motion.div>
          ) : (
            snap.frames.map((f, fi) => {
              const isTop = fi === snap.frames.length - 1;
              return (
                <motion.div
                  key={`${f.n}-${fi}`}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className={`flex w-full max-w-xs items-center justify-between rounded-xl border px-4 py-2.5 font-mono text-sm ${
                    isTop ? modeColor[snap.mode] : "border-border bg-surface text-muted"
                  }`}
                >
                  <span>factorial({f.n})</span>
                  {f.val !== undefined && <span className="font-bold">→ {f.val}</span>}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <p className="mt-3 min-h-[2.5rem] text-sm text-fg/90">{snap.caption}</p>

      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setI((x) => Math.max(0, x - 1));
          }}
          disabled={i === 0}
          className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted transition-colors enabled:hover:text-accent disabled:opacity-40"
          aria-label="Previous step"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (i >= steps.length - 1) {
              setI(0);
              setPlaying(true);
            } else setPlaying((p) => !p);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
        >
          {playing ? <CloseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
          {playing ? "Pause" : i >= steps.length - 1 ? "Replay" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setI((x) => Math.min(steps.length - 1, x + 1));
          }}
          disabled={i >= steps.length - 1}
          className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted transition-colors enabled:hover:text-accent disabled:opacity-40"
          aria-label="Next step"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Registry + lesson wrapper
// ============================================================

const VISUALIZERS: Record<
  string,
  { title: string; subtitle: string; node: () => JSX.Element }
> = {
  "string-slicing": {
    title: "Slicing playground",
    subtitle: "Change start / stop / step and watch which characters get picked.",
    node: StringSlicingVisualizer,
  },
  lists: {
    title: "Index explorer",
    subtitle: "See positive & negative indexing — and what causes an IndexError.",
    node: ListIndexExplorer,
  },
  recursion: {
    title: "Call-stack stepper",
    subtitle: "Watch the calls stack up, then unwind as each one returns.",
    node: RecursionStepper,
  },

  // ---- Machine Learning ----
  "linear-regression": {
    title: "Fit the line",
    subtitle: "Gradient descent rotates the line to the best fit — watch the error shrink.",
    node: LinearRegressionViz,
  },
  "gradient-descent": {
    title: "Roll downhill",
    subtitle: "Step down the loss curve to the minimum — try different learning rates.",
    node: GradientDescentViz,
  },
  "logistic-regression": {
    title: "The sigmoid",
    subtitle: "Turn any number into a probability and classify at the 0.5 threshold.",
    node: SigmoidViz,
  },
  "k-nearest-neighbors": {
    title: "Nearest neighbors",
    subtitle: "Move the new point and see how its k neighbors vote on its class.",
    node: KNNViz,
  },
  "k-means-clustering": {
    title: "Clustering in motion",
    subtitle: "Assign, move, repeat — watch centroids settle into clusters.",
    node: KMeansViz,
  },
  "overfitting-underfitting": {
    title: "Complexity dial",
    subtitle: "Slide from too-simple to too-complex and find the sweet spot.",
    node: OverfittingViz,
  },
  "decision-trees": {
    title: "Splitting the space",
    subtitle: "Watch yes/no questions carve the data into pure regions.",
    node: DecisionTreeViz,
  },
  "neural-networks-basics": {
    title: "Forward pass",
    subtitle: "Watch activations flow layer by layer to a prediction.",
    node: NeuralNetViz,
  },

  // ---- Artificial Intelligence ----
  "bfs-and-dfs": {
    title: "Search the maze",
    subtitle: "Watch BFS and DFS explore the grid to reach the goal.",
    node: PathfindingViz,
  },
  "a-star-search": {
    title: "A* pathfinding",
    subtitle: "See how a heuristic makes A* beeline for the goal vs. blind search.",
    node: PathfindingViz,
  },
  minimax: {
    title: "Game tree",
    subtitle: "Watch scores propagate up as MAX and MIN take turns choosing.",
    node: MinimaxViz,
  },
  "alpha-beta-pruning": {
    title: "Game tree",
    subtitle: "The same minimax tree — the values MAX and MIN reason about.",
    node: MinimaxViz,
  },
  "the-perceptron": {
    title: "Learning a boundary",
    subtitle: "The line rotates each pass until it separates the two classes.",
    node: PerceptronViz,
  },
  "neural-networks-and-deep-learning": {
    title: "Forward pass",
    subtitle: "Watch activations flow layer by layer to a prediction.",
    node: NeuralNetViz,
  },
  "how-networks-learn": {
    title: "Roll downhill",
    subtitle: "Training is gradient descent — step down the loss to reduce error.",
    node: GradientDescentViz,
  },
  "nlp-and-llms": {
    title: "Predict the next token",
    subtitle: "Pick tokens from the probabilities and watch a sentence form.",
    node: NextTokenViz,
  },
};

export function hasVisualizer(slug: string): boolean {
  return slug in VISUALIZERS;
}

export function LessonVisualizer({ slug }: { slug: string }) {
  const v = VISUALIZERS[slug];
  if (!v) return null;
  const Node = v.node;
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mt-10 overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/[0.06] to-accent-2/[0.04] p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <PlayIcon className="h-4 w-4 text-accent" />
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-accent">
            Try it yourself · {v.title}
          </div>
          <div className="text-sm text-muted">{v.subtitle}</div>
        </div>
      </div>
      <Node />
    </motion.section>
  );
}

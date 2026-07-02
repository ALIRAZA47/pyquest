"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  useStepper,
  VizControls,
  Chip,
  mulberry32,
  CLASS_A,
  CLASS_B,
} from "./viz-shared";

// ============================================================
// Pathfinding — BFS / DFS / A* exploring a grid
// ============================================================
const ROWS = 11;
const COLS = 15;
const START = { r: 5, c: 1 };
const GOAL = { r: 5, c: 13 };

const WALLS = (() => {
  const w = new Set<number>();
  const add = (r: number, c: number) => w.add(r * COLS + c);
  for (let r = 0; r <= 7; r++) add(r, 5);
  for (let r = 3; r <= 10; r++) add(r, 9);
  return w;
})();

const key = (r: number, c: number) => r * COLS + c;

function neighbors(r: number, c: number) {
  const out: { r: number; c: number }[] = [];
  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  for (const [dr, dc] of dirs) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
    if (WALLS.has(key(nr, nc))) continue;
    out.push({ r: nr, c: nc });
  }
  return out;
}

function runSearch(algo: "bfs" | "dfs" | "astar") {
  const order: number[] = [];
  const parent = new Map<number, number>();
  const visited = new Set<number>();
  const startK = key(START.r, START.c);
  const goalK = key(GOAL.r, GOAL.c);
  const h = (k: number) => {
    const r = Math.floor(k / COLS);
    const c = k % COLS;
    return Math.abs(r - GOAL.r) + Math.abs(c - GOAL.c);
  };

  if (algo === "astar") {
    const g = new Map<number, number>([[startK, 0]]);
    const open: number[] = [startK];
    while (open.length) {
      let bi = 0;
      for (let i = 1; i < open.length; i++)
        if ((g.get(open[i]) ?? 0) + h(open[i]) < (g.get(open[bi]) ?? 0) + h(open[bi])) bi = i;
      const cur = open.splice(bi, 1)[0];
      if (visited.has(cur)) continue;
      visited.add(cur);
      order.push(cur);
      if (cur === goalK) break;
      const r = Math.floor(cur / COLS);
      const c = cur % COLS;
      for (const n of neighbors(r, c)) {
        const nk = key(n.r, n.c);
        const ng = (g.get(cur) ?? 0) + 1;
        if (ng < (g.get(nk) ?? Infinity)) {
          g.set(nk, ng);
          parent.set(nk, cur);
          open.push(nk);
        }
      }
    }
  } else {
    const frontier: number[] = [startK];
    visited.add(startK);
    while (frontier.length) {
      const cur = algo === "bfs" ? frontier.shift()! : frontier.pop()!;
      order.push(cur);
      if (cur === goalK) break;
      const r = Math.floor(cur / COLS);
      const c = cur % COLS;
      for (const n of neighbors(r, c)) {
        const nk = key(n.r, n.c);
        if (!visited.has(nk)) {
          visited.add(nk);
          parent.set(nk, cur);
          frontier.push(nk);
        }
      }
    }
  }

  const path: number[] = [];
  let cur: number | undefined = goalK;
  if (order[order.length - 1] === goalK) {
    while (cur !== undefined) {
      path.push(cur);
      cur = parent.get(cur);
    }
    path.reverse();
  }
  return { order, path };
}

export function PathfindingViz() {
  const [algo, setAlgo] = useState<"bfs" | "dfs" | "astar">("bfs");
  const { order, path } = useMemo(() => runSearch(algo), [algo]);
  const { step, playing, next, prev, reset, toggle, setStep } = useStepper(
    order.length,
    45
  );
  const visitedUpTo = new Set(order.slice(0, step + 1));
  const current = order[Math.min(step, order.length - 1)];
  const done = step >= order.length - 1;
  const pathSet = new Set(done ? path : []);
  const CS = 10;

  const cellColor = (k: number) => {
    if (k === key(START.r, START.c)) return "#22c55e";
    if (k === key(GOAL.r, GOAL.c)) return "#ef4444";
    if (WALLS.has(k)) return "rgb(var(--fg))";
    if (pathSet.has(k)) return "rgb(var(--accent))";
    if (k === current) return "rgb(var(--accent-2))";
    if (visitedUpTo.has(k)) return "rgb(var(--accent) / 0.28)";
    return "rgb(var(--surface-2))";
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">algorithm:</span>
        <Chip active={algo === "bfs"} onClick={() => { setAlgo("bfs"); setStep(0); }}>BFS</Chip>
        <Chip active={algo === "dfs"} onClick={() => { setAlgo("dfs"); setStep(0); }}>DFS</Chip>
        <Chip active={algo === "astar"} onClick={() => { setAlgo("astar"); setStep(0); }}>A*</Chip>
        <span className="ml-auto rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-muted">
          explored <span className="font-mono font-bold text-fg">{step + 1}</span>
          {done && path.length ? ` · path ${path.length - 1} steps` : ""}
        </span>
      </div>
      <svg viewBox={`0 0 ${COLS * CS} ${ROWS * CS}`} className="w-full rounded-xl border border-border bg-[rgb(var(--code-bg))]">
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((_, c) => (
            <rect
              key={key(r, c)}
              x={c * CS + 0.6}
              y={r * CS + 0.6}
              width={CS - 1.2}
              height={CS - 1.2}
              rx={1.4}
              fill={cellColor(key(r, c))}
              style={{ transition: "fill 0.12s" }}
            />
          ))
        )}
      </svg>
      <p className="mt-2 text-sm text-muted">
        {algo === "bfs" && "BFS explores evenly in all directions (a queue) — it always finds the shortest path."}
        {algo === "dfs" && "DFS charges deep down one path (a stack) before backtracking — fast, but not always the shortest route."}
        {algo === "astar" && "A* uses a heuristic (distance to the goal) to head straight for the target — exploring far fewer cells."}
      </p>
      <VizControls
        step={step}
        total={order.length}
        playing={playing}
        onPrev={prev}
        onNext={next}
        onPlayToggle={toggle}
        onReset={reset}
        label={done ? (path.length ? "goal reached!" : "no path") : "searching…"}
      />
    </div>
  );
}

// ============================================================
// Minimax — values propagating up a game tree
// ============================================================
const MM_LEAVES = [3, 12, 8, 2, 4, 6, 14, 5, 2];
// tree: root MAX -> 3 children MIN -> each 3 leaves
const MM_STEPS = [
  { reveal: 0, caption: "Start with the scores of each final position (the leaves)." },
  { reveal: 1, caption: "Left MIN node picks the smallest of its children." },
  { reveal: 2, caption: "Middle MIN node picks the smallest of its children." },
  { reveal: 3, caption: "Right MIN node picks the smallest of its children." },
  { reveal: 4, caption: "The root MAX node picks the largest — that's the best move." },
];

export function MinimaxViz() {
  const { step, playing, next, prev, reset, toggle } = useStepper(MM_STEPS.length, 1100);
  const reveal = MM_STEPS[Math.min(step, MM_STEPS.length - 1)].reveal;
  const childVals = [0, 1, 2].map((i) => Math.min(...MM_LEAVES.slice(i * 3, i * 3 + 3)));
  const rootVal = Math.max(...childVals);
  const bestChild = childVals.indexOf(rootVal);

  const W = 100;
  const H = 62;
  const leafX = (i: number) => 8 + (i / 8) * (W - 16);
  const childX = (i: number) => leafX(i * 3 + 1);
  const rootX = W / 2;

  const node = (x: number, y: number, val: number | null, kind: "max" | "min" | "leaf", on: boolean, best = false) => (
    <g>
      <circle
        cx={x}
        cy={y}
        r={4.2}
        fill={on ? (kind === "max" ? "rgb(var(--accent))" : kind === "min" ? CLASS_B : "rgb(var(--surface-2))") : "rgb(var(--surface-2))"}
        stroke={best ? "rgb(var(--accent))" : "rgb(var(--border))"}
        strokeWidth={best ? 1 : 0.5}
        style={{ transition: "fill 0.3s" }}
      />
      {val !== null && on && (
        <text x={x} y={y + 1.5} fontSize={4} fill={kind === "leaf" ? "rgb(var(--fg))" : "#fff"} textAnchor="middle" fontWeight="bold">
          {val}
        </text>
      )}
    </g>
  );

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-border bg-[rgb(var(--code-bg))]">
        {/* edges root->children */}
        {[0, 1, 2].map((i) => (
          <line key={i} x1={rootX} y1={12} x2={childX(i)} y2={32} stroke={reveal >= 4 && i === bestChild ? "rgb(var(--accent))" : "rgb(var(--border))"} strokeWidth={reveal >= 4 && i === bestChild ? 1 : 0.4} />
        ))}
        {/* edges children->leaves */}
        {[0, 1, 2].map((ci) =>
          [0, 1, 2].map((li) => {
            const idx = ci * 3 + li;
            return <line key={idx} x1={childX(ci)} y1={32} x2={leafX(idx)} y2={52} stroke="rgb(var(--border))" strokeWidth={0.4} />;
          })
        )}
        {/* leaves */}
        {MM_LEAVES.map((v, i) => (
          <g key={`leaf-${i}`}>{node(leafX(i), 52, v, "leaf", reveal >= 0)}</g>
        ))}
        {/* MIN children */}
        {childVals.map((v, i) => (
          <g key={`min-${i}`}>{node(childX(i), 32, v, "min", reveal >= i + 1, false)}</g>
        ))}
        {/* MAX root */}
        {node(rootX, 12, rootVal, "max", reveal >= 4, reveal >= 4)}
        <text x={2} y={13} fontSize={3.6} fill="rgb(var(--accent))">MAX</text>
        <text x={2} y={33} fontSize={3.6} fill={CLASS_B}>MIN</text>
      </svg>
      <p className="mt-2 min-h-[1.5rem] text-sm text-fg/90">
        {MM_STEPS[Math.min(step, MM_STEPS.length - 1)].caption}
      </p>
      <VizControls step={step} total={MM_STEPS.length} playing={playing} onPrev={prev} onNext={next} onPlayToggle={toggle} onReset={reset} />
    </div>
  );
}

// ============================================================
// Perceptron — a line learning to separate two classes
// ============================================================
const PC_POINTS = (() => {
  const rand = mulberry32(17);
  const pts: { x: number; y: number; label: 1 | -1 }[] = [];
  for (let i = 0; i < 10; i++) {
    const x = 1 + rand() * 8;
    const y = 1 + rand() * 8;
    // true boundary ~ y = x  (with margin)
    if (y - x > 0.8) pts.push({ x, y, label: 1 });
    else if (y - x < -0.8) pts.push({ x, y, label: -1 });
  }
  return pts;
})();

export function PerceptronViz() {
  const traj = useMemo(() => {
    let w1 = 1,
      w2 = -0.2,
      b = -0.5;
    const lr = 0.1;
    const snaps: { w1: number; w2: number; b: number; acc: number }[] = [];
    const predict = (p: { x: number; y: number }, W1: number, W2: number, B: number) =>
      W1 * p.x + W2 * p.y + B >= 0 ? 1 : -1;
    const accOf = () =>
      PC_POINTS.filter((p) => predict(p, w1, w2, b) === p.label).length / PC_POINTS.length;
    for (let epoch = 0; epoch < 25; epoch++) {
      snaps.push({ w1, w2, b, acc: accOf() });
      let updated = false;
      for (const p of PC_POINTS) {
        const pred = predict(p, w1, w2, b);
        if (pred !== p.label) {
          w1 += lr * p.label * p.x;
          w2 += lr * p.label * p.y;
          b += lr * p.label;
          updated = true;
        }
      }
      if (!updated) break;
    }
    snaps.push({ w1, w2, b, acc: accOf() });
    return snaps;
  }, []);
  const { step, playing, next, prev, reset, toggle } = useStepper(traj.length, 500);
  const { w1, w2, b, acc } = traj[Math.min(step, traj.length - 1)];

  const PAD = 10;
  const X = (v: number) => PAD + (v / 10) * (100 - 2 * PAD);
  const Y = (v: number) => 100 - PAD - (v / 10) * (100 - 2 * PAD);
  // line: w1*x + w2*y + b = 0 -> y = -(w1*x + b)/w2
  const lineY = (x: number) => (Math.abs(w2) < 1e-6 ? 5 : -(w1 * x + b) / w2);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-sm text-fg">
          accuracy {(acc * 100).toFixed(0)}%
        </span>
        <span className="rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted">
          w=({w1.toFixed(1)}, {w2.toFixed(1)}) b={b.toFixed(1)}
        </span>
      </div>
      <svg viewBox="0 0 100 100" className="w-full rounded-xl border border-border bg-[rgb(var(--code-bg))]">
        <motion.line
          x1={X(0)}
          y1={Y(Math.max(-2, Math.min(12, lineY(0))))}
          x2={X(10)}
          y2={Y(Math.max(-2, Math.min(12, lineY(10))))}
          stroke="rgb(var(--accent))"
          strokeWidth={1.2}
          animate={{ y1: Y(Math.max(-2, Math.min(12, lineY(0)))), y2: Y(Math.max(-2, Math.min(12, lineY(10)))) }}
        />
        {PC_POINTS.map((p, i) => {
          const correct = (w1 * p.x + w2 * p.y + b >= 0 ? 1 : -1) === p.label;
          return (
            <circle
              key={i}
              cx={X(p.x)}
              cy={Y(p.y)}
              r={2}
              fill={p.label === 1 ? CLASS_A : CLASS_B}
              stroke={correct ? "none" : "rgb(var(--fg))"}
              strokeWidth={0.7}
              opacity={correct ? 1 : 0.6}
            />
          );
        })}
      </svg>
      <p className="mt-2 text-sm text-muted">
        Each pass, the perceptron nudges its line toward any point it gets wrong. Watch it <span className="font-semibold text-fg">rotate until it cleanly separates</span> the two classes.
      </p>
      <VizControls step={step} total={traj.length} playing={playing} onPrev={prev} onNext={next} onPlayToggle={toggle} onReset={reset} label={`epoch ${step} / ${traj.length - 1}`} />
    </div>
  );
}

// ============================================================
// Next-token prediction — how a language model generates text
// ============================================================
const NEXT_TABLE: Record<string, [string, number][]> = {
  the: [["cat", 0.34], ["dog", 0.24], ["sun", 0.22], ["robot", 0.2]],
  cat: [["sat", 0.46], ["ran", 0.28], ["slept", 0.26]],
  dog: [["barked", 0.5], ["ran", 0.3], ["slept", 0.2]],
  sat: [["on", 0.62], ["quietly", 0.22], ["down", 0.16]],
  on: [["the", 0.7], ["a", 0.3]],
  ran: [["away", 0.5], ["fast", 0.3], ["home", 0.2]],
  sun: [["rose", 0.5], ["set", 0.3], ["shone", 0.2]],
  robot: [["learned", 0.45], ["computed", 0.3], ["beeped", 0.25]],
  mat: [[".", 0.6], ["softly", 0.4]],
};
const DEFAULT_NEXT: [string, number][] = [["mat", 0.4], ["floor", 0.35], [".", 0.25]];

export function NextTokenViz() {
  const [tokens, setTokens] = useState<string[]>(["The", "cat"]);
  const last = tokens[tokens.length - 1].toLowerCase().replace(/[^a-z]/g, "");
  const ended = tokens[tokens.length - 1] === ".";
  const candidates = ended ? [] : NEXT_TABLE[last] ?? DEFAULT_NEXT;

  const pick = (tok: string) => setTokens((t) => [...t, tok]);
  const pickTop = () => {
    if (!candidates.length) return;
    const top = [...candidates].sort((a, b) => b[1] - a[1])[0][0];
    pick(top);
  };

  return (
    <div>
      <div className="min-h-[2.5rem] rounded-xl border border-border bg-surface-2/50 p-3 font-mono text-lg text-fg">
        {tokens.map((t, i) => (
          <motion.span key={i} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className={i === tokens.length - 1 ? "text-accent" : ""}>
            {t}
            {t === "." ? "" : " "}
          </motion.span>
        ))}
        {!ended && <span className="animate-blink text-accent">▋</span>}
      </div>

      {!ended ? (
        <>
          <p className="mb-2 mt-3 text-xs font-semibold uppercase tracking-wider text-faint">
            Predicted next token
          </p>
          <div className="space-y-1.5">
            {candidates.map(([tok, p]) => (
              <button
                key={tok}
                type="button"
                onClick={() => pick(tok)}
                className="flex w-full items-center gap-3 rounded-lg border border-border bg-surface px-3 py-1.5 text-left transition-colors hover:border-accent/50"
              >
                <span className="w-20 shrink-0 font-mono text-sm text-fg">{tok === "." ? "· (end)" : tok}</span>
                <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-accent-2" style={{ width: `${p * 100}%` }} />
                </span>
                <span className="w-10 shrink-0 text-right font-mono text-xs text-muted">{Math.round(p * 100)}%</span>
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={pickTop} className="rounded-xl bg-gradient-to-br from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]">
              Pick most likely →
            </button>
            <button type="button" onClick={() => setTokens(["The", "cat"])} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-accent">
              Reset
            </button>
          </div>
        </>
      ) : (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-sm font-semibold text-emerald-500">Sentence complete! 🎉</span>
          <button type="button" onClick={() => setTokens(["The", "cat"])} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-accent">
            Try again
          </button>
        </div>
      )}
      <p className="mt-3 text-sm text-muted">
        A language model just predicts the <span className="font-semibold text-fg">next token</span> from probabilities, adds it, and repeats. Do that thousands of times and you get fluent text.
      </p>
    </div>
  );
}

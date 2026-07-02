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
  CLUSTER_COLORS,
} from "./viz-shared";

// Plot helpers: data domain [0,10] mapped into a 100×100 viewBox.
const PAD = 10;
const X = (v: number) => PAD + (v / 10) * (100 - 2 * PAD);
const Y = (v: number) => 100 - PAD - (v / 10) * (100 - 2 * PAD);

function Axes() {
  return (
    <>
      <line x1={PAD} y1={100 - PAD} x2={100 - PAD} y2={100 - PAD} stroke="rgb(var(--border))" strokeWidth={0.6} />
      <line x1={PAD} y1={PAD} x2={PAD} y2={100 - PAD} stroke="rgb(var(--border))" strokeWidth={0.6} />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-faint">{label}</div>
      <div className="font-mono text-sm font-bold text-fg">{value}</div>
    </div>
  );
}

// ============================================================
// Gradient Descent — a ball rolling down a loss curve
// ============================================================
export function GradientDescentViz() {
  const [lr, setLr] = useState(0.12);
  const loss = (x: number) => 0.9 * (x - 5) ** 2;
  const grad = (x: number) => 1.8 * (x - 5);

  const traj = useMemo(() => {
    const xs = [0.6];
    for (let i = 0; i < 24; i++) {
      const x = xs[xs.length - 1];
      let nx = x - lr * grad(x);
      nx = Math.max(0, Math.min(10, nx));
      xs.push(nx);
      if (Math.abs(nx - x) < 0.002) break;
    }
    return xs;
  }, [lr]);

  const { step, playing, next, prev, reset, toggle, setStep } = useStepper(
    traj.length,
    550
  );
  const x = traj[Math.min(step, traj.length - 1)];
  const LY = (v: number) => 100 - PAD - (v / 25) * (100 - 2 * PAD);
  const curve = Array.from({ length: 61 }, (_, i) => {
    const cx = (i / 60) * 10;
    return `${X(cx)},${LY(loss(cx))}`;
  }).join(" ");

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">learning rate</span>
          <input
            type="range"
            min={0.02}
            max={0.6}
            step={0.02}
            value={lr}
            onChange={(e) => {
              setLr(Number(e.target.value));
              setStep(0);
            }}
            className="accent-accent"
          />
          <span className="font-mono text-accent">{lr.toFixed(2)}</span>
        </label>
        <div className="ml-auto flex gap-2">
          <Stat label="x" value={x.toFixed(2)} />
          <Stat label="loss" value={loss(x).toFixed(2)} />
        </div>
      </div>
      <svg viewBox="0 0 100 100" className="w-full rounded-xl border border-border bg-[rgb(var(--code-bg))]">
        <Axes />
        <polyline points={curve} fill="none" stroke="rgb(var(--accent))" strokeWidth={1} opacity={0.7} />
        <text x={X(5)} y={LY(0) + 6} fontSize={4} fill="rgb(var(--faint))" textAnchor="middle">
          minimum
        </text>
        <motion.circle
          cx={X(x)}
          cy={LY(loss(x))}
          r={2.6}
          fill={CLASS_B}
          animate={{ cx: X(x), cy: LY(loss(x)) }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        />
      </svg>
      <p className="mt-2 text-sm text-muted">
        The ball takes steps <span className="font-semibold text-fg">downhill</span>{" "}
        (opposite the slope) to reach the lowest loss. Too high a learning rate and
        it overshoots and bounces; too low and it crawls.
      </p>
      <VizControls
        step={step}
        total={traj.length}
        playing={playing}
        onPrev={prev}
        onNext={next}
        onPlayToggle={toggle}
        onReset={reset}
      />
    </div>
  );
}

// ============================================================
// Linear Regression — fitting the best line via gradient descent
// ============================================================
const LR_POINTS = (() => {
  const rand = mulberry32(7);
  return Array.from({ length: 9 }, (_, i) => {
    const x = 0.6 + i * 1.05;
    const y = 0.9 * x + 1.2 + (rand() - 0.5) * 2.6;
    return { x, y: Math.max(0.3, Math.min(9.7, y)) };
  });
})();

export function LinearRegressionViz() {
  const traj = useMemo(() => {
    let w = 0,
      b = 0;
    const lr = 0.012;
    const out: { w: number; b: number; mse: number }[] = [];
    const mseOf = (w: number, b: number) =>
      LR_POINTS.reduce((s, p) => s + (w * p.x + b - p.y) ** 2, 0) / LR_POINTS.length;
    for (let i = 0; i < 60; i++) {
      out.push({ w, b, mse: mseOf(w, b) });
      let dw = 0,
        db = 0;
      for (const p of LR_POINTS) {
        const err = w * p.x + b - p.y;
        dw += 2 * err * p.x;
        db += 2 * err;
      }
      w -= (lr * dw) / LR_POINTS.length;
      b -= (lr * db) / LR_POINTS.length;
    }
    out.push({ w, b, mse: mseOf(w, b) });
    return out;
  }, []);
  const { step, playing, next, prev, reset, toggle } = useStepper(traj.length, 90);
  const { w, b, mse } = traj[Math.min(step, traj.length - 1)];

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <Stat label="slope w" value={w.toFixed(2)} />
        <Stat label="intercept b" value={b.toFixed(2)} />
        <Stat label="error (MSE)" value={mse.toFixed(2)} />
      </div>
      <svg viewBox="0 0 100 100" className="w-full rounded-xl border border-border bg-[rgb(var(--code-bg))]">
        <Axes />
        {LR_POINTS.map((p, i) => (
          <g key={i}>
            <line
              x1={X(p.x)}
              y1={Y(p.y)}
              x2={X(p.x)}
              y2={Y(w * p.x + b)}
              stroke={CLASS_B}
              strokeWidth={0.5}
              strokeDasharray="1 1"
              opacity={0.6}
            />
            <circle cx={X(p.x)} cy={Y(p.y)} r={1.8} fill={CLASS_A} />
          </g>
        ))}
        <motion.line
          x1={X(0)}
          y1={Y(b)}
          x2={X(10)}
          y2={Y(w * 10 + b)}
          stroke="rgb(var(--accent))"
          strokeWidth={1.4}
          animate={{ y1: Y(b), y2: Y(w * 10 + b) }}
        />
      </svg>
      <p className="mt-2 text-sm text-muted">
        Watch the line rotate and shift to <span className="font-semibold text-fg">minimize the squared distance</span>{" "}
        (dashed lines) to every point. That's gradient descent finding the best-fit line.
      </p>
      <VizControls
        step={step}
        total={traj.length}
        playing={playing}
        onPrev={prev}
        onNext={next}
        onPlayToggle={toggle}
        onReset={reset}
        label={`epoch ${step} / ${traj.length - 1}`}
      />
    </div>
  );
}

// ============================================================
// Sigmoid — turning a number into a probability
// ============================================================
export function SigmoidViz() {
  const [w, setW] = useState(1);
  const [xVal, setXVal] = useState(1.5);
  const sig = (x: number) => 1 / (1 + Math.exp(-w * x));
  // domain x [-8,8] → viewBox
  const SX = (v: number) => PAD + ((v + 8) / 16) * (100 - 2 * PAD);
  const SY = (p: number) => 100 - PAD - p * (100 - 2 * PAD);
  const curve = Array.from({ length: 81 }, (_, i) => {
    const cx = -8 + (i / 80) * 16;
    return `${SX(cx)},${SY(sig(cx))}`;
  }).join(" ");
  const prob = sig(xVal);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">input x</span>
          <input type="range" min={-8} max={8} step={0.1} value={xVal} onChange={(e) => setXVal(Number(e.target.value))} className="accent-accent" />
          <span className="font-mono text-accent">{xVal.toFixed(1)}</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">steepness</span>
          <input type="range" min={0.3} max={3} step={0.1} value={w} onChange={(e) => setW(Number(e.target.value))} className="accent-accent" />
          <span className="font-mono text-accent">{w.toFixed(1)}</span>
        </label>
        <div className="ml-auto">
          <Stat label={`prob → ${prob >= 0.5 ? "class 1" : "class 0"}`} value={prob.toFixed(2)} />
        </div>
      </div>
      <svg viewBox="0 0 100 100" className="w-full rounded-xl border border-border bg-[rgb(var(--code-bg))]">
        <Axes />
        <line x1={PAD} y1={SY(0.5)} x2={100 - PAD} y2={SY(0.5)} stroke="rgb(var(--faint))" strokeWidth={0.4} strokeDasharray="1 1" />
        <text x={100 - PAD} y={SY(0.5) - 1} fontSize={3.4} fill="rgb(var(--faint))" textAnchor="end">threshold 0.5</text>
        <polyline points={curve} fill="none" stroke="rgb(var(--accent))" strokeWidth={1.4} />
        <line x1={SX(xVal)} y1={SY(0)} x2={SX(xVal)} y2={SY(prob)} stroke={CLASS_B} strokeWidth={0.6} strokeDasharray="1 1" />
        <circle cx={SX(xVal)} cy={SY(prob)} r={2.4} fill={prob >= 0.5 ? CLASS_A : CLASS_B} />
      </svg>
      <p className="mt-2 text-sm text-muted">
        The <span className="font-semibold text-fg">sigmoid</span> squashes any number into a probability from 0 to 1. Predict <b>class 1</b> when it crosses the 0.5 threshold.
      </p>
    </div>
  );
}

// ============================================================
// k-Nearest Neighbors — classify by the closest points
// ============================================================
const KNN_POINTS = (() => {
  const rand = mulberry32(21);
  const pts: { x: number; y: number; c: 0 | 1 }[] = [];
  for (let i = 0; i < 9; i++) pts.push({ x: 1.5 + rand() * 3.5, y: 5.5 + rand() * 3.5, c: 0 });
  for (let i = 0; i < 9; i++) pts.push({ x: 5.5 + rand() * 3.5, y: 1.5 + rand() * 3.5, c: 1 });
  return pts;
})();

export function KNNViz() {
  const [k, setK] = useState(3);
  const [q, setQ] = useState({ x: 5, y: 5 });

  const nearest = useMemo(() => {
    return KNN_POINTS.map((p, i) => ({ i, d: Math.hypot(p.x - q.x, p.y - q.y), c: p.c }))
      .sort((a, b) => a.d - b.d)
      .slice(0, k);
  }, [k, q]);
  const votes = nearest.filter((n) => n.c === 0).length;
  const pred: 0 | 1 = votes > k / 2 ? 0 : 1;

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    const dx = ((px - PAD) / (100 - 2 * PAD)) * 10;
    const dy = ((100 - PAD - py) / (100 - 2 * PAD)) * 10;
    setQ({ x: Math.max(0, Math.min(10, dx)), y: Math.max(0, Math.min(10, dy)) });
  };
  const nearestSet = new Set(nearest.map((n) => n.i));

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted">k =</span>
          {[1, 3, 5, 7].map((v) => (
            <Chip key={v} active={k === v} onClick={() => setK(v)}>
              {v}
            </Chip>
          ))}
        </div>
        <div className="ml-auto">
          <Stat label="prediction" value={pred === 0 ? "Class A" : "Class B"} />
        </div>
      </div>
      <svg viewBox="0 0 100 100" onClick={onClick} className="w-full cursor-crosshair rounded-xl border border-border bg-[rgb(var(--code-bg))]">
        <Axes />
        {nearest.map((n) => (
          <line key={n.i} x1={X(q.x)} y1={Y(q.y)} x2={X(KNN_POINTS[n.i].x)} y2={Y(KNN_POINTS[n.i].y)} stroke="rgb(var(--faint))" strokeWidth={0.4} />
        ))}
        {KNN_POINTS.map((p, i) => (
          <circle key={i} cx={X(p.x)} cy={Y(p.y)} r={nearestSet.has(i) ? 2.4 : 1.8} fill={p.c === 0 ? CLASS_A : CLASS_B} stroke={nearestSet.has(i) ? "rgb(var(--fg))" : "none"} strokeWidth={0.5} />
        ))}
        <motion.g animate={{ x: X(q.x), y: Y(q.y) }} style={{ x: X(q.x), y: Y(q.y) }}>
          <rect x={-2.4} y={-2.4} width={4.8} height={4.8} rx={0.8} fill={pred === 0 ? CLASS_A : CLASS_B} stroke="rgb(var(--fg))" strokeWidth={0.6} />
        </motion.g>
      </svg>
      <p className="mt-2 text-sm text-muted">
        The square is a new point. It's classified by a <span className="font-semibold text-fg">majority vote</span> of its {k} nearest neighbors. <span className="text-faint">Click anywhere to move it.</span>
      </p>
    </div>
  );
}

// ============================================================
// k-Means — clustering unlabeled points
// ============================================================
const KM_POINTS = (() => {
  const rand = mulberry32(3);
  const centers = [
    [3, 7],
    [7, 7.5],
    [5.5, 3],
  ];
  const pts: { x: number; y: number }[] = [];
  for (const [cx, cy] of centers)
    for (let i = 0; i < 9; i++) pts.push({ x: cx + (rand() - 0.5) * 3, y: cy + (rand() - 0.5) * 3 });
  return pts;
})();

export function KMeansViz() {
  const [k, setK] = useState(3);
  const snapshots = useMemo(() => {
    const rand = mulberry32(99 + k);
    let centroids = Array.from({ length: k }, () => ({ x: 1 + rand() * 8, y: 1 + rand() * 8 }));
    const snaps: { centroids: { x: number; y: number }[]; assign: number[]; phase: "assign" | "move" }[] = [];
    let assign = KM_POINTS.map(() => 0);
    for (let iter = 0; iter < 7; iter++) {
      // assign
      assign = KM_POINTS.map((p) => {
        let best = 0,
          bd = Infinity;
        centroids.forEach((c, ci) => {
          const d = (c.x - p.x) ** 2 + (c.y - p.y) ** 2;
          if (d < bd) {
            bd = d;
            best = ci;
          }
        });
        return best;
      });
      snaps.push({ centroids: centroids.map((c) => ({ ...c })), assign: [...assign], phase: "assign" });
      // move
      const next = centroids.map((c, ci) => {
        const mine = KM_POINTS.filter((_, i) => assign[i] === ci);
        if (!mine.length) return { ...c };
        return {
          x: mine.reduce((s, p) => s + p.x, 0) / mine.length,
          y: mine.reduce((s, p) => s + p.y, 0) / mine.length,
        };
      });
      const moved = next.some((c, i) => Math.hypot(c.x - centroids[i].x, c.y - centroids[i].y) > 0.03);
      centroids = next;
      snaps.push({ centroids: centroids.map((c) => ({ ...c })), assign: [...assign], phase: "move" });
      if (!moved) break;
    }
    return snaps;
  }, [k]);

  const { step, playing, next, prev, reset, toggle } = useStepper(snapshots.length, 800);
  const snap = snapshots[Math.min(step, snapshots.length - 1)];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted">clusters k =</span>
          {[2, 3, 4].map((v) => (
            <Chip key={v} active={k === v} onClick={() => setK(v)}>
              {v}
            </Chip>
          ))}
        </div>
        <span className="ml-auto rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-muted">
          {snap.phase === "assign" ? "① assign points to nearest centroid" : "② move centroids to cluster mean"}
        </span>
      </div>
      <svg viewBox="0 0 100 100" className="w-full rounded-xl border border-border bg-[rgb(var(--code-bg))]">
        <Axes />
        {KM_POINTS.map((p, i) => (
          <circle key={i} cx={X(p.x)} cy={Y(p.y)} r={1.7} fill={CLUSTER_COLORS[snap.assign[i] % CLUSTER_COLORS.length]} opacity={0.85} style={{ transition: "fill 0.4s" }} />
        ))}
        {snap.centroids.map((c, i) => (
          <motion.g key={i} animate={{ x: X(c.x), y: Y(c.y) }} style={{ x: X(c.x), y: Y(c.y) }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
            <path d="M0,-3.4 L1,-1 L3.4,-1 L1.4,0.6 L2.2,3.2 L0,1.6 L-2.2,3.2 L-1.4,0.6 L-3.4,-1 L-1,-1 Z" fill={CLUSTER_COLORS[i % CLUSTER_COLORS.length]} stroke="rgb(var(--fg))" strokeWidth={0.5} />
          </motion.g>
        ))}
      </svg>
      <p className="mt-2 text-sm text-muted">
        k-means repeats two steps until stable: <span className="font-semibold text-fg">assign</span> each point to its nearest star (centroid), then <span className="font-semibold text-fg">move</span> each star to the middle of its points.
      </p>
      <VizControls step={step} total={snapshots.length} playing={playing} onPrev={prev} onNext={next} onPlayToggle={toggle} onReset={reset} />
    </div>
  );
}

// ============================================================
// Overfitting — model complexity vs generalization
// ============================================================
function solveLinear(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((r, i) => [...r, b[i]]);
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    [M[col], M[piv]] = [M[piv], M[col]];
    const d = M[col][col];
    if (Math.abs(d) < 1e-9) continue;
    for (let j = col; j <= n; j++) M[col][j] /= d;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col];
      for (let j = col; j <= n; j++) M[r][j] -= f * M[col][j];
    }
  }
  return M.map((r) => r[n]);
}
function polyfit(xs: number[], ys: number[], deg: number): number[] {
  const n = deg + 1;
  const A = Array.from({ length: n }, () => Array(n).fill(0));
  const b = Array(n).fill(0);
  for (let k = 0; k < xs.length; k++) {
    const powers: number[] = [];
    let xp = 1;
    for (let p = 0; p < 2 * n; p++) {
      powers.push(xp);
      xp *= xs[k];
    }
    for (let i = 0; i < n; i++) {
      b[i] += ys[k] * powers[i];
      for (let j = 0; j < n; j++) A[i][j] += powers[i + j];
    }
  }
  return solveLinear(A, b);
}
const polyval = (c: number[], x: number) => c.reduce((s, ci, i) => s + ci * x ** i, 0);

const OF_DATA = (() => {
  const rand = mulberry32(42);
  const f = (x: number) => 5 + 2.6 * Math.sin(x * 0.9); // true curve
  const pts = Array.from({ length: 11 }, (_, i) => {
    const x = i * 1.0;
    return { x, y: f(x) + (rand() - 0.5) * 2.4 };
  });
  return pts;
})();

export function OverfittingViz() {
  const [deg, setDeg] = useState(3);
  const sx = (x: number) => (x - 5) / 5; // scale to ~[-1,1]
  const { coeffs, trainErr } = useMemo(() => {
    const xs = OF_DATA.map((p) => sx(p.x));
    const ys = OF_DATA.map((p) => p.y);
    const c = polyfit(xs, ys, deg);
    const err = OF_DATA.reduce((s, p) => s + (polyval(c, sx(p.x)) - p.y) ** 2, 0) / OF_DATA.length;
    return { coeffs: c, trainErr: err };
  }, [deg]);
  const curve = Array.from({ length: 81 }, (_, i) => {
    const cx = (i / 80) * 10;
    const cy = Math.max(-2, Math.min(12, polyval(coeffs, sx(cx))));
    return `${X(cx)},${Y(cy)}`;
  }).join(" ");
  const verdict = deg <= 1 ? "Underfit — too simple" : deg <= 4 ? "Good fit — captures the trend" : "Overfit — chasing noise";

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">model complexity (degree)</span>
          <input type="range" min={1} max={10} step={1} value={deg} onChange={(e) => setDeg(Number(e.target.value))} className="accent-accent" />
          <span className="font-mono text-accent">{deg}</span>
        </label>
        <span className={`ml-auto rounded-lg px-3 py-1.5 text-sm font-semibold ${deg <= 1 ? "bg-amber-500/15 text-amber-500" : deg <= 4 ? "bg-emerald-500/15 text-emerald-500" : "bg-rose-500/15 text-rose-500"}`}>
          {verdict}
        </span>
      </div>
      <svg viewBox="0 0 100 100" className="w-full rounded-xl border border-border bg-[rgb(var(--code-bg))]">
        <Axes />
        <polyline points={curve} fill="none" stroke="rgb(var(--accent))" strokeWidth={1.4} />
        {OF_DATA.map((p, i) => (
          <circle key={i} cx={X(p.x)} cy={Y(p.y)} r={1.8} fill={CLASS_B} />
        ))}
      </svg>
      <p className="mt-2 text-sm text-muted">
        A too-simple model misses the pattern; a too-complex one wiggles through every noisy point and won't generalize. The <span className="font-semibold text-fg">sweet spot</span> is in the middle.
      </p>
    </div>
  );
}

// ============================================================
// Decision Tree — carving the space with yes/no splits
// ============================================================
const DT_POINTS = (() => {
  const rand = mulberry32(11);
  const pts: { x: number; y: number; c: 0 | 1 }[] = [];
  for (let i = 0; i < 10; i++) pts.push({ x: 0.8 + rand() * 3.6, y: 1 + rand() * 8, c: 0 }); // left → A
  for (let i = 0; i < 6; i++) pts.push({ x: 5.2 + rand() * 3.8, y: 5.4 + rand() * 3.4, c: 1 }); // right-top → B
  for (let i = 0; i < 6; i++) pts.push({ x: 5.2 + rand() * 3.8, y: 1 + rand() * 3.2, c: 0 }); // right-bottom → A
  return pts;
})();
const DT_STEPS = [
  { text: "All the data — mixed classes.", splits: [] as { x?: number; y?: number; x0: number; x1: number; y0: number; y1: number }[] },
  { text: "Split 1: is x < 5?  →  left region is pure Class A.", splits: [{ x: 5, x0: 0, x1: 10, y0: 0, y1: 10 }] },
  { text: "Split 2 (right side): is y < 5?  →  now every region is pure.", splits: [{ x: 5, x0: 0, x1: 10, y0: 0, y1: 10 }, { y: 5, x0: 5, x1: 10, y0: 0, y1: 10 }] },
];

export function DecisionTreeViz() {
  const { step, playing, next, prev, reset, toggle } = useStepper(DT_STEPS.length, 1200);
  const s = DT_STEPS[Math.min(step, DT_STEPS.length - 1)];
  // colored regions after all splits appear
  const regions =
    step >= 2
      ? [
          { x0: 0, y0: 0, x1: 5, y1: 10, c: 0 },
          { x0: 5, y0: 5, x1: 10, y1: 10, c: 1 },
          { x0: 5, y0: 0, x1: 10, y1: 5, c: 0 },
        ]
      : step === 1
      ? [{ x0: 0, y0: 0, x1: 5, y1: 10, c: 0 }]
      : [];

  return (
    <div>
      <svg viewBox="0 0 100 100" className="w-full rounded-xl border border-border bg-[rgb(var(--code-bg))]">
        {regions.map((r, i) => (
          <motion.rect
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            x={X(r.x0)}
            y={Y(r.y1)}
            width={X(r.x1) - X(r.x0)}
            height={Y(r.y0) - Y(r.y1)}
            fill={r.c === 0 ? CLASS_A : CLASS_B}
          />
        ))}
        <Axes />
        {s.splits.map((sp, i) =>
          sp.x !== undefined ? (
            <motion.line key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} x1={X(sp.x)} y1={Y(sp.y1)} x2={X(sp.x)} y2={Y(sp.y0)} stroke="rgb(var(--fg))" strokeWidth={0.8} strokeDasharray="2 1" />
          ) : (
            <motion.line key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} x1={X(sp.x0)} y1={Y(sp.y!)} x2={X(sp.x1)} y2={Y(sp.y!)} stroke="rgb(var(--fg))" strokeWidth={0.8} strokeDasharray="2 1" />
          )
        )}
        {DT_POINTS.map((p, i) => (
          <circle key={i} cx={X(p.x)} cy={Y(p.y)} r={1.7} fill={p.c === 0 ? CLASS_A : CLASS_B} />
        ))}
      </svg>
      <p className="mt-2 min-h-[1.5rem] text-sm text-fg/90">{s.text}</p>
      <VizControls step={step} total={DT_STEPS.length} playing={playing} onPrev={prev} onNext={next} onPlayToggle={toggle} onReset={reset} />
    </div>
  );
}

// ============================================================
// Neural Network — forward pass activations lighting up
// ============================================================
const NN_LAYERS = [3, 5, 5, 2];
export function NeuralNetViz() {
  const total = NN_LAYERS.length;
  const { step, playing, next, prev, reset, toggle } = useStepper(total + 1, 700);
  const W = 100;
  const H = 66;
  const colX = (l: number) => 12 + (l / (NN_LAYERS.length - 1)) * (W - 24);
  const nodeY = (count: number, i: number) => (H / (count + 1)) * (i + 1);
  const rand = useMemo(() => mulberry32(5), []);
  const acts = useMemo(
    () => NN_LAYERS.map((c) => Array.from({ length: c }, () => 0.2 + rand() * 0.8)),
    [rand]
  );

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-border bg-[rgb(var(--code-bg))]">
        {/* edges */}
        {NN_LAYERS.slice(0, -1).map((c, l) =>
          Array.from({ length: c }).map((_, i) =>
            Array.from({ length: NN_LAYERS[l + 1] }).map((__, j) => {
              const lit = step > l + 1;
              return (
                <line
                  key={`${l}-${i}-${j}`}
                  x1={colX(l)}
                  y1={nodeY(c, i)}
                  x2={colX(l + 1)}
                  y2={nodeY(NN_LAYERS[l + 1], j)}
                  stroke={lit ? "rgb(var(--accent))" : "rgb(var(--border))"}
                  strokeWidth={lit ? 0.4 : 0.25}
                  opacity={lit ? 0.5 : 0.5}
                  style={{ transition: "stroke 0.4s" }}
                />
              );
            })
          )
        )}
        {/* nodes */}
        {NN_LAYERS.map((c, l) =>
          Array.from({ length: c }).map((_, i) => {
            const on = step > l;
            return (
              <motion.circle
                key={`${l}-${i}`}
                cx={colX(l)}
                cy={nodeY(c, i)}
                r={3.2}
                animate={{ scale: on ? 1 : 0.8 }}
                fill={on ? `rgba(99,91,241,${acts[l][i]})` : "rgb(var(--surface-2))"}
                stroke={on ? "rgb(var(--accent))" : "rgb(var(--border))"}
                strokeWidth={0.5}
                style={{ transition: "fill 0.4s, stroke 0.4s" }}
              />
            );
          })
        )}
        {["input", "hidden", "hidden", "output"].map((lbl, l) => (
          <text key={l} x={colX(l)} y={H - 2} fontSize={3.2} fill="rgb(var(--faint))" textAnchor="middle">
            {lbl}
          </text>
        ))}
      </svg>
      <p className="mt-2 text-sm text-muted">
        A <span className="font-semibold text-fg">forward pass</span>: values flow left→right. Each neuron adds up its weighted inputs, applies an activation, and passes the result on — until the output layer makes a prediction.
      </p>
      <VizControls
        step={step}
        total={total + 1}
        playing={playing}
        onPrev={prev}
        onNext={next}
        onPlayToggle={toggle}
        onReset={reset}
        label={step === 0 ? "ready" : step > NN_LAYERS.length ? "prediction!" : `layer ${step} active`}
      />
    </div>
  );
}

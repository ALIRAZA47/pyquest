"use client";

// Animated visualizers for the Large Language Models course. Themed with the
// course accent (rgb(var(--accent))). Stepped ones use useStepper; interactive
// ones use local state (randomness only inside event handlers, never at render,
// to stay hydration-safe).

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStepper, VizControls } from "./viz-shared";

const ACC = "rgb(var(--accent))";
const ACC2 = "rgb(var(--accent-2))";

// ============================================================
// 1. Tokenizer — text → tokens (interactive)
// ============================================================

function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 50000;
}

function tokenize(text: string): string[] {
  const raw = text.match(/\s+|[A-Za-z]+|[0-9]+|[^\sA-Za-z0-9]/g) || [];
  const out: string[] = [];
  for (const r of raw) {
    if (/^\s+$/.test(r)) continue; // whitespace folds into the gap between chips
    if (/^[A-Za-z]+$/.test(r) && r.length > 6) {
      for (let i = 0; i < r.length; i += 4) out.push(r.slice(i, i + 4));
    } else out.push(r);
  }
  return out;
}

const TOK_COLORS = [
  "rgb(var(--accent) / 0.16)",
  "rgb(var(--accent-2) / 0.16)",
  "rgba(56,189,248,0.16)",
  "rgba(34,197,94,0.16)",
  "rgba(244,114,182,0.16)",
];

function TokenizerViz() {
  const [text, setText] = useState("Large language models read tokens, not words.");
  const tokens = useMemo(() => tokenize(text), [text]);
  const chars = text.length;

  return (
    <div>
      <label className="mb-3 flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">
          your text
        </span>
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 120))}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-fg focus:border-accent/60 focus:outline-none"
        />
      </label>

      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-border bg-surface-2/40 p-3">
        {tokens.map((t, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18, delay: Math.min(i * 0.015, 0.3) }}
            className="flex flex-col items-center rounded-lg px-2 py-1"
            style={{ background: TOK_COLORS[i % TOK_COLORS.length] }}
          >
            <span className="font-mono text-sm font-semibold text-fg">
              {t.replace(/ /g, "␣")}
            </span>
            <span className="font-mono text-[9px] text-faint">{hashId(t)}</span>
          </motion.span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-lg px-2.5 py-1 font-mono font-bold" style={{ background: "rgb(var(--accent) / 0.12)", color: ACC }}>
          {tokens.length} tokens
        </span>
        <span className="font-mono text-faint">{chars} chars</span>
        <span className="text-muted">≈ {(chars / Math.max(1, tokens.length)).toFixed(1)} chars / token</span>
      </div>
      <p className="mt-2 text-xs text-faint">
        Models split text into tokens (whole words, word-pieces, or symbols) and
        map each to an ID. Rule of thumb: ~4 characters ≈ 1 token.
      </p>
    </div>
  );
}

// ============================================================
// 2. Embeddings — meaning as geometry (interactive)
// ============================================================

interface WordPt { w: string; x: number; y: number; c: number }
const EMB_WORDS: WordPt[] = [
  { w: "cat", x: 0.18, y: 0.26, c: 0 },
  { w: "dog", x: 0.26, y: 0.34, c: 0 },
  { w: "kitten", x: 0.12, y: 0.36, c: 0 },
  { w: "king", x: 0.74, y: 0.22, c: 1 },
  { w: "queen", x: 0.82, y: 0.3, c: 1 },
  { w: "prince", x: 0.7, y: 0.34, c: 1 },
  { w: "apple", x: 0.24, y: 0.76, c: 2 },
  { w: "banana", x: 0.16, y: 0.68, c: 2 },
  { w: "mango", x: 0.3, y: 0.7, c: 2 },
  { w: "code", x: 0.78, y: 0.74, c: 3 },
  { w: "data", x: 0.72, y: 0.66, c: 3 },
  { w: "server", x: 0.86, y: 0.72, c: 3 },
];
const EMB_COLORS = [ACC, ACC2, "#38bdf8", "#22c55e"];

function cosine(a: WordPt, b: WordPt): number {
  // treat coords relative to the plot center as 2D vectors
  const ax = a.x - 0.5, ay = a.y - 0.5, bx = b.x - 0.5, by = b.y - 0.5;
  const dot = ax * bx + ay * by;
  const m = Math.hypot(ax, ay) * Math.hypot(bx, by);
  return m === 0 ? 0 : dot / m;
}

function EmbeddingViz() {
  const [sel, setSel] = useState<number[]>([0, 2]);
  const toggle = (i: number) =>
    setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s.slice(-1), i]));
  const [a, b] = sel;
  const sim = sel.length === 2 ? cosine(EMB_WORDS[a], EMB_WORDS[b]) : null;
  const W = 340, H = 240;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-2xl border border-border bg-surface-2/30">
        {sel.length === 2 && (
          <line
            x1={EMB_WORDS[a].x * W} y1={EMB_WORDS[a].y * H}
            x2={EMB_WORDS[b].x * W} y2={EMB_WORDS[b].y * H}
            stroke={ACC} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7"
          />
        )}
        {EMB_WORDS.map((p, i) => {
          const on = sel.includes(i);
          return (
            <g key={p.w} onClick={() => toggle(i)} style={{ cursor: "pointer" }}>
              <motion.circle
                cx={p.x * W} cy={p.y * H} r={on ? 7 : 5}
                fill={EMB_COLORS[p.c]}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", delay: i * 0.03 }}
                stroke={on ? "rgb(var(--fg))" : "transparent"} strokeWidth="1.5"
              />
              <text x={p.x * W + 9} y={p.y * H + 4} fontSize="11" fontWeight={on ? 700 : 500} fill="rgb(var(--fg))">
                {p.w}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        {sel.length === 2 ? (
          <>
            <span className="font-mono text-muted">
              cos({EMB_WORDS[a].w}, {EMB_WORDS[b].w}) =
            </span>
            <span className="rounded-lg px-2.5 py-1 font-mono font-bold" style={{ background: "rgb(var(--accent) / 0.12)", color: ACC }}>
              {sim!.toFixed(2)}
            </span>
            <span className="text-muted">{sim! > 0.6 ? "→ very similar (same cluster)" : sim! > 0 ? "→ somewhat related" : "→ unrelated"}</span>
          </>
        ) : (
          <span className="text-faint">Click two words to compare their vectors.</span>
        )}
      </div>
      <p className="mt-2 text-xs text-faint">
        Embeddings turn each token into a vector. Words with similar meaning end
        up close together — meaning becomes geometry the model can do math on.
      </p>
    </div>
  );
}

// ============================================================
// 3. The transformer — signal rising through the stack
// ============================================================

const TOKENS_T = ["The", "cat", "sat", "___"];
const T_STEPS = [
  { row: 0, cap: "Each token becomes an embedding vector — the model's input." },
  { row: 1, cap: "Block 1: attention lets tokens share information, then an MLP transforms each." },
  { row: 2, cap: "Block 2: the same operation again — features get richer at every layer." },
  { row: 3, cap: "Block 3: after many blocks (real models stack dozens), the top layer is ready." },
  { row: 4, cap: "The final vector for the last position becomes scores over the whole vocabulary → the next token: “on”." },
];

function TransformerViz() {
  const { step, playing, next, prev, reset, toggle } = useStepper(T_STEPS.length, 1300);
  const rows = ["Embeddings", "Block 1", "Block 2", "Block 3", "Output"];
  const active = T_STEPS[step].row;

  return (
    <div>
      <div className="rounded-2xl border border-border bg-surface-2/40 p-4">
        <div className="flex flex-col-reverse gap-2">
          {rows.map((label, r) => {
            const on = r === active;
            const passed = r < active;
            return (
              <motion.div
                key={label}
                animate={{ opacity: on ? 1 : passed ? 0.85 : 0.4 }}
                className="flex items-center gap-2"
              >
                <span className="w-20 shrink-0 text-right font-mono text-[10px] text-faint">{label}</span>
                <div className="flex flex-1 gap-1.5">
                  {(r === 4 ? ["→ on"] : TOKENS_T).map((t, c) => (
                    <div
                      key={c}
                      className="flex h-9 flex-1 items-center justify-center rounded-lg border font-mono text-xs font-semibold transition-colors"
                      style={{
                        borderColor: on ? ACC : "rgb(var(--border))",
                        background: on ? "rgb(var(--accent) / 0.14)" : r === 4 ? "rgb(var(--accent-2) / 0.10)" : "rgb(var(--surface))",
                        color: on || r === 4 ? ACC : "rgb(var(--muted))",
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <p className="mt-3 min-h-[2.75rem] text-sm text-fg/90">{T_STEPS[step].cap}</p>
      <VizControls step={step} total={T_STEPS.length} playing={playing} onPrev={prev} onNext={next} onPlayToggle={toggle} onReset={reset} />
    </div>
  );
}

// ============================================================
// 4. Attention — where a token looks (interactive)
// ============================================================

const ATT_TOKENS = ["The", "cat", "sat", "because", "it", "was", "tired"];
const ATT_WEIGHTS: number[][] = (() => {
  const n = ATT_TOKENS.length;
  const m = ATT_TOKENS.map((_, q) =>
    ATT_TOKENS.map((_, k) => (k > q ? 0 : 0.12 + (k === q ? 0.5 : 0) + 0.5 / (1 + (q - k))))
  );
  m[4][1] += 1.0; // "it" → "cat"
  m[2][1] += 0.5; // "sat" → "cat"
  m[6][4] += 0.6; // "tired" → "it"
  return m.map((row) => {
    const s = row.reduce((a, b) => a + b, 0) || 1;
    return row.map((v) => v / s);
  });
})();

function AttentionViz() {
  const [q, setQ] = useState(4);
  const w = ATT_WEIGHTS[q];
  const top = w.indexOf(Math.max(...w.map((v, i) => (i === q ? -1 : v))));

  return (
    <div>
      <p className="mb-2 text-xs text-faint">
        Click a word to make it the “query” and see which words it attends to.
      </p>
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface-2/40 p-4">
        {ATT_TOKENS.map((t, i) => {
          const isQ = i === q;
          const weight = w[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => setQ(i)}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="rounded-lg border px-3 py-2 font-mono text-sm font-semibold transition-all"
                style={{
                  borderColor: isQ ? ACC : `rgb(var(--accent) / ${0.15 + weight})`,
                  background: isQ ? "rgb(var(--accent) / 0.9)" : `rgb(var(--accent) / ${weight})`,
                  color: isQ ? "#fff" : weight > 0.35 ? "#fff" : "rgb(var(--fg))",
                }}
              >
                {t}
              </span>
              <span className="h-8 w-1.5 overflow-hidden rounded-full bg-border">
                <motion.span
                  className="block w-full rounded-full"
                  style={{ background: ACC }}
                  initial={false}
                  animate={{ height: `${Math.round(weight * 100)}%` }}
                />
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-fg/90">
        <span className="font-semibold" style={{ color: ACC }}>“{ATT_TOKENS[q]}”</span>{" "}
        attends most to{" "}
        <span className="font-semibold" style={{ color: ACC }}>“{ATT_TOKENS[top]}”</span>
        {q === 4 && " — that's how the model resolves what “it” refers to."}
      </p>
    </div>
  );
}

// ============================================================
// 5. Next-token prediction — build a sentence (stepped)
// ============================================================

interface Dist { chosen: string; opts: { t: string; p: number }[] }
const NT_STEPS: Dist[] = [
  { chosen: "The", opts: [{ t: "The", p: 0.38 }, { t: "A", p: 0.22 }, { t: "My", p: 0.14 }, { t: "In", p: 0.09 }] },
  { chosen: "weather", opts: [{ t: "weather", p: 0.41 }, { t: "sky", p: 0.19 }, { t: "sun", p: 0.13 }, { t: "day", p: 0.11 }] },
  { chosen: "today", opts: [{ t: "today", p: 0.36 }, { t: "is", p: 0.28 }, { t: "was", p: 0.16 }, { t: "here", p: 0.07 }] },
  { chosen: "is", opts: [{ t: "is", p: 0.62 }, { t: "was", p: 0.18 }, { t: "looks", p: 0.09 }, { t: "seems", p: 0.06 }] },
  { chosen: "warm", opts: [{ t: "warm", p: 0.33 }, { t: "sunny", p: 0.29 }, { t: "cold", p: 0.18 }, { t: "nice", p: 0.12 }] },
  { chosen: "and", opts: [{ t: "and", p: 0.44 }, { t: "with", p: 0.2 }, { t: "but", p: 0.16 }, { t: ".", p: 0.1 }] },
];

function NextTokenViz() {
  const { step, playing, next, prev, reset, toggle } = useStepper(NT_STEPS.length, 1600);
  const d = NT_STEPS[step];
  const sentence = NT_STEPS.slice(0, step).map((s) => s.chosen).join(" ");

  return (
    <div>
      <div className="mb-3 min-h-[2.5rem] rounded-xl border border-border bg-surface-2/40 p-3 font-mono text-sm text-fg">
        {sentence}{" "}
        <span className="inline-block h-4 w-2 animate-pulse align-middle" style={{ background: ACC }} />
      </div>
      <div className="space-y-1.5">
        {d.opts.map((o, i) => {
          const isTop = i === 0;
          return (
            <div key={o.t} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-right font-mono text-xs text-muted">{o.t}</span>
              <div className="h-6 flex-1 overflow-hidden rounded-md bg-surface-2">
                <motion.div
                  className="flex h-full items-center justify-end rounded-md pr-2 font-mono text-[10px] font-bold text-white"
                  style={{ background: isTop ? ACC : "rgb(var(--accent) / 0.45)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(o.p * 100)}%` }}
                  transition={{ duration: 0.4 }}
                >
                  {Math.round(o.p * 100)}%
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-fg/90">
        The model scores every possible next token; it picks{" "}
        <span className="font-semibold" style={{ color: ACC }}>“{d.chosen}”</span>,
        appends it, and repeats — one token at a time.
      </p>
      <VizControls step={step} total={NT_STEPS.length} playing={playing} onPrev={prev} onNext={next} onPlayToggle={toggle} onReset={reset} label={`token ${step + 1} / ${NT_STEPS.length}`} />
    </div>
  );
}

// ============================================================
// 6. Sampling & temperature (interactive)
// ============================================================

const TEMP_TOKENS = [
  { t: "sunny", logit: 2.6 },
  { t: "warm", logit: 2.0 },
  { t: "cloudy", logit: 1.4 },
  { t: "cold", logit: 0.6 },
  { t: "purple", logit: -0.6 },
];

function softmax(logits: number[], temp: number): number[] {
  const T = Math.max(0.05, temp);
  const scaled = logits.map((l) => l / T);
  const max = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function SamplingTemperatureViz() {
  const [temp, setTemp] = useState(0.8);
  const [picked, setPicked] = useState<string | null>(null);
  const probs = softmax(TEMP_TOKENS.map((t) => t.logit), temp);

  const sample = () => {
    // randomness only in this click handler — safe for hydration
    let r = Math.random();
    for (let i = 0; i < probs.length; i++) {
      r -= probs[i];
      if (r <= 0) { setPicked(TEMP_TOKENS[i].t); return; }
    }
    setPicked(TEMP_TOKENS[probs.length - 1].t);
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">temperature</span>
        <input type="range" min={0.1} max={1.6} step={0.1} value={temp} onChange={(e) => setTemp(Number(e.target.value))} className="flex-1 accent-[rgb(var(--accent))]" />
        <span className="w-10 rounded-lg px-2 py-0.5 text-center font-mono text-sm font-bold" style={{ background: "rgb(var(--accent) / 0.12)", color: ACC }}>{temp.toFixed(1)}</span>
      </div>
      <div className="space-y-1.5">
        {TEMP_TOKENS.map((tok, i) => (
          <div key={tok.t} className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-right font-mono text-xs text-muted">{tok.t}</span>
            <div className="h-6 flex-1 overflow-hidden rounded-md bg-surface-2">
              <motion.div
                className="flex h-full items-center justify-end rounded-md pr-2 font-mono text-[10px] font-bold text-white"
                style={{ background: picked === tok.t ? ACC2 : ACC }}
                animate={{ width: `${Math.max(2, Math.round(probs[i] * 100))}%` }}
                transition={{ duration: 0.25 }}
              >
                {Math.round(probs[i] * 100)}%
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={sample} className="rounded-xl bg-gradient-to-br from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]">
          Sample a token
        </button>
        {picked && (
          <span className="text-sm text-muted">
            → drew <span className="font-mono font-bold" style={{ color: ACC }}>“{picked}”</span>
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-faint">
        Low temperature → the distribution sharpens toward the top token (safe,
        repetitive). High temperature → it flattens, so rarer tokens like
        “purple” can slip in (creative, riskier).
      </p>
    </div>
  );
}

// ============================================================
// 7. Context window — what the model still sees (stepped)
// ============================================================

const CTX_ALL = "You are a helpful assistant . The user asked about invoices last week and also mentioned a refund for order 4182 today".split(" ");
const CTX_WINDOW = 10;

function ContextWindowViz() {
  const total = CTX_ALL.length - 5;
  const { step, playing, next, prev, reset, toggle } = useStepper(total, 700);
  const shownCount = 6 + step; // tokens present so far
  const start = Math.max(0, shownCount - CTX_WINDOW);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-border bg-surface-2/40 p-3">
        {CTX_ALL.slice(0, shownCount).map((t, i) => {
          const inWindow = i >= start;
          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: inWindow ? 1 : 0.28, y: 0 }}
              className="rounded-md border px-2 py-1 font-mono text-xs"
              style={{
                borderColor: inWindow ? "rgb(var(--accent) / 0.5)" : "rgb(var(--border))",
                background: inWindow ? "rgb(var(--accent) / 0.1)" : "transparent",
                color: inWindow ? "rgb(var(--fg))" : "rgb(var(--faint))",
              }}
            >
              {t}
            </motion.span>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-lg px-2.5 py-1 font-mono font-bold" style={{ background: "rgb(var(--accent) / 0.12)", color: ACC }}>
          window: {Math.min(CTX_WINDOW, shownCount)} / {CTX_WINDOW}
        </span>
        <span className="text-muted">{start > 0 ? `${start} token${start > 1 ? "s" : ""} fell out of context` : "everything still fits"}</span>
      </div>
      <p className="mt-2 text-xs text-faint">
        A model can only “see” a fixed number of recent tokens. As the
        conversation grows, the oldest tokens slide out of the window — which is
        why long chats forget the beginning, and why tools that fetch fresh
        context matter.
      </p>
      <VizControls step={step} total={total} playing={playing} onPrev={prev} onNext={next} onPlayToggle={toggle} onReset={reset} label={`${shownCount} tokens`} />
    </div>
  );
}

export {
  TokenizerViz,
  EmbeddingViz,
  TransformerViz,
  AttentionViz,
  NextTokenViz as LlmNextTokenViz,
  SamplingTemperatureViz,
  ContextWindowViz,
};

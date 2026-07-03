"use client";

// Concept visualizers for the JavaScript course, attached to existing lessons.
// Themed with the course accent (rgb(var(--accent))). Stepped ones use
// useStepper; interactive ones use local state (no randomness at render).

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStepper, VizControls } from "./viz-shared";

const ACC = "rgb(var(--accent))";

// ============================================================
// 1. Array method pipeline — map / filter / reduce (stepped)
// ============================================================

interface ArrStage { code: string; arr: number[]; cap: string; kind: "start" | "map" | "filter" | "reduce" }
const ARR_STAGES: ArrStage[] = [
  { code: "const nums = [1, 2, 3, 4, 5, 6]", arr: [1, 2, 3, 4, 5, 6], cap: "Start with six numbers.", kind: "start" },
  { code: ".map(x => x * 2)", arr: [2, 4, 6, 8, 10, 12], cap: "map() transforms every element — here it doubles each one. Same length out.", kind: "map" },
  { code: ".filter(x => x > 6)", arr: [8, 10, 12], cap: "filter() keeps only the elements that pass the test (x > 6). It can shrink the array.", kind: "filter" },
  { code: ".reduce((sum, x) => sum + x, 0)", arr: [30], cap: "reduce() folds everything into a single value: 8 + 10 + 12 = 30.", kind: "reduce" },
];

export function ArrayMethodsViz() {
  const { step, playing, next, prev, reset, toggle } = useStepper(ARR_STAGES.length, 1500);
  const s = ARR_STAGES[step];

  return (
    <div>
      <div className="mb-3 overflow-hidden rounded-xl border border-border bg-[rgb(var(--code-bg))] p-3 font-mono text-[13px] leading-relaxed">
        {ARR_STAGES.map((st, i) => (
          <div key={i} className={i > step ? "opacity-30" : ""} style={{ color: i === step ? ACC : "rgb(var(--fg) / 0.85)" }}>
            {i === 0 ? st.code : "  " + st.code}
          </div>
        ))}
      </div>
      <div className="flex min-h-[3.5rem] flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface-2/40 p-3">
        <AnimatePresence mode="popLayout">
          {s.arr.map((v, i) => (
            <motion.span
              key={s.kind + "-" + i + "-" + v}
              layout
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="grid h-11 min-w-[2.75rem] place-items-center rounded-lg px-2 font-mono text-lg font-bold"
              style={{
                background: s.kind === "reduce" ? "rgb(var(--accent) / 0.9)" : "rgb(var(--accent) / 0.14)",
                color: s.kind === "reduce" ? "#fff" : ACC,
              }}
            >
              {v}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <p className="mt-3 min-h-[2.75rem] text-sm text-fg/90">{s.cap}</p>
      <VizControls step={step} total={ARR_STAGES.length} playing={playing} onPrev={prev} onNext={next} onPlayToggle={toggle} onReset={reset} />
    </div>
  );
}

// ============================================================
// 2. Closures — captured state that persists (interactive)
// ============================================================

export function ClosureViz() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const Counter = ({ label, val, onInc, onReset }: { label: string; val: number; onInc: () => void; onReset: () => void }) => (
    <div className="flex-1 rounded-2xl border border-border bg-surface p-4">
      <div className="font-mono text-xs text-muted">const {label} = makeCounter()</div>
      <div className="mt-3 flex items-center gap-3">
        <button type="button" onClick={onInc} className="rounded-xl bg-gradient-to-br from-accent to-accent-2 px-3 py-1.5 font-mono text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.04]">
          {label}()
        </button>
        <motion.span key={val} initial={{ scale: 1.4, color: ACC }} animate={{ scale: 1 }} className="font-mono text-2xl font-black text-fg">
          {val}
        </motion.span>
        <button type="button" onClick={onReset} className="ml-auto text-xs text-faint hover:text-accent">reset</button>
      </div>
      <div className="mt-3 rounded-lg border border-dashed border-accent/40 bg-accent/[0.05] p-2.5">
        <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACC }}>🎒 closure scope</div>
        <div className="mt-1 font-mono text-sm text-fg/85">count = {val}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-3 overflow-hidden rounded-xl border border-border bg-[rgb(var(--code-bg))] p-3 font-mono text-[12.5px] leading-relaxed text-fg/85">
        <div>function makeCounter() {"{"}</div>
        <div>{"  "}let count = 0;{"                 "}<span className="text-faint">// captured by the closure</span></div>
        <div>{"  "}return () =&gt; ++count;</div>
        <div>{"}"}</div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Counter label="a" val={a} onInc={() => setA((v) => v + 1)} onReset={() => setA(0)} />
        <Counter label="b" val={b} onInc={() => setB((v) => v + 1)} onReset={() => setB(0)} />
      </div>
      <p className="mt-3 text-sm text-fg/90">
        Each call to <code className="text-accent">makeCounter()</code> makes a fresh closure with its <em>own</em> private
        <code className="text-accent"> count</code>. Click the buttons — <code className="text-accent">a</code> and
        <code className="text-accent"> b</code> keep separate values that persist between calls, even though
        <code className="text-accent"> count</code> is never global.
      </p>
    </div>
  );
}

// ============================================================
// 3. The prototype chain — property lookup (interactive)
// ============================================================

const CHAIN = [
  { name: "dog", label: "dog (the object)", props: ["name", "breed"] },
  { name: "Dog.prototype", label: "Dog.prototype", props: ["bark", "speak"] },
  { name: "Object.prototype", label: "Object.prototype", props: ["toString", "hasOwnProperty"] },
  { name: "null", label: "null (end of chain)", props: [] },
];
const LOOKUPS = ["name", "bark", "toString", "fly"];

export function PrototypeChainViz() {
  const [prop, setProp] = useState("bark");
  const foundIndex = CHAIN.findIndex((lvl) => lvl.props.includes(prop));

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm text-muted">dog.</span>
        {LOOKUPS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setProp(p)}
            className="rounded-lg border px-2.5 py-1 font-mono text-xs transition-colors"
            style={{
              borderColor: prop === p ? ACC : "rgb(var(--border))",
              background: prop === p ? "rgb(var(--accent) / 0.12)" : "transparent",
              color: prop === p ? ACC : "rgb(var(--muted))",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {CHAIN.map((lvl, i) => {
          const isFound = i === foundIndex;
          const searched = foundIndex === -1 ? true : i <= foundIndex;
          return (
            <div key={lvl.name}>
              <motion.div
                animate={{ opacity: searched ? 1 : 0.4, borderColor: isFound ? ACC : "rgb(var(--border))" }}
                className="rounded-xl border bg-surface p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-fg">{lvl.label}</span>
                  {isFound && <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgb(var(--accent) / 0.15)", color: ACC }}>found “{prop}” ✓</span>}
                </div>
                {lvl.props.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {lvl.props.map((p) => (
                      <span key={p} className="rounded-md px-2 py-0.5 font-mono text-[11px]" style={{ background: p === prop && isFound ? "rgb(var(--accent) / 0.9)" : "rgb(var(--surface-2))", color: p === prop && isFound ? "#fff" : "rgb(var(--muted))" }}>{p}</span>
                    ))}
                  </div>
                )}
              </motion.div>
              {i < CHAIN.length - 1 && (
                <div className="py-0.5 pl-3 font-mono text-xs" style={{ color: searched && i < (foundIndex === -1 ? CHAIN.length : foundIndex) ? ACC : "rgb(var(--faint))" }}>
                  ↓ __proto__
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-fg/90">
        {foundIndex === -1 ? (
          <>JS walks the whole chain, finds no <code className="text-accent">{prop}</code>, hits <code className="text-accent">null</code>, and returns <code className="text-accent">undefined</code>.</>
        ) : foundIndex === 0 ? (
          <><code className="text-accent">{prop}</code> is an <strong>own property</strong> — found immediately, no walking needed.</>
        ) : (
          <>JS doesn't find <code className="text-accent">{prop}</code> on the object, so it walks up <code className="text-accent">__proto__</code> links until it finds it on <strong>{CHAIN[foundIndex].label}</strong>.</>
        )}
      </p>
    </div>
  );
}

// ============================================================
// 4. == vs === and coercion (interactive)
// ============================================================

const VALS: { label: string; val: unknown }[] = [
  { label: "0", val: 0 },
  { label: '"0"', val: "0" },
  { label: '""', val: "" },
  { label: "false", val: false },
  { label: "null", val: null },
  { label: "undefined", val: undefined },
  { label: "1", val: 1 },
  { label: '"1"', val: "1" },
  { label: '"hi"', val: "hi" },
];

function Pill({ ok }: { ok: boolean }) {
  return (
    <span className="rounded-lg px-2.5 py-1 font-mono text-sm font-bold" style={{ background: ok ? "rgba(34,197,94,0.15)" : "rgba(244,63,94,0.15)", color: ok ? "#22c55e" : "#f43f5e" }}>
      {String(ok)}
    </span>
  );
}

export function CoercionViz() {
  const [ai, setAi] = useState(0);
  const [bi, setBi] = useState(1);
  const a = VALS[ai], b = VALS[bi];
  // eslint-disable-next-line eqeqeq
  const loose = (a.val as any) == (b.val as any);
  const strict = a.val === b.val;

  const Select = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="rounded-lg border border-border bg-surface px-2.5 py-1.5 font-mono text-sm text-fg focus:border-accent/60 focus:outline-none">
      {VALS.map((v, i) => <option key={i} value={i}>{v.label}</option>)}
    </select>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-border bg-surface-2/40 p-4">
        <Select value={ai} onChange={setAi} />
        <span className="font-mono text-lg text-muted">?</span>
        <Select value={bi} onChange={setBi} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-surface p-3 text-center">
          <div className="font-mono text-sm text-muted">{a.label} == {b.label}</div>
          <div className="mt-2"><Pill ok={loose} /></div>
          <div className="mt-1 text-[11px] text-faint">loose — coerces types first</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3 text-center">
          <div className="font-mono text-sm text-muted">{a.label} === {b.label}</div>
          <div className="mt-2"><Pill ok={strict} /></div>
          <div className="mt-1 text-[11px] text-faint">strict — no coercion</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-fg/90">
        {loose !== strict ? (
          <><code className="text-accent">==</code> converts the two values to the same type before comparing, so it says <strong>true</strong> where <code className="text-accent">===</code> says <strong>false</strong>. This is exactly the trap <code className="text-accent">===</code> avoids — <strong>prefer <code className="text-accent">===</code></strong>.</>
        ) : (
          <>Here both agree. They differ only when the two values have <em>different types</em> that <code className="text-accent">==</code> would coerce (e.g. <code className="text-accent">0 == "0"</code>). Try that pairing!</>
        )}
      </p>
    </div>
  );
}

// ============================================================
// 5. Hoisting & the TDZ — var vs let (interactive)
// ============================================================

export function HoistingViz() {
  const [kw, setKw] = useState<"var" | "let">("var");
  const firstResult = kw === "var" ? "undefined" : "ReferenceError";
  const isErr = kw === "let";

  return (
    <div>
      <div className="mb-3 flex gap-2">
        {(["var", "let"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKw(k)}
            className="rounded-lg border px-3 py-1.5 font-mono text-sm transition-colors"
            style={{ borderColor: kw === k ? ACC : "rgb(var(--border))", background: kw === k ? "rgb(var(--accent) / 0.12)" : "transparent", color: kw === k ? ACC : "rgb(var(--muted))" }}
          >
            {k}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-[rgb(var(--code-bg))] p-3 font-mono text-[13px] leading-relaxed">
        <div className="flex items-center gap-3">
          <span className="text-fg/85">console.log(x);</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={firstResult}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="rounded px-2 py-0.5 text-xs font-bold"
              style={{ background: isErr ? "rgba(244,63,94,0.15)" : "rgba(234,179,8,0.15)", color: isErr ? "#f43f5e" : ACC }}
            >
              → {firstResult}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="text-fg/85">{kw} x = 5;</div>
        <div className="flex items-center gap-3">
          <span className="text-fg/85">console.log(x);</span>
          <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-500">→ 5</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-fg/90">
        {kw === "var" ? (
          <><code className="text-accent">var</code> declarations are <strong>hoisted</strong> to the top of their scope and initialized to <code className="text-accent">undefined</code> — so reading <code className="text-accent">x</code> early is legal but gives <code className="text-accent">undefined</code> (a classic bug).</>
        ) : (
          <><code className="text-accent">let</code> is hoisted too, but sits in the <strong>Temporal Dead Zone</strong> until its declaration runs — reading it early throws a <code className="text-accent">ReferenceError</code>, which catches the bug for you.</>
        )}
      </p>
    </div>
  );
}

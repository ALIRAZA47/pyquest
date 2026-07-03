"use client";

// Concept visualizers for the React course, attached to existing lessons.
// Themed with the course accent (rgb(var(--accent))).

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStepper, VizControls } from "./viz-shared";

const ACC = "rgb(var(--accent))";

// ============================================================
// 1. State & re-rendering — what actually re-renders (interactive)
// ============================================================

const TREE = [
  { id: "App", depth: 0, rerenders: false },
  { id: "Header", depth: 1, rerenders: false },
  { id: "Counter (has state)", depth: 1, rerenders: true },
  { id: "Display", depth: 2, rerenders: true },
  { id: "Button", depth: 2, rerenders: true },
];

export function StateReRenderViz() {
  const [count, setCount] = useState(0);
  const [renders, setRenders] = useState<Record<string, number>>(
    Object.fromEntries(TREE.map((n) => [n.id, 1]))
  );

  const click = () => {
    setCount((c) => c + 1);
    setRenders((r) => {
      const next = { ...r };
      for (const n of TREE) if (n.rerenders) next[n.id] = r[n.id] + 1;
      return next;
    });
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <button type="button" onClick={click} className="rounded-xl bg-gradient-to-br from-accent to-accent-2 px-4 py-2 font-mono text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]">
          setCount({count} → {count + 1})
        </button>
        <span className="text-sm text-muted">state lives in <code className="text-accent">Counter</code></span>
      </div>
      <div className="space-y-1.5">
        {TREE.map((n) => (
          <motion.div
            key={n.id + renders[n.id]}
            initial={renders[n.id] > 1 && n.rerenders ? { backgroundColor: "rgb(var(--accent) / 0.28)" } : false}
            animate={{ backgroundColor: "rgb(var(--surface))" }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
            style={{ marginLeft: n.depth * 22 }}
          >
            <span className="font-mono text-sm text-fg">{"<"}{n.id}{" />"}</span>
            <span className="font-mono text-[11px]" style={{ color: n.rerenders ? ACC : "rgb(var(--faint))" }}>
              rendered ×{renders[n.id]}
            </span>
          </motion.div>
        ))}
      </div>
      <p className="mt-3 text-sm text-fg/90">
        Calling <code className="text-accent">setCount</code> re-renders the component that owns the state
        (<code className="text-accent">Counter</code>) <strong>and everything inside it</strong> — but not
        <code className="text-accent"> App</code> or <code className="text-accent">Header</code>. Watch the render counts:
        only the highlighted subtree goes up.
      </p>
    </div>
  );
}

// ============================================================
// 2. Keys & reconciliation — why keys matter (interactive)
// ============================================================

const COLORS = ["#f43f5e", "#f59e0b", "#22c55e", "#38bdf8", "#a855f7", "#ec4899"];

export function KeysReconciliationViz() {
  const [items, setItems] = useState([
    { id: 1, label: "Buy milk" },
    { id: 2, label: "Walk dog" },
    { id: 3, label: "Write code" },
  ]);
  const [nextId, setNextId] = useState(4);
  const [byIndex, setByIndex] = useState(false);
  const [flash, setFlash] = useState(0);

  const addTop = () => {
    setItems((it) => [{ id: nextId, label: `Task ${nextId}` }, ...it].slice(0, 6));
    setNextId((n) => n + 1);
    setFlash((f) => f + 1); // index-key mode flashes everything
  };
  const resetAll = () => {
    setItems([{ id: 1, label: "Buy milk" }, { id: 2, label: "Walk dog" }, { id: 3, label: "Write code" }]);
    setNextId(4);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={addTop} className="rounded-xl bg-gradient-to-br from-accent to-accent-2 px-3 py-1.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]">
          + Add to top
        </button>
        <div className="flex overflow-hidden rounded-lg border border-border">
          {([["id", "key = item.id"], ["index", "key = index"]] as const).map(([k, lbl]) => {
            const on = (k === "index") === byIndex;
            return (
              <button key={k} type="button" onClick={() => setByIndex(k === "index")} className="px-2.5 py-1.5 font-mono text-xs transition-colors" style={{ background: on ? "rgb(var(--accent) / 0.14)" : "transparent", color: on ? ACC : "rgb(var(--muted))" }}>
                {lbl}
              </button>
            );
          })}
        </div>
        <button type="button" onClick={resetAll} className="ml-auto text-xs text-faint hover:text-accent">reset</button>
      </div>

      <div className="space-y-1.5">
        <AnimatePresence initial={false}>
          {items.map((it, i) => (
            <motion.div
              // stable identity key vs positional key changes how it animates
              key={byIndex ? `idx-${i}-${flash}` : `id-${it.id}`}
              layout={!byIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2"
            >
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: COLORS[(byIndex ? i : it.id - 1) % COLORS.length] }} />
              <span className="font-mono text-sm text-fg">{it.label}</span>
              <span className="ml-auto font-mono text-[11px] text-faint">key={byIndex ? i : it.id}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="mt-3 text-sm text-fg/90">
        {byIndex ? (
          <>With <code className="text-accent">key=index</code>, adding to the top shifts every key by one — React thinks <em>every</em> row changed and rebuilds them (notice the identity dots reshuffle). That loses input focus, state, and animations.</>
        ) : (
          <>With a stable <code className="text-accent">key=item.id</code>, React matches each row to its previous DOM node, so existing items just slide down and only the new one is created. Identity (the colored dot) stays put.</>
        )}
      </p>
    </div>
  );
}

// ============================================================
// 3. The useEffect lifecycle (stepped)
// ============================================================

const EFFECT_STEPS = [
  { tag: "mount", cap: "The component mounts and renders for the first time.", run: false, clean: false },
  { tag: "effect", cap: "After paint, the effect runs — e.g. subscribe, start a timer, or fetch data.", run: true, clean: false },
  { tag: "dep change", cap: "A value in the dependency array changes, so React re-runs the effect — but first it runs the previous CLEANUP.", run: false, clean: true },
  { tag: "effect again", cap: "Then the effect body runs again with the new values.", run: true, clean: false },
  { tag: "unmount", cap: "When the component unmounts, the cleanup runs one final time — no leaks.", run: false, clean: true },
];

export function EffectLifecycleViz() {
  const { step, playing, next, prev, reset, toggle } = useStepper(EFFECT_STEPS.length, 1600);
  const s = EFFECT_STEPS[step];

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border bg-[rgb(var(--code-bg))] p-3 font-mono text-[12.5px] leading-relaxed text-fg/85">
        <div>useEffect(() =&gt; {"{"}</div>
        <motion.div animate={{ color: s.run ? ACC : "rgb(var(--fg) / 0.85)", fontWeight: s.run ? 700 : 400 }} className="pl-4">
          const id = setInterval(tick, 1000);{s.run && "  ← runs now"}
        </motion.div>
        <div className="pl-4">return () =&gt; {"{"}</div>
        <motion.div animate={{ color: s.clean ? "#f43f5e" : "rgb(var(--fg) / 0.85)", fontWeight: s.clean ? 700 : 400 }} className="pl-8">
          clearInterval(id);{s.clean && "  ← cleanup runs now"}
        </motion.div>
        <div className="pl-4">{"}"};</div>
        <div>{"}"}, [dep]);</div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {EFFECT_STEPS.map((st, i) => (
          <span
            key={st.tag}
            className="rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors"
            style={{
              borderColor: i === step ? ACC : "rgb(var(--border))",
              background: i === step ? "rgb(var(--accent) / 0.12)" : "transparent",
              color: i === step ? ACC : i < step ? "rgb(var(--muted))" : "rgb(var(--faint))",
            }}
          >
            {st.tag}
          </span>
        ))}
      </div>

      <p className="mt-3 min-h-[2.75rem] text-sm text-fg/90">{s.cap}</p>
      <VizControls step={step} total={EFFECT_STEPS.length} playing={playing} onPrev={prev} onNext={next} onPlayToggle={toggle} onReset={reset} />
    </div>
  );
}

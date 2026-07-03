"use client";

// The marquee interactive visualizer: the JavaScript / Node.js event loop.
// Learners BUILD a small program from blocks, hit Run, and watch execution
// flow through the call stack, microtask & macrotask queues (and, in Node
// mode, process.nextTick and the check phase) with the console filling in the
// exact real-world order. Fully playable — add / clear / preset, then step or
// auto-play.

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStepper, VizControls } from "./viz-shared";

const ACC = "rgb(var(--accent))";

type Kind = "sync" | "timeout" | "promise" | "nexttick" | "immediate";
interface Op { kind: Kind; out: string }
type Mode = "browser" | "node";

const LINE: Record<Kind, (o: string) => string> = {
  sync: (o) => `console.log("${o}")`,
  timeout: (o) => `setTimeout(() => console.log("${o}"), 0)`,
  promise: (o) => `Promise.resolve().then(() => console.log("${o}"))`,
  nexttick: (o) => `process.nextTick(() => console.log("${o}"))`,
  immediate: (o) => `setImmediate(() => console.log("${o}"))`,
};

interface Snap {
  stack: string[];
  nextTick: string[];
  micro: string[];
  timers: string[];
  check: string[];
  out: string[];
  caption: string;
  phase: string;
  active?: "stack" | "nextTick" | "micro" | "timers" | "check";
}

function simulate(program: Op[], mode: Mode): Snap[] {
  const snaps: Snap[] = [];
  const stack: string[] = [];
  let nextTick: string[] = [];
  let micro: string[] = [];
  let timers: string[] = [];
  let check: string[] = [];
  const out: string[] = [];
  const snap = (caption: string, phase: string, active?: Snap["active"]) =>
    snaps.push({
      stack: [...stack], nextTick: [...nextTick], micro: [...micro],
      timers: [...timers], check: [...check], out: [...out], caption, phase, active,
    });

  snap("The script runs top to bottom on the call stack.", "run script");
  for (const op of program) {
    if (op.kind === "sync") {
      stack.push(`console.log("${op.out}")`);
      snap(`console.log("${op.out}") runs immediately.`, "run script", "stack");
      out.push(op.out);
      stack.pop();
      snap(`Logged "${op.out}"; the frame pops off.`, "run script", "stack");
    } else if (op.kind === "timeout") {
      stack.push("setTimeout(…)");
      snap("setTimeout registers a callback — it does NOT run now.", "run script", "stack");
      stack.pop();
      timers.push(op.out);
      snap(`Its callback ("${op.out}") waits in the Timers queue.`, "run script", "timers");
    } else if (op.kind === "promise") {
      stack.push("Promise.then(…)");
      snap("The .then callback is scheduled as a microtask.", "run script", "stack");
      stack.pop();
      micro.push(op.out);
      snap(`Microtask "${op.out}" queued.`, "run script", "micro");
    } else if (op.kind === "nexttick") {
      stack.push("process.nextTick(…)");
      snap("process.nextTick schedules a next-tick callback.", "run script", "stack");
      stack.pop();
      nextTick.push(op.out);
      snap(`"${op.out}" queued in nextTick (runs before promises).`, "run script", "nextTick");
    } else if (op.kind === "immediate") {
      stack.push("setImmediate(…)");
      snap("setImmediate schedules a Check-phase callback.", "run script", "stack");
      stack.pop();
      check.push(op.out);
      snap(`"${op.out}" queued in the Check phase.`, "run script", "check");
    }
  }
  snap("Script done — the call stack is empty. The event loop takes over.", "event loop");

  const drainMicro = () => {
    if (mode === "node") {
      while (nextTick.length) {
        const t = nextTick.shift()!;
        stack.push("nextTick cb");
        snap(`Run nextTick callback → logs "${t}".`, "microtasks", "nextTick");
        out.push(t);
        stack.pop();
        snap(`Logged "${t}".`, "microtasks", "stack");
      }
    }
    while (micro.length) {
      const t = micro.shift()!;
      stack.push("microtask");
      snap(`Run microtask → logs "${t}".`, "microtasks", "micro");
      out.push(t);
      stack.pop();
      snap(`Logged "${t}".`, "microtasks", "stack");
    }
  };

  if (micro.length || nextTick.length) {
    snap("Before ANY timer, the loop empties all microtasks.", "microtasks");
    drainMicro();
  }
  while (timers.length) {
    const t = timers.shift()!;
    stack.push("timer cb");
    snap(`Timers phase: run the setTimeout callback → "${t}".`, "timers", "timers");
    out.push(t);
    stack.pop();
    snap(`Logged "${t}".`, "timers", "stack");
    if (micro.length || nextTick.length) {
      snap("After each macrotask, microtasks drain again.", "microtasks");
      drainMicro();
    }
  }
  if (mode === "node") {
    while (check.length) {
      const t = check.shift()!;
      stack.push("immediate cb");
      snap(`Check phase: run the setImmediate callback → "${t}".`, "check", "check");
      out.push(t);
      stack.pop();
      snap(`Logged "${t}".`, "check", "stack");
      if (micro.length || nextTick.length) drainMicro();
    }
  }
  snap("Every queue is empty — the program is finished. 🎉", "done");
  return snaps;
}

const PRESET: Record<Mode, Op[]> = {
  browser: [
    { kind: "sync", out: "start" },
    { kind: "timeout", out: "timeout" },
    { kind: "promise", out: "promise" },
    { kind: "sync", out: "end" },
  ],
  node: [
    { kind: "sync", out: "start" },
    { kind: "timeout", out: "timeout" },
    { kind: "immediate", out: "immediate" },
    { kind: "promise", out: "promise" },
    { kind: "nexttick", out: "nextTick" },
    { kind: "sync", out: "end" },
  ],
};

const ADDABLE: Record<Mode, { kind: Kind; label: string }[]> = {
  browser: [
    { kind: "sync", label: "console.log" },
    { kind: "timeout", label: "setTimeout" },
    { kind: "promise", label: "Promise.then" },
  ],
  node: [
    { kind: "sync", label: "console.log" },
    { kind: "timeout", label: "setTimeout" },
    { kind: "promise", label: "Promise.then" },
    { kind: "nexttick", label: "process.nextTick" },
    { kind: "immediate", label: "setImmediate" },
  ],
};

function Queue({
  label,
  items,
  active,
  tone,
}: {
  label: string;
  items: string[];
  active: boolean;
  tone?: string;
}) {
  const color = tone ?? ACC;
  return (
    <div
      className="rounded-xl border p-2.5 transition-colors"
      style={{
        borderColor: active ? color : "rgb(var(--border))",
        background: active ? "color-mix(in srgb, " + color + " 8%, transparent)" : "transparent",
      }}
    >
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: active ? color : "rgb(var(--faint))" }}>
        {label}
      </div>
      <div className="flex min-h-[2rem] flex-wrap gap-1">
        <AnimatePresence>
          {items.length === 0 && <span className="text-xs text-faint">empty</span>}
          {items.map((it, i) => (
            <motion.span
              key={it + i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="rounded-md px-2 py-1 font-mono text-[11px] font-semibold"
              style={{ background: "color-mix(in srgb, " + color + " 16%, transparent)", color }}
            >
              {it}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EventLoopViz({ mode }: { mode: Mode }) {
  const [program, setProgram] = useState<Op[]>(PRESET[mode]);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    return program.map((op) => {
      c[op.kind] = (c[op.kind] || 0) + 1;
      return c[op.kind];
    });
  }, [program]);

  const snaps = useMemo(() => simulate(program, mode), [program, mode]);
  const { step, setStep, playing, next, prev, reset, toggle } = useStepper(snaps.length, 850);
  useEffect(() => {
    setStep(0);
  }, [program, mode, setStep]);

  const s = snaps[Math.min(step, snaps.length - 1)];

  const add = (kind: Kind) => {
    if (program.length >= 8) return;
    const n = program.filter((o) => o.kind === kind).length + 1;
    const base: Record<Kind, string> = {
      sync: "log", timeout: "timeout", promise: "promise", nexttick: "nextTick", immediate: "immediate",
    };
    setProgram((p) => [...p, { kind, out: base[kind] + (kind === "sync" || n > 1 ? n : "") }]);
  };

  return (
    <div>
      {/* Program builder */}
      <div className="overflow-hidden rounded-2xl border border-border bg-[rgb(var(--code-bg))]">
        <div className="flex items-center gap-2 border-b border-border/70 bg-surface-2/60 px-3 py-2">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="font-mono text-[11px] text-faint">program.js · {mode}</span>
        </div>
        <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-fg/90">
          {program.length === 0 ? (
            <span className="text-faint">// add statements below…</span>
          ) : (
            program.map((op, i) => (
              <div key={i}>
                <span className="mr-3 select-none text-faint/60">{i + 1}</span>
                {LINE[op.kind](op.out)}
              </div>
            ))
          )}
        </pre>
      </div>

      {/* Builder controls */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {ADDABLE[mode].map((a) => (
          <button
            key={a.kind}
            type="button"
            onClick={() => add(a.kind)}
            className="rounded-lg border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
          >
            + {a.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setProgram(PRESET[mode])}
          className="ml-auto rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:text-accent"
        >
          Preset
        </button>
        <button
          type="button"
          onClick={() => setProgram([])}
          className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:text-accent"
        >
          Clear
        </button>
      </div>

      {/* Runtime panels */}
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1.2fr_1fr]">
        {/* Call stack */}
        <div
          className="rounded-xl border p-2.5 transition-colors"
          style={{ borderColor: s.active === "stack" ? ACC : "rgb(var(--border))" }}
        >
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: s.active === "stack" ? ACC : "rgb(var(--faint))" }}>
            Call Stack
          </div>
          <div className="flex min-h-[6rem] flex-col-reverse gap-1">
            <AnimatePresence>
              {s.stack.length === 0 && <span className="text-xs text-faint">empty</span>}
              {s.stack.map((f, i) => (
                <motion.div
                  key={f + i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="rounded-md px-2 py-1 font-mono text-[11px] font-semibold"
                  style={{ background: "rgb(var(--accent) / 0.14)", color: ACC }}
                >
                  {f}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Queues */}
        <div className="space-y-2">
          {mode === "node" && <Queue label="nextTick queue" items={s.nextTick} active={s.active === "nextTick"} tone="#f59e0b" />}
          <Queue label="Microtask queue (Promises)" items={s.micro} active={s.active === "micro"} tone="#22d3ee" />
          <Queue label={mode === "node" ? "Timers phase (setTimeout)" : "Task queue (setTimeout)"} items={s.timers} active={s.active === "timers"} tone="#2dd4bf" />
          {mode === "node" && <Queue label="Check phase (setImmediate)" items={s.check} active={s.active === "check"} tone="#a78bfa" />}
        </div>

        {/* Console */}
        <div className="rounded-xl border border-border p-2.5">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-faint">Console</div>
          <div className="flex min-h-[6rem] flex-col gap-1 font-mono text-[12px]">
            <AnimatePresence>
              {s.out.length === 0 && <span className="text-xs text-faint">—</span>}
              {s.out.map((o, i) => (
                <motion.div
                  key={o + i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-fg/85"
                >
                  <span className="mr-2 select-none text-faint/50">{i + 1}</span>
                  {o}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Phase + caption */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
          style={{ background: "rgb(var(--accent) / 0.12)", color: ACC }}
        >
          {s.phase}
        </span>
      </div>
      <p className="mt-2 min-h-[2.5rem] text-sm text-fg/90">{s.caption}</p>

      <VizControls
        step={step}
        total={snaps.length}
        playing={playing}
        onPrev={prev}
        onNext={next}
        onPlayToggle={toggle}
        onReset={reset}
        label={`step ${step + 1} / ${snaps.length}`}
      />
      <p className="mt-2 text-xs text-faint">
        Build your own program with the buttons above, then press <span className="font-semibold" style={{ color: ACC }}>Play</span> to
        watch the exact order things run.
      </p>
    </div>
  );
}

export function EventLoopBrowserViz() {
  return <EventLoopViz mode="browser" />;
}
export function EventLoopNodeViz() {
  return <EventLoopViz mode="node" />;
}

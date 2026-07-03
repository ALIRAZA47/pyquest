"use client";

// Animated visualizers for the Model Context Protocol course. Each is
// stepper-driven and themed with the course accent (rgb(var(--accent))).

import { motion, AnimatePresence } from "framer-motion";
import { useStepper, VizControls } from "./viz-shared";

const ACC = "rgb(var(--accent))";
const ACC2 = "rgb(var(--accent-2))";
const TANGLE = "#f43f5e"; // rose — the "chaos" color

// ============================================================
// 1. The N×M integration problem  →  the MCP hub
// ============================================================

const NXM_STEPS = [
  { tools: 4, hub: false, count: (a: number, t: number) => a * t, badge: "custom integrations", cap: "Before MCP: every agent needs bespoke glue code for every tool it wants to use." },
  { tools: 5, hub: false, count: (a: number, t: number) => a * t, badge: "and growing…", cap: "Add one new tool and you must wire it into every agent separately. Integrations explode as M × N." },
  { tools: 5, hub: true, count: (a: number, t: number) => a + t, badge: "connectors", cap: "With MCP, each side implements one open protocol. Every agent talks to every tool through the same connector." },
  { tools: 6, hub: true, count: (a: number, t: number) => a + t, badge: "connectors", cap: "Now add a tool: build the MCP server once and every agent can use it instantly. Growth is just M + N." },
];

function NxMViz() {
  const { step, setStep, playing, next, prev, reset, toggle } = useStepper(
    NXM_STEPS.length,
    1600
  );
  const s = NXM_STEPS[step];
  const agentsY = [46, 100, 154];
  const toolY = (i: number, n: number) => 26 + (i * 148) / (n - 1);
  const AX = 46;
  const TX = 274;
  const HX = 160;
  const HY = 100;
  const count = s.count(agentsY.length, s.tools);

  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  if (!s.hub) {
    agentsY.forEach((ay) => {
      for (let t = 0; t < s.tools; t++)
        lines.push({ x1: AX, y1: ay, x2: TX, y2: toolY(t, s.tools) });
    });
  } else {
    agentsY.forEach((ay) => lines.push({ x1: AX, y1: ay, x2: HX, y2: HY }));
    for (let t = 0; t < s.tools; t++)
      lines.push({ x1: HX, y1: HY, x2: TX, y2: toolY(t, s.tools) });
  }

  return (
    <div>
      <svg viewBox="0 0 320 200" className="w-full">
        <g key={step}>
          {lines.map((l, i) => (
            <motion.line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={s.hub ? ACC : TANGLE}
              strokeWidth={1.4}
              opacity={s.hub ? 0.7 : 0.4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
            />
          ))}
        </g>

        {s.hub && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <rect x={HX - 22} y={HY - 16} width="44" height="32" rx="9" fill="rgb(var(--surface))" stroke={ACC} strokeWidth="2" />
            <text x={HX} y={HY + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={ACC}>
              MCP
            </text>
          </motion.g>
        )}

        {agentsY.map((ay, i) => (
          <g key={`a${i}`}>
            <circle cx={AX} cy={ay} r="13" fill="rgb(var(--surface-2))" stroke={s.hub ? ACC : TANGLE} strokeWidth="1.8" />
            <text x={AX} y={ay + 4} textAnchor="middle" fontSize="11" fill="rgb(var(--muted))">🤖</text>
          </g>
        ))}
        {Array.from({ length: s.tools }).map((_, t) => (
          <motion.g key={`t${t}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect x={TX - 12} y={toolY(t, s.tools) - 12} width="24" height="24" rx="6" fill="rgb(var(--surface-2))" stroke={s.hub ? ACC2 : TANGLE} strokeWidth="1.8" />
          </motion.g>
        ))}

        <text x={AX} y={186} textAnchor="middle" fontSize="10" fill="rgb(var(--faint))">agents</text>
        <text x={TX} y={186} textAnchor="middle" fontSize="10" fill="rgb(var(--faint))">tools</text>
      </svg>

      <div className="mt-2 flex items-center gap-3">
        <span
          className="rounded-lg px-3 py-1.5 font-mono text-lg font-black"
          style={{ background: s.hub ? "rgb(var(--accent) / 0.12)" : "rgba(244,63,94,0.12)", color: s.hub ? ACC : TANGLE }}
        >
          {count}
        </span>
        <span className="text-sm font-semibold" style={{ color: s.hub ? ACC : TANGLE }}>
          {s.badge}
        </span>
      </div>
      <p className="mt-2 min-h-[2.75rem] text-sm text-fg/90">{s.cap}</p>
      <VizControls
        step={step}
        total={NXM_STEPS.length}
        playing={playing}
        onPrev={prev}
        onNext={next}
        onPlayToggle={toggle}
        onReset={reset}
        label={`${step < 2 ? "Before MCP" : "With MCP"} · ${step + 1}/${NXM_STEPS.length}`}
      />
    </div>
  );
}

// ============================================================
// 2. The four-layer chain, with a message flowing through
// ============================================================

const LAYERS = [
  { name: "Host", sub: "Claude · IDE · agent", color: "#a78bfa" },
  { name: "MCP Client", sub: "speaks JSON-RPC", color: "#818cf8" },
  { name: "MCP Server", sub: "your connector", color: "#22d3ee" },
  { name: "Data", sub: "DB · API · files", color: "#2dd4bf" },
];
const ARCH_STEPS = [
  { active: 0, cap: "You ask the Host a question in plain language." },
  { active: 1, cap: "The Host hands the request to its MCP client." },
  { active: 2, cap: "The client sends a JSON-RPC call to your MCP server." },
  { active: 3, cap: "The server does the real work against the data or API." },
  { active: 2, cap: "Results travel back through the server…" },
  { active: 0, cap: "…and the Host turns them into your answer." },
];

function McpArchitectureViz() {
  const { step, setStep, playing, next, prev, reset, toggle } = useStepper(
    ARCH_STEPS.length,
    1300
  );
  const centers = [52, 138, 224, 310];
  const active = ARCH_STEPS[step].active;

  return (
    <div>
      <svg viewBox="0 0 360 150" className="w-full">
        {/* connecting rail */}
        <line x1="52" y1="60" x2="310" y2="60" stroke="rgb(var(--border))" strokeWidth="2" />

        {LAYERS.map((l, i) => (
          <g key={l.name}>
            <motion.rect
              x={centers[i] - 40}
              y={38}
              width="80"
              height="44"
              rx="10"
              fill="rgb(var(--surface))"
              stroke={l.color}
              animate={{
                strokeWidth: active === i ? 2.6 : 1.2,
                opacity: active === i ? 1 : 0.5,
              }}
            />
            <text x={centers[i]} y={58} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="rgb(var(--fg))">
              {l.name}
            </text>
            <text x={centers[i]} y={72} textAnchor="middle" fontSize="7.5" fill="rgb(var(--faint))">
              {l.sub}
            </text>
          </g>
        ))}

        {/* travelling message packet */}
        <motion.circle
          r="7"
          cy={60}
          fill={ACC}
          animate={{ cx: centers[active] }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
      </svg>

      <p className="mt-2 min-h-[2.5rem] text-sm text-fg/90">
        <span className="font-semibold" style={{ color: LAYERS[active].color }}>
          {LAYERS[active].name}:
        </span>{" "}
        {ARCH_STEPS[step].cap}
      </p>
      <VizControls
        step={step}
        total={ARCH_STEPS.length}
        playing={playing}
        onPrev={prev}
        onNext={next}
        onPlayToggle={toggle}
        onReset={reset}
        label={step < 4 ? "request ➜" : "⬅ response"}
      />
    </div>
  );
}

// ============================================================
// 3. The JSON-RPC wire protocol handshake
// ============================================================

const WIRE = [
  { dir: "→", label: "tools/list", sub: "What tools do you have?", from: "client" },
  { dir: "←", label: "tools: [ query_sales ]", sub: "Here's my tool + JSON schema", from: "server" },
  { dir: "→", label: "tools/call", sub: 'query_sales({ metric: "revenue", limit: 3 })', from: "client" },
  { dir: "←", label: "result", sub: "content: [{ customer, total }, …]", from: "server" },
];

function WireProtocolViz() {
  const { step, setStep, playing, next, prev, reset, toggle } = useStepper(
    WIRE.length,
    1400
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-1 text-xs font-bold uppercase tracking-wider">
        <span style={{ color: ACC }}>MCP Client</span>
        <span className="text-faint">JSON-RPC 2.0</span>
        <span style={{ color: ACC2 }}>MCP Server</span>
      </div>
      <div className="space-y-2.5 rounded-2xl border border-border bg-surface-2/40 p-3">
        {WIRE.map((m, i) => {
          const shown = i <= step;
          const fromClient = m.from === "client";
          return (
            <AnimatePresence key={i}>
              {shown && (
                <motion.div
                  initial={{ opacity: 0, x: fromClient ? -40 : 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 22 }}
                  className={`flex ${fromClient ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl border px-3 py-2 ${
                      i === step ? "shadow-glow" : ""
                    }`}
                    style={{
                      borderColor: fromClient ? "rgb(var(--accent) / 0.5)" : "rgb(var(--accent-2) / 0.5)",
                      background: fromClient ? "rgb(var(--accent) / 0.08)" : "rgb(var(--accent-2) / 0.08)",
                    }}
                  >
                    <div className="flex items-center gap-2 font-mono text-[13px] font-bold text-fg">
                      <span style={{ color: fromClient ? ACC : ACC2 }}>
                        {fromClient ? "▶" : "◀"}
                      </span>
                      {m.label}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-muted">{m.sub}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>
      <VizControls
        step={step}
        total={WIRE.length}
        playing={playing}
        onPrev={prev}
        onNext={next}
        onPlayToggle={toggle}
        onReset={reset}
        label={`message ${step + 1} / ${WIRE.length}`}
      />
    </div>
  );
}

// ============================================================
// 4. Anatomy of a tool call — the full round-trip
// ============================================================

type Stage = {
  actor: string;
  tone: "you" | "agent" | "server";
  title: string;
  body?: string;
  code?: string;
  rows?: [string, string][];
};

const STAGES: Stage[] = [
  { actor: "You", tone: "you", title: "The question", body: "“Who are our top 3 customers by total spend?”" },
  { actor: "Agent", tone: "agent", title: "Reasoning", body: "The user wants ranked customer revenue. I'll call the query_sales tool and let the server run the SQL." },
  { actor: "Agent → Server", tone: "agent", title: "JSON-RPC tools/call", code: '{ "method": "tools/call",\n  "params": { "name": "query_sales",\n    "arguments": { "metric": "revenue",\n      "groupBy": "customer", "limit": 3 } } }' },
  { actor: "MCP Server", tone: "server", title: "Runs real SQL (read-only)", code: "SELECT c.name AS customer, SUM(o.amount) AS total\nFROM orders o JOIN customers c ON c.id = o.customer_id\nGROUP BY c.name ORDER BY total DESC LIMIT 3;" },
  { actor: "MCP Server → Agent", tone: "server", title: "Rows come back", rows: [["Northwind Traders", "$48,210"], ["Globex Corp", "$39,560"], ["Initech", "$27,840"]] },
  { actor: "Agent", tone: "agent", title: "Friendly answer", body: "Your top 3 customers are Northwind Traders ($48,210), Globex Corp ($39,560), and Initech ($27,840)." },
];

const TONE: Record<Stage["tone"], string> = {
  you: "rgb(var(--muted))",
  agent: "rgb(var(--accent))",
  server: "#14b8a6",
};

function ToolCallViz() {
  const { step, setStep, playing, next, prev, reset, toggle } = useStepper(
    STAGES.length,
    1600
  );

  return (
    <div>
      <div className="space-y-2">
        {STAGES.map((st, i) => {
          if (i > step) return null;
          const color = TONE[st.tone];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className={`rounded-xl border bg-surface p-3 ${i === step ? "shadow-glow" : ""}`}
              style={{ borderColor: `color-mix(in srgb, ${color} 45%, transparent)` }}
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
                >
                  {st.actor}
                </span>
                <span className="text-sm font-semibold text-fg">{st.title}</span>
              </div>
              {st.body && <p className="text-sm text-fg/85">{st.body}</p>}
              {st.code && (
                <pre className="overflow-x-auto rounded-lg bg-[rgb(var(--code-bg))] p-2.5 font-mono text-[11.5px] leading-relaxed text-fg/85">
                  {st.code}
                </pre>
              )}
              {st.rows && (
                <div className="overflow-hidden rounded-lg border border-border font-mono text-[12px]">
                  {st.rows.map((r, ri) => (
                    <div key={ri} className={`flex justify-between px-3 py-1.5 ${ri % 2 ? "bg-surface-2/50" : ""}`}>
                      <span className="text-fg/85">{r[0]}</span>
                      <span className="font-bold" style={{ color: TONE.server }}>{r[1]}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      <p className="mt-3 flex items-start gap-1.5 text-xs text-faint">
        <span style={{ color: TONE.server }}>●</span>
        The agent never touches the database — it speaks MCP to your server, which is the safety boundary.
      </p>
      <VizControls
        step={step}
        total={STAGES.length}
        playing={playing}
        onPrev={prev}
        onNext={next}
        onPlayToggle={toggle}
        onReset={reset}
        label={`step ${step + 1} / ${STAGES.length}`}
      />
    </div>
  );
}

// ============================================================
// 5. The three primitives — Tools, Resources, Prompts
// ============================================================

const ACTORS = ["Model", "App", "User"];
const PRIMS = [
  { name: "Tools", who: "Model", analogy: "like POST endpoints", example: "query_sales · send_slack_message", desc: "Actions the model can invoke — it decides when to call them." },
  { name: "Resources", who: "App", analogy: "like GET endpoints", example: "schema://shop · file:///report.pdf", desc: "Read-only context the app pulls in for the model to reason over." },
  { name: "Prompts", who: "User", analogy: "like slash-commands", example: "/summarize-sales · /review-pr", desc: "Reusable templates the user triggers to start a rich interaction." },
];

function PrimitivesViz() {
  const { step, setStep, playing, next, prev, reset, toggle } = useStepper(
    PRIMS.length,
    2200
  );
  const p = PRIMS[step];

  return (
    <div>
      <div className="mb-3 flex items-center justify-center gap-2">
        {ACTORS.map((a) => {
          const on = a === p.who;
          return (
            <div
              key={a}
              className="rounded-full border px-3 py-1.5 text-xs font-bold transition-all"
              style={{
                borderColor: on ? ACC : "rgb(var(--border))",
                background: on ? "rgb(var(--accent) / 0.12)" : "transparent",
                color: on ? ACC : "rgb(var(--faint))",
              }}
            >
              {a}-controlled
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28 }}
          className="rounded-2xl border p-5"
          style={{ borderColor: "rgb(var(--accent) / 0.35)", background: "rgb(var(--accent) / 0.05)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black" style={{ color: ACC }}>
              {p.name}
            </span>
            <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-medium text-muted">
              {p.analogy}
            </span>
          </div>
          <p className="mt-2 text-sm text-fg/90">{p.desc}</p>
          <code className="mt-3 block rounded-lg bg-[rgb(var(--code-bg))] px-3 py-2 font-mono text-xs" style={{ color: ACC2 }}>
            {p.example}
          </code>
        </motion.div>
      </AnimatePresence>

      <VizControls
        step={step}
        total={PRIMS.length}
        playing={playing}
        onPrev={prev}
        onNext={next}
        onPlayToggle={toggle}
        onReset={reset}
        label={`${p.name} · ${step + 1}/${PRIMS.length}`}
      />
    </div>
  );
}

export {
  NxMViz,
  McpArchitectureViz,
  WireProtocolViz,
  ToolCallViz,
  PrimitivesViz,
};

"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { runPython, isPyodideReady } from "@/lib/pyodide";
import { PlayIcon, CheckIcon } from "./Icons";

interface PyRunnerProps {
  initialCode: string;
  caption?: string;
  minRows?: number;
  onFirstRun?: () => void;
}

type Status = "idle" | "loading" | "running" | "done" | "error";

export function PyRunner({
  initialCode,
  caption = "your code",
  minRows,
  onFirstRun,
}: PyRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState<Status>("idle");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const ranOnce = useRef(false);
  const rows = Math.max(minRows ?? 3, code.split("\n").length);

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = code.slice(0, start) + "    " + code.slice(end);
      setCode(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 4;
      });
    }
  };

  const run = async () => {
    setStatus(isPyodideReady() ? "running" : "loading");
    setError(null);
    try {
      const res = await runPython(code);
      setOutput(res.output);
      setError(res.error ?? null);
      setStatus(res.error ? "error" : "done");
      if (!ranOnce.current) {
        ranOnce.current = true;
        onFirstRun?.();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  };

  const reset = () => {
    setCode(initialCode);
    setOutput("");
    setError(null);
    setStatus("idle");
  };

  const busy = status === "loading" || status === "running";

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-border bg-[rgb(var(--code-bg))] shadow-soft">
      <div className="flex items-center gap-2 border-b border-border/70 bg-surface-2/60 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1 font-mono text-xs font-medium text-faint">
          {caption} · editable
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {code !== initialCode && (
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:text-accent"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={run}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-accent to-accent-2 px-3 py-1 text-xs font-semibold text-white shadow-glow transition-transform enabled:hover:scale-[1.04] disabled:opacity-60"
          >
            {busy ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <PlayIcon className="h-3 w-3" />
            )}
            {status === "loading" ? "Loading…" : busy ? "Running…" : "Run"}
          </button>
        </div>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleTab}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        rows={rows}
        className="block w-full resize-none bg-transparent px-4 py-4 font-mono text-[13.5px] leading-[1.7] text-fg outline-none"
        style={{ tabSize: 4 }}
      />

      <AnimatePresence initial={false}>
        {(status === "done" || status === "error" || busy) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border/70 bg-surface-2/40"
          >
            <div className="px-4 py-3">
              <div className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-faint">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    status === "error" ? "bg-rose-500" : "bg-green-500"
                  }`}
                />
                {status === "loading"
                  ? "Loading Python (first run only)…"
                  : status === "running"
                  ? "Running…"
                  : status === "error"
                  ? "Error"
                  : "Output"}
              </div>
              {status === "loading" && (
                <p className="text-sm text-muted">
                  Downloading the Python runtime — this happens once, then runs
                  instantly.
                </p>
              )}
              {(status === "done" || status === "error") && (
                <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[13px] leading-relaxed">
                  {output && <span className="text-fg/85">{output}</span>}
                  {error && <span className="text-rose-400">{error}</span>}
                  {!output && !error && (
                    <span className="text-faint">
                      (ran with no output — try adding a print)
                    </span>
                  )}
                </pre>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

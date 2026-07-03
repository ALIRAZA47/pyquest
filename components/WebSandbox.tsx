"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type WebRunMode,
  buildPreviewDoc,
  hasConsole,
  hasPreview,
  isCompilerReady,
  needsCompiler,
  transpile,
} from "@/lib/websandbox";
import { HighlightedCode } from "./PyCode";
import { PlayIcon, WarningIcon } from "./Icons";

interface WebSandboxProps {
  initialCode: string;
  mode: WebRunMode;
  lang: string;
  caption?: string;
  minRows?: number;
  onFirstRun?: () => void;
}

type Status = "idle" | "loading" | "running" | "done" | "error";

interface LogLine {
  level: string;
  text: string;
}

const RUN_VERB: Record<WebRunMode, string> = {
  html: "Run preview",
  css: "Run preview",
  react: "Run preview",
  js: "Run",
  ts: "Run",
};

let runCounter = 0;

export function WebSandbox({
  initialCode,
  mode,
  lang,
  caption,
  minRows,
  onFirstRun,
}: WebSandboxProps) {
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState<Status>("idle");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [doc, setDoc] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const runIdRef = useRef<string>("");
  const ranOnce = useRef(false);
  const settledRef = useRef(false);
  const watchdog = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minLines = minRows ?? 3;

  const showPreview = hasPreview(mode);
  const showConsole = hasConsole(mode);

  const clearWatchdog = () => {
    if (watchdog.current) {
      clearTimeout(watchdog.current);
      watchdog.current = null;
    }
  };

  // Listen for console output / completion from the sandboxed iframe.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const d = e.data;
      if (!d || d.source !== "quest-sandbox" || d.run !== runIdRef.current) return;
      if (d.type === "log") {
        setLogs((prev) => [...prev, { level: d.level, text: d.text }]);
      } else if (d.type === "error") {
        settledRef.current = true;
        clearWatchdog();
        setError((prev) => (prev ? prev + "\n" + d.text : d.text));
        setStatus("error");
      } else if (d.type === "done") {
        settledRef.current = true;
        clearWatchdog();
        setStatus((s) => (s === "error" ? "error" : "done"));
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      clearWatchdog();
    };
  }, []);

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = code.slice(0, start) + "  " + code.slice(end);
      setCode(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  };

  const run = useCallback(async () => {
    setError(null);
    setLogs([]);
    settledRef.current = false;
    const compiling = needsCompiler(mode) && !isCompilerReady();
    setStatus(compiling ? "loading" : "running");

    let compiled: string | undefined;
    let component: string | null | undefined;
    if (needsCompiler(mode)) {
      const t = await transpile(code, mode);
      if (t.error) {
        setError(t.error);
        setStatus("error");
        return;
      }
      compiled = t.code;
      component = t.component;
    }

    const runId = `r${++runCounter}`;
    runIdRef.current = runId;
    const html = buildPreviewDoc({ mode, source: code, compiled, component, runId });
    setStatus("running");
    setDoc(html);

    if (!ranOnce.current) {
      ranOnce.current = true;
      onFirstRun?.();
    }

    // Watchdog: if the iframe never reports "done" (e.g. an infinite loop),
    // surface a hint after a few seconds.
    clearWatchdog();
    watchdog.current = setTimeout(() => {
      if (settledRef.current) return;
      settledRef.current = true;
      setError(
        (prev) =>
          prev ||
          "Stopped — the code took too long (a possible infinite loop). Edit and run again."
      );
      setStatus("error");
    }, 5000);
  }, [code, mode, onFirstRun]);

  const reset = () => {
    setCode(initialCode);
    setLogs([]);
    setError(null);
    setDoc(null);
    setStatus("idle");
    clearWatchdog();
  };

  const busy = status === "loading" || status === "running";
  const showOutput =
    status !== "idle" && (doc !== null || status === "loading" || error);

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-border bg-[rgb(var(--code-bg))] shadow-soft">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border/70 bg-surface-2/60 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1 font-mono text-xs font-medium text-faint">
          {caption || lang} · editable
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
            {status === "loading" ? "Compiling…" : busy ? "Running…" : RUN_VERB[mode]}
          </button>
        </div>
      </div>

      {/* Syntax-highlighted editor: colored layer behind a transparent input */}
      <div className="relative w-full">
        <pre
          aria-hidden
          className="m-0 overflow-hidden whitespace-pre-wrap break-words px-4 py-4 font-mono text-[13.5px] leading-[1.7] text-fg"
          style={{ tabSize: 2, minHeight: `calc(${minLines} * 1.7em + 2rem)` }}
        >
          <HighlightedCode code={code.endsWith("\n") ? code + " " : code} lang={lang} />
        </pre>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleTab}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label={`${lang} code editor`}
          className="absolute inset-0 h-full w-full resize-none overflow-hidden whitespace-pre-wrap break-words bg-transparent px-4 py-4 font-mono text-[13.5px] leading-[1.7] text-transparent outline-none"
          style={{ tabSize: 2, caretColor: "rgb(var(--fg))" }}
        />
      </div>

      {/* Output: visual preview and/or console */}
      <AnimatePresence initial={false}>
        {showOutput && (
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
                  ? "Loading compiler (first run only)…"
                  : status === "error"
                  ? "Error"
                  : showPreview
                  ? "Preview"
                  : "Output"}
              </div>

              {status === "loading" && (
                <p className="text-sm text-muted">
                  Downloading the compiler — this happens once, then runs instantly.
                </p>
              )}

              {/* The sandbox iframe both runs the code and (for preview modes)
                  shows it. For console-only modes it's mounted hidden so the
                  code still executes and streams output back. */}
              {doc && status !== "loading" && showPreview && (
                <div className="overflow-hidden rounded-xl border border-border bg-white">
                  <iframe
                    ref={iframeRef}
                    title="Live preview"
                    sandbox="allow-scripts"
                    srcDoc={doc}
                    className="h-64 w-full border-0 bg-white"
                  />
                </div>
              )}
              {doc && status !== "loading" && !showPreview && (
                <iframe
                  ref={iframeRef}
                  title="Code runner"
                  sandbox="allow-scripts"
                  srcDoc={doc}
                  aria-hidden
                  style={{ display: "none" }}
                />
              )}

              {/* Console output (js / ts / react). For preview modes (react),
                  only show it when there's actually something logged. */}
              {showConsole &&
                doc &&
                status !== "loading" &&
                (logs.length > 0 || !showPreview) && (
                  <pre
                    className={`overflow-x-auto whitespace-pre-wrap font-mono text-[13px] leading-relaxed ${
                      showPreview ? "mt-3" : ""
                    }`}
                  >
                    {logs.map((l, i) => (
                      <span
                        key={i}
                        className={
                          l.level === "error"
                            ? "block text-rose-400"
                            : l.level === "warn"
                            ? "block text-amber-400"
                            : "block text-fg/85"
                        }
                      >
                        {l.text}
                      </span>
                    ))}
                    {status === "done" &&
                      logs.length === 0 &&
                      !error &&
                      !showPreview && (
                        <span className="text-faint">
                          (ran with no output — try adding a console.log)
                        </span>
                      )}
                  </pre>
                )}

              {/* Errors (transpile or runtime) */}
              {error && (
                <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/[0.07] p-3.5 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-rose-500">
                    <WarningIcon className="h-4 w-4" />
                    Something went wrong
                  </div>
                  <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap font-mono text-[12.5px] text-rose-400">
                    {error}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

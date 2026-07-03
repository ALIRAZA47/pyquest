"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PyRunner } from "./PyRunner";
import { WebSandbox } from "./WebSandbox";
import { HighlightedCode } from "./PyCode";
import { webRunMode } from "@/lib/websandbox";
import { CopyIcon, CheckIcon, PlayIcon } from "./Icons";

interface CodeBlockProps {
  code: string;
  output?: string;
  caption?: string;
  runnable?: boolean; // live Python (Pyodide)
  webRun?: boolean; // live web preview (iframe sandbox)
  lang?: string;
}

export function CodeBlock({ code, output, caption, runnable, webRun, lang }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [ran, setRan] = useState(false);
  const [live, setLive] = useState(false);
  const trimmed = code.replace(/\n+$/, "");
  const lineCount = trimmed.split("\n").length;
  const webMode = webRun ? webRunMode(lang) : null;
  const canRun = runnable || webMode !== null;

  if (live) {
    return (
      <div className="my-6">
        {webMode ? (
          <WebSandbox
            initialCode={trimmed}
            mode={webMode}
            lang={lang || "code"}
            caption={caption || lang}
            minRows={lineCount}
          />
        ) : (
          <PyRunner initialCode={trimmed} caption={caption || "python"} minRows={lineCount} />
        )}
        <button
          type="button"
          onClick={() => setLive(false)}
          className="mt-1 text-xs font-medium text-faint transition-colors hover:text-accent"
        >
          ← Back to example
        </button>
      </div>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <figure className="group my-6 overflow-hidden rounded-2xl border border-border bg-[rgb(var(--code-bg))] shadow-soft">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border/70 bg-surface-2/60 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1 font-mono text-xs font-medium text-faint">
          {caption || lang || "code"}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {canRun && (
            <button
              type="button"
              onClick={() => setLive(true)}
              className="flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent transition-colors hover:bg-accent/15"
            >
              <PlayIcon className="h-3 w-3" />
              {webMode === "html" || webMode === "css" || webMode === "react"
                ? "Edit & preview"
                : "Edit & run"}
            </button>
          )}
          {output !== undefined && (
            <button
              type="button"
              onClick={() => setRan((r) => !r)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              <PlayIcon className="h-3 w-3" />
              {ran ? "Hide" : "Output"}
            </button>
          )}
          <button
            type="button"
            onClick={copy}
            aria-label="Copy code"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent"
          >
            {copied ? (
              <>
                <CheckIcon className="h-3 w-3 text-green-500" /> Copied
              </>
            ) : (
              <>
                <CopyIcon className="h-3 w-3" /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="flex min-w-full text-[13.5px] leading-[1.7]">
          <code
            aria-hidden
            className="select-none border-r border-border/50 py-4 pl-4 pr-3 text-right font-mono text-faint/70"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </code>
          <code className="block flex-1 py-4 pl-4 pr-6 font-mono text-fg">
            <HighlightedCode code={trimmed} lang={lang} />
          </code>
        </pre>
      </div>

      {/* Output terminal */}
      <AnimatePresence initial={false}>
        {output !== undefined && ran && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border/70 bg-surface-2/40"
          >
            <div className="px-4 py-3">
              <div className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-faint">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                Output
              </div>
              <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="overflow-x-auto whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-fg/85"
              >
                {output || "(no output)"}
              </motion.pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </figure>
  );
}

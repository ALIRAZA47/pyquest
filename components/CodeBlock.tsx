"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tokenizePython } from "@/lib/highlight";
import { CopyIcon, CheckIcon, PlayIcon } from "./Icons";

interface CodeBlockProps {
  code: string;
  output?: string;
  caption?: string;
}

function Highlighted({ code }: { code: string }) {
  const tokens = useMemo(() => tokenizePython(code), [code]);
  return (
    <>
      {tokens.map((t, i) =>
        t.type === "plain" ? (
          <span key={i}>{t.value}</span>
        ) : (
          <span key={i} className={`tok-${t.type}`}>
            {t.value}
          </span>
        )
      )}
    </>
  );
}

export function CodeBlock({ code, output, caption }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [ran, setRan] = useState(false);
  const trimmed = code.replace(/\n+$/, "");
  const lineCount = trimmed.split("\n").length;

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
          {caption || "python"}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {output !== undefined && (
            <button
              type="button"
              onClick={() => setRan((r) => !r)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              <PlayIcon className="h-3 w-3" />
              {ran ? "Hide" : "Run"}
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
            <Highlighted code={trimmed} />
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

"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { runPython, isPyodideReady } from "@/lib/pyodide";
import { HighlightedCode } from "@/components/PyCode";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Glyph } from "@/components/glyphs";
import { PlayIcon } from "@/components/Icons";

const DEFAULT_CODE = `# Fibonacci sequence
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print([fib(i) for i in range(10)])`;

const EXAMPLES: Record<string, string> = {
  Fibonacci: DEFAULT_CODE,
  Triangle: 'for i in range(1, 6):\n    print("★" * i)',
  FizzBuzz:
    'for n in range(1, 16):\n    if n % 15 == 0:\n        print("FizzBuzz")\n    elif n % 3 == 0:\n        print("Fizz")\n    elif n % 5 == 0:\n        print("Buzz")\n    else:\n        print(n)',
  "A tiny class":
    'class Dog:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return f"{self.name} says woof!"\n\nprint(Dog("Rex").speak())',
};

type Status = "idle" | "loading" | "running" | "done" | "error";

export default function PlaygroundPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [status, setStatus] = useState<Status>("idle");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const busy = status === "loading" || status === "running";

  const run = async () => {
    setStatus(isPyodideReady() ? "running" : "loading");
    setError(null);
    const t0 = typeof performance !== "undefined" ? performance.now() : 0;
    try {
      const res = await runPython(code);
      const ms = Math.round(
        (typeof performance !== "undefined" ? performance.now() : 0) - t0
      );
      setOutput(res.output);
      setError(res.error ?? null);
      setElapsed(ms);
      setStatus(res.error ? "error" : "done");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  };

  const reset = () => {
    setCode(DEFAULT_CODE);
    setOutput("");
    setError(null);
    setStatus("idle");
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const s = el.selectionStart;
      const en = el.selectionEnd;
      setCode(code.slice(0, s) + "    " + code.slice(en));
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = s + 4;
      });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-bg">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-glow"
          >
            <Glyph name="code" className="h-4 w-4" />
          </Link>
          <span className="font-display text-lg font-bold tracking-tight text-fg">
            Playground
          </span>
          <span className="hidden items-center gap-1.5 rounded-lg border border-border bg-surface-2/60 px-2.5 py-1 font-mono text-xs text-muted sm:flex">
            <Glyph name="flask" className="h-3.5 w-3.5" />
            Python 3.12
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-accent-text"
          >
            <Glyph name="loop" className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            type="button"
            onClick={run}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform enabled:hover:scale-[1.03] disabled:opacity-60"
          >
            {busy ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
            {status === "loading" ? "Loading…" : busy ? "Running…" : "Run"}
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Split editor / output */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Editor */}
        <div className="flex min-h-0 flex-1 flex-col border-b border-border lg:border-b-0 lg:border-r">
          <div className="shrink-0 border-b border-border/70 bg-surface-2/40 px-4 py-2 font-mono text-xs text-faint">
            main.py
          </div>
          <div
            className="relative min-h-0 flex-1 overflow-auto bg-[rgb(var(--code-bg))]"
            onClick={() => taRef.current?.focus()}
          >
            <pre
              aria-hidden
              className="pointer-events-none m-0 min-h-full whitespace-pre px-4 py-4 font-mono text-[13.5px] leading-[1.7] text-fg"
              style={{ tabSize: 4 }}
            >
              <HighlightedCode code={code.endsWith("\n") ? code + " " : code} />
            </pre>
            <textarea
              ref={taRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleTab}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Python code editor"
              className="absolute inset-0 h-full w-full resize-none whitespace-pre bg-transparent px-4 py-4 font-mono text-[13.5px] leading-[1.7] text-transparent outline-none"
              style={{ tabSize: 4, caretColor: "rgb(var(--fg))" }}
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-2 border-b border-border/70 bg-surface-2/40 px-4 py-2 font-mono text-xs text-faint">
            OUTPUT
            <span
              className={`h-2 w-2 rounded-full ${
                status === "error"
                  ? "bg-rose-500"
                  : status === "done"
                  ? "bg-green-500"
                  : "bg-faint/40"
              }`}
            />
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-5 font-mono text-[13px] leading-relaxed">
            {status === "idle" && (
              <p className="text-faint">Press Run to execute your code.</p>
            )}
            {status === "loading" && (
              <p className="text-muted">
                Downloading the Python runtime — happens once…
              </p>
            )}
            {(status === "done" || status === "error") && (
              <>
                {output && <pre className="whitespace-pre-wrap text-fg/85">{output}</pre>}
                {error && <pre className="whitespace-pre-wrap text-rose-400">{error}</pre>}
                {!output && !error && (
                  <p className="text-faint">(ran with no output — try adding a print)</p>
                )}
                {elapsed !== null && !error && (
                  <p className="mt-3 text-faint">→ finished in {elapsed}ms</p>
                )}
              </>
            )}
          </div>
          {/* Examples */}
          <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-t border-border/70 bg-surface-2/30 px-4 py-2.5">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-faint">
              Examples
            </span>
            {Object.entries(EXAMPLES).map(([label, ex]) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setCode(ex);
                  setOutput("");
                  setError(null);
                  setStatus("idle");
                }}
                className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent-text"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

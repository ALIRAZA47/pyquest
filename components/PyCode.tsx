"use client";

import { useMemo } from "react";
import { tokenizeCode } from "@/lib/highlighters";

// Renders source code as syntax-highlighted spans (themed via the `tok-*` CSS
// classes). Language-aware: Python, JS/TS/JSX, CSS, HTML. Shared by the static
// CodeBlock and the live code editor.
export function HighlightedCode({ code, lang }: { code: string; lang?: string }) {
  const tokens = useMemo(() => tokenizeCode(code, lang), [code, lang]);
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

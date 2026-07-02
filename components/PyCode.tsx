"use client";

import { useMemo } from "react";
import { tokenizePython } from "@/lib/highlight";

// Renders Python source as syntax-highlighted spans (themed via the `tok-*`
// CSS classes). Shared by the static CodeBlock and the live code editor.
export function HighlightedCode({ code }: { code: string }) {
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

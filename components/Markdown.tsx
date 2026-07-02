import React from "react";

// A tiny, safe Markdown renderer covering exactly what lesson content uses:
// paragraphs, bullet lists, **bold**, *italic*, `inline code`, and [links](url).
// It renders React nodes directly (no dangerouslySetInnerHTML).

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Order matters: code first (so we don't format inside it), then links,
  // then bold, then italic.
  const pattern =
    /(`[^`]+`)|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    const token = m[0];
    const key = `${keyPrefix}-${i++}`;
    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-accent"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[")) {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (linkMatch) {
        nodes.push(
          <a
            key={key}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            {linkMatch[1]}
          </a>
        );
      }
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-fg">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      nodes.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ text, className = "" }: { text: string; className?: string }) {
  // Split into blocks separated by blank lines.
  const rawBlocks = text.split(/\n{2,}/);
  const elements: React.ReactNode[] = [];

  rawBlocks.forEach((block, bi) => {
    const lines = block.split("\n");
    const isList = lines.every(
      (l) => l.trim() === "" || /^\s*[-*]\s+/.test(l) || /^\s*\d+\.\s+/.test(l)
    );

    if (isList && lines.some((l) => /^\s*[-*]\s+/.test(l) || /^\s*\d+\.\s+/.test(l))) {
      const ordered = /^\s*\d+\.\s+/.test(lines.find((l) => l.trim())! || "");
      const items = lines
        .filter((l) => l.trim() !== "")
        .map((l) => l.replace(/^\s*(?:[-*]|\d+\.)\s+/, ""));
      const ListTag = ordered ? "ol" : "ul";
      elements.push(
        <ListTag
          key={`b-${bi}`}
          className={`my-3 space-y-1.5 pl-5 ${
            ordered ? "list-decimal" : "list-disc"
          } marker:text-accent/70`}
        >
          {items.map((it, ii) => (
            <li key={ii} className="pl-1 text-muted">
              <span className="text-fg/90">{renderInline(it, `b-${bi}-${ii}`)}</span>
            </li>
          ))}
        </ListTag>
      );
    } else {
      elements.push(
        <p key={`b-${bi}`} className="my-3 text-fg/90">
          {renderInline(block.replace(/\n/g, " "), `b-${bi}`)}
        </p>
      );
    }
  });

  return <div className={className}>{elements}</div>;
}

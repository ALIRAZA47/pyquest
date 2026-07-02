import { getAllLessons } from "./content";

// A lightweight, dependency-free full-content search over all lessons.
// The index is built once at module load (63 lessons is tiny).

interface Indexed {
  slug: string;
  title: string;
  category: string;
  summary: string;
  text: string; // lowercased searchable body
}

function blockText(): Indexed[] {
  return getAllLessons().map((l) => {
    const parts: string[] = [l.summary];
    for (const b of l.blocks) {
      if (b.type === "text") parts.push(b.md);
      else if (b.type === "heading") parts.push(b.text);
      else if (b.type === "callout") parts.push(b.title, b.md);
      else if (b.type === "code") parts.push(b.caption ?? "", b.code);
      else if (b.type === "quiz") parts.push(b.question);
    }
    parts.push(...l.keyTakeaways);
    return {
      slug: l.slug,
      title: l.title,
      category: l.category,
      summary: l.summary,
      text: parts.join("  \n  ").toLowerCase(),
    };
  });
}

const INDEX = blockText();

export interface SearchResult {
  slug: string;
  title: string;
  category: string;
  summary: string;
  snippet?: string;
}

function makeSnippet(text: string, at: number, len: number): string {
  const start = Math.max(0, at - 40);
  const end = Math.min(text.length, at + len + 50);
  let s = text.slice(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) s = "…" + s;
  if (end < text.length) s = s + "…";
  return s;
}

export function searchLessons(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const scored = INDEX.map((doc) => {
    const title = doc.title.toLowerCase();
    const cat = doc.category.toLowerCase();
    const sum = doc.summary.toLowerCase();
    let score = 0;
    let snippet: string | undefined;

    for (const t of terms) {
      if (title.includes(t)) score += 12;
      if (cat.includes(t)) score += 4;
      if (sum.includes(t)) score += 4;
      const idx = doc.text.indexOf(t);
      if (idx >= 0) {
        score += 1;
        if (!snippet) snippet = makeSnippet(doc.text, idx, t.length);
      }
    }
    if (title.includes(q)) score += 10; // full-phrase title bonus
    if (title.startsWith(q)) score += 6;

    return { doc, score, snippet };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((x) => ({
    slug: x.doc.slug,
    title: x.doc.title,
    category: x.doc.category,
    summary: x.doc.summary,
    snippet: x.snippet,
  }));
}

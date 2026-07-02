import type { Block, Difficulty, Exercise, Lesson, LessonMeta } from "./types";
import { ALL_SLUGS, CURRICULUM, categoryForSlug } from "./curriculum";
import { RAW_LESSONS } from "./generated-lessons";

// The content access layer. Lesson JSON is authored per-file and imported via
// the generated RAW_LESSONS map. Everything here is defensive: any missing or
// malformed lesson degrades gracefully into a valid placeholder so the app
// always builds and renders.

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

const VALID_DIFFICULTY: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
const CALLOUT_VARIANTS = ["tip", "warning", "note", "analogy", "gotcha"];

function normalizeBlock(raw: unknown): Block | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  switch (b.type) {
    case "text":
      return { type: "text", md: asString(b.md) };
    case "heading":
      return { type: "heading", text: asString(b.text) };
    case "code":
      return {
        type: "code",
        code: asString(b.code),
        output: typeof b.output === "string" ? b.output : undefined,
        caption: typeof b.caption === "string" ? b.caption : undefined,
      };
    case "callout": {
      const variant = (
        CALLOUT_VARIANTS.includes(b.variant as string) ? b.variant : "note"
      ) as (Block & { type: "callout" })["variant"];
      return {
        type: "callout",
        variant,
        title: asString(b.title, "Note"),
        md: asString(b.md),
      };
    }
    case "quiz": {
      const options = Array.isArray(b.options)
        ? (b.options as unknown[]).map((o) => asString(o)).filter(Boolean)
        : [];
      if (options.length < 2) return null;
      let idx = typeof b.answerIndex === "number" ? b.answerIndex : 0;
      if (idx < 0 || idx >= options.length) idx = 0;
      return {
        type: "quiz",
        question: asString(b.question),
        options,
        answerIndex: idx,
        explanation: asString(b.explanation),
      };
    }
    default:
      // Unknown block type: coerce any stray text into a paragraph.
      if (typeof b.md === "string") return { type: "text", md: b.md };
      if (typeof b.text === "string") return { type: "text", md: b.text };
      return null;
  }
}

function normalizeExercise(raw: unknown): Exercise | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const e = raw as Record<string, unknown>;
  const prompt = asString(e.prompt);
  const solution = asString(e.solution);
  if (!prompt && !solution) return undefined;
  return {
    prompt,
    starterCode: typeof e.starterCode === "string" ? e.starterCode : undefined,
    hint: asString(e.hint),
    solution,
  };
}

function placeholder(slug: string): Lesson {
  const cat = categoryForSlug(slug);
  return {
    slug,
    title: titleCase(slug),
    emoji: cat?.emoji ?? "🐍",
    category: cat?.name ?? "Python",
    difficulty: "Beginner",
    summary: "This lesson is being prepared.",
    readingTime: "5 min",
    blocks: [
      {
        type: "text",
        md: "This lesson is coming together. Check back in a moment while the content finishes loading.",
      },
    ],
    keyTakeaways: [],
  };
}

function normalize(slug: string, raw: unknown): Lesson {
  if (!raw || typeof raw !== "object") return placeholder(slug);
  const r = raw as Record<string, unknown>;
  const cat = categoryForSlug(slug);

  const blocks = Array.isArray(r.blocks)
    ? (r.blocks as unknown[]).map(normalizeBlock).filter((b): b is Block => b !== null)
    : [];

  const takeaways = Array.isArray(r.keyTakeaways)
    ? (r.keyTakeaways as unknown[]).map((t) => asString(t)).filter(Boolean)
    : [];

  const difficulty = VALID_DIFFICULTY.includes(r.difficulty as Difficulty)
    ? (r.difficulty as Difficulty)
    : "Beginner";

  const lesson: Lesson = {
    slug,
    title: asString(r.title, titleCase(slug)),
    emoji: asString(r.emoji, cat?.emoji ?? "🐍"),
    category: asString(r.category, cat?.name ?? "Python"),
    difficulty,
    summary: asString(r.summary, "A friendly Python lesson."),
    readingTime: asString(r.readingTime, "5 min"),
    blocks: blocks.length ? blocks : placeholder(slug).blocks,
    keyTakeaways: takeaways,
    exercise: normalizeExercise(r.exercise),
  };
  return lesson;
}

const LESSONS: Record<string, Lesson> = {};
for (const slug of ALL_SLUGS) {
  LESSONS[slug] = normalize(slug, RAW_LESSONS[slug]);
}

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS[slug];
}

export function getAllLessons(): Lesson[] {
  return ALL_SLUGS.map((s) => LESSONS[s]);
}

export function toMeta(lesson: Lesson): LessonMeta {
  return {
    slug: lesson.slug,
    title: lesson.title,
    emoji: lesson.emoji,
    category: lesson.category,
    difficulty: lesson.difficulty,
    summary: lesson.summary,
  };
}

export function getAllMeta(): LessonMeta[] {
  return getAllLessons().map(toMeta);
}

export interface NavSection {
  name: string;
  emoji: string;
  blurb: string;
  lessons: LessonMeta[];
}

export function getNavSections(): NavSection[] {
  return CURRICULUM.map((c) => ({
    name: c.name,
    emoji: c.emoji,
    blurb: c.blurb,
    lessons: c.slugs.map((s) => toMeta(LESSONS[s])),
  }));
}

export function getAdjacent(slug: string): {
  prev?: LessonMeta;
  next?: LessonMeta;
} {
  const idx = ALL_SLUGS.indexOf(slug);
  if (idx === -1) return {};
  const prevSlug = idx > 0 ? ALL_SLUGS[idx - 1] : undefined;
  const nextSlug = idx < ALL_SLUGS.length - 1 ? ALL_SLUGS[idx + 1] : undefined;
  return {
    prev: prevSlug ? toMeta(LESSONS[prevSlug]) : undefined,
    next: nextSlug ? toMeta(LESSONS[nextSlug]) : undefined,
  };
}

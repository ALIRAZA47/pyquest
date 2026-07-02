import type {
  Block,
  Challenge,
  Difficulty,
  Exercise,
  FillBlank,
  Lesson,
  LessonMeta,
  Slide,
} from "./types";
import { ALL_SLUGS, CURRICULUM, categoryForSlug } from "./curriculum";
import { RAW_LESSONS } from "./generated-lessons";
import { RAW_SLIDES } from "./generated-slides";
import { RAW_CHALLENGES } from "./generated-challenges";

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

function normalizeSlides(raw: unknown): Slide[] | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const arr = (raw as Record<string, unknown>).slides;
  if (!Array.isArray(arr)) return undefined;
  const slides = arr
    .map((s): Slide | null => {
      if (!s || typeof s !== "object") return null;
      const o = s as Record<string, unknown>;
      const title = asString(o.title);
      const body = asString(o.body);
      if (!title && !body && typeof o.code !== "string") return null;
      return {
        title,
        body,
        code: typeof o.code === "string" ? o.code : undefined,
        output: typeof o.output === "string" ? o.output : undefined,
        tip: typeof o.tip === "string" ? o.tip : undefined,
        emoji: typeof o.emoji === "string" ? o.emoji : undefined,
      };
    })
    .filter((s): s is Slide => s !== null);
  return slides.length ? slides : undefined;
}

function normalizeChallenges(raw: unknown): Challenge[] | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const arr = (raw as Record<string, unknown>).challenges;
  if (!Array.isArray(arr)) return undefined;

  const out: Challenge[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const c = item as Record<string, unknown>;
    const prompt = asString(c.prompt);
    const explanation = asString(c.explanation);

    if (c.type === "predict-output" || c.type === "fix-bug") {
      const options = Array.isArray(c.options)
        ? (c.options as unknown[]).map((o) => asString(o))
        : [];
      let idx = typeof c.answerIndex === "number" ? c.answerIndex : 0;
      if (options.length < 2) continue;
      if (idx < 0 || idx >= options.length) idx = 0;
      out.push({
        type: c.type,
        prompt,
        code: asString(c.code),
        options,
        answerIndex: idx,
        explanation,
      });
    } else if (c.type === "fill-blank") {
      const codeTemplate = asString(c.codeTemplate);
      const blanks: FillBlank[] = Array.isArray(c.blanks)
        ? (c.blanks as unknown[])
            .map((b): FillBlank | null => {
              if (!b || typeof b !== "object") return null;
              const bo = b as Record<string, unknown>;
              const answer = asString(bo.answer);
              if (!answer) return null;
              return {
                answer,
                accept: Array.isArray(bo.accept)
                  ? (bo.accept as unknown[]).map((a) => asString(a)).filter(Boolean)
                  : undefined,
              };
            })
            .filter((b): b is FillBlank => b !== null)
        : [];
      const markerCount = (codeTemplate.match(/\{\{blank\}\}/g) || []).length;
      // Only keep if the markers line up with the provided answers.
      if (!codeTemplate || blanks.length === 0 || markerCount !== blanks.length)
        continue;
      out.push({ type: "fill-blank", prompt, codeTemplate, blanks, explanation });
    } else if (c.type === "reorder") {
      const lines = Array.isArray(c.lines)
        ? (c.lines as unknown[]).map((l) => asString(l))
        : [];
      if (lines.length < 2) continue;
      out.push({ type: "reorder", prompt, lines, explanation });
    }
  }
  return out.length ? out : undefined;
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
    slides: normalizeSlides(RAW_SLIDES[slug]),
    challenges: normalizeChallenges(RAW_CHALLENGES[slug]),
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

import type { CategoryMeta } from "./types";

// The complete Quest curriculum — the ordered spine of the whole course.
// Each entry lists the lesson slugs that belong to a category, in learning
// order. The lesson content itself lives in lib/lessons-data.ts.

export const CURRICULUM: CategoryMeta[] = [
  {
    name: "Getting Started",
    emoji: "🚀",
    blurb: "What Python is, how to set it up, and how to run your very first program.",
    slugs: [
      "what-is-python",
      "installing-python",
      "hello-world",
      "how-python-works",
      "the-repl",
    ],
  },
  {
    name: "Python Basics",
    emoji: "🧱",
    blurb: "The building blocks: variables, data types, and talking to the user.",
    slugs: [
      "variables",
      "comments",
      "data-types",
      "numbers",
      "booleans-and-none",
      "type-conversion",
      "input-output",
    ],
  },
  {
    name: "Operators",
    emoji: "➗",
    blurb: "How to do math, compare things, and combine conditions.",
    slugs: [
      "arithmetic-operators",
      "comparison-operators",
      "logical-operators",
      "assignment-operators",
      "operator-precedence",
    ],
  },
  {
    name: "Working with Strings",
    emoji: "🔤",
    blurb: "Text is everywhere. Master slicing, methods, and formatting.",
    slugs: ["strings-basics", "string-methods", "string-formatting", "string-slicing"],
  },
  {
    name: "Data Structures",
    emoji: "📦",
    blurb: "Store and organize collections of data with Python's core containers.",
    slugs: [
      "lists",
      "tuples",
      "sets",
      "dictionaries",
      "list-comprehensions",
    ],
  },
  {
    name: "Control Flow",
    emoji: "🔀",
    blurb: "Make decisions and repeat work — the logic that drives every program.",
    slugs: [
      "if-statements",
      "for-loops",
      "while-loops",
      "break-continue-pass",
      "match-statements",
    ],
  },
  {
    name: "Functions",
    emoji: "🧩",
    blurb: "Package logic into reusable, named blocks you can call anywhere.",
    slugs: [
      "defining-functions",
      "function-arguments",
      "return-values",
      "args-kwargs",
      "lambda-functions",
      "variable-scope",
      "recursion",
    ],
  },
  {
    name: "Object-Oriented Programming",
    emoji: "🏛️",
    blurb: "Model the real world with classes, objects, and inheritance.",
    slugs: [
      "classes-and-objects",
      "the-init-method",
      "inheritance",
      "encapsulation",
      "polymorphism",
      "dunder-methods",
      "class-and-static-methods",
      "properties",
      "dataclasses",
    ],
  },
  {
    name: "Modules & Packages",
    emoji: "📚",
    blurb: "Reuse other people's code and organize your own into modules.",
    slugs: [
      "modules-and-imports",
      "the-standard-library",
      "pip-and-packages",
      "virtual-environments",
    ],
  },
  {
    name: "Error Handling",
    emoji: "🛟",
    blurb: "Write programs that fail gracefully instead of crashing.",
    slugs: ["exceptions", "raising-and-custom-exceptions"],
  },
  {
    name: "Files & Data",
    emoji: "💾",
    blurb: "Read and write files, and work with real-world data formats.",
    slugs: ["reading-writing-files", "working-with-json"],
  },
  {
    name: "Advanced Python",
    emoji: "🧠",
    blurb: "The powerful features that make Python code elegant and expressive.",
    slugs: [
      "decorators",
      "generators",
      "iterators",
      "context-managers",
      "closures",
    ],
  },
  {
    name: "Writing Pythonic Code",
    emoji: "✨",
    blurb: "Idioms, style, and built-in tools that make you look like a pro.",
    slugs: ["pep8-and-style", "type-hints", "builtin-tools", "regular-expressions"],
  },
  {
    name: "Where To Go Next",
    emoji: "🧭",
    blurb: "Your launchpad into real projects, libraries, and specializations.",
    slugs: ["popular-libraries", "your-next-steps"],
  },
];

// Flat, ordered list of every slug in the course (used for prev/next navigation).
export const ALL_SLUGS: string[] = CURRICULUM.flatMap((c) => c.slugs);

export const TOTAL_LESSONS = ALL_SLUGS.length;

export function categoryForSlug(slug: string): CategoryMeta | undefined {
  return CURRICULUM.find((c) => c.slugs.includes(slug));
}

# 🐍 PyQuest — Learn Python, Beautifully

PyQuest is a gorgeous, beginner-friendly web app for learning Python **completely**,
from "what is code?" to decorators and generators. It's built with Next.js and
features a clickable sidebar, 60+ interactive lessons, runnable code examples,
quizzes, hands-on exercises, progress tracking, and polished light & dark themes.

## Features

- **63 lessons across 14 chapters** — a carefully ordered path from zero to confident.
- **Runnable code blocks** — syntax-highlighted Python with copy + a Run button that reveals the exact output.
- **Quick-check quizzes** — instant feedback after each topic.
- **Practice exercises** — every lesson ends with a task, a hint, and a full solution.
- **Progress tracking** — completed lessons are saved in your browser; watch your completion ring fill up.
- **Beautiful UI** — glassy sidebar, smooth Framer Motion animations, and a refined design system.
- **Light & dark modes** — one click, with an animated toggle. Respects reduced-motion.
- **Fast & static** — every lesson is pre-rendered; works offline once loaded.

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## How it works

- Lesson content lives as one JSON file per lesson in `lib/lessons/`.
- `npm run gen` (also run automatically before `dev`/`build`) scans those files
  and regenerates `lib/generated-lessons.ts`.
- `lib/content.ts` validates and normalizes the content defensively, so a
  missing or malformed lesson degrades gracefully instead of breaking the app.
- The course structure (chapters and lesson order) is defined in
  `lib/curriculum.ts`.

## Tech

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with a CSS-variable-driven theming system
- **Framer Motion** for animations
- **next-themes** for light/dark mode
- A small custom Python tokenizer (`lib/highlight.ts`) — no heavy highlighting deps.

## Project structure

```
app/
  page.tsx                landing page
  learn/
    layout.tsx            sidebar + topbar shell
    page.tsx              course dashboard
    [slug]/page.tsx       a single lesson
components/               UI: Sidebar, CodeBlock, Quiz, Exercise, etc.
lib/
  curriculum.ts           chapter + lesson ordering
  content.ts              content access + normalization
  highlight.ts            Python syntax tokenizer
  lessons/*.json          the lesson content
scripts/build-lessons.mjs generates lib/generated-lessons.ts
```

Happy learning! 🎉

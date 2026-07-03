# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Quest** — a gamified, multi-course learning web app (Next.js 14 App Router, TypeScript strict, Tailwind, Framer Motion, next-themes). It hosts **9 courses**: `python` (`/learn`), `ml` (`/ml`), `ai` (`/ai`) on the "core" track, and `html`/`css`/`js`/`ts`/`react`/`node` on the "web" track (`/[course]`). The README still describes the older Python-only version — treat this file as authoritative for architecture.

## Commands

```bash
npm run dev          # predev regenerates content maps, then next dev on :3000
npm run build        # prebuild regenerates content maps, then next build (SSG)
npm run gen          # regenerate lib/**/generated-*.ts from JSON (run after editing any lesson/slide/challenge JSON)
npx tsc --noEmit     # typecheck (there is no separate test suite)
npm run lint         # next lint
```

There is **no test framework**. Verification is: `npx tsc --noEmit`, a production build, and manual/preview checks in the browser.

### Two hard rules

1. **Never run `next build` / `npm run build` while `next dev` is running.** It corrupts `.next` and causes `Cannot find module './xxx.js'`. Stop the dev server first; if already broken, `rm -rf .next` and restart.
2. **After editing any `*.json` under `lib/**/{lessons,slides,challenges}`, run `npm run gen`** (or `node scripts/build-lessons.mjs`) before typecheck/build. The app imports the generated `.ts` maps, not the JSON directly. `predev`/`prebuild` do this automatically, but a bare `tsc`/manual check will use stale maps.

## Architecture

### Content pipeline (the core mental model)
Content is authored as **one JSON file per lesson** and compiled to static TS import maps:

```
lib/<course>/lessons/<slug>.json      →  lib/<course>/generated-lessons.ts   (RAW_<COURSE>_LESSONS)
lib/<course>/slides/<slug>.json       →  lib/<course>/generated-slides.ts    (opt-in per course)
lib/<course>/challenges/<slug>.json   →  lib/<course>/generated-challenges.ts (opt-in per course)
```

`scripts/build-lessons.mjs` scans each directory, validates each file (`blocks[]` for lessons, `challenges[]`/`slides[]` for those), and writes the maps. A missing directory just emits an empty map — courses **opt into** slides/challenges by authoring files. Python's content lives at the top level (`lib/lessons`, `lib/slides`, `lib/challenges` → `lib/content.ts`); every other course lives under `lib/<course>/`.

### The course factory
`lib/course-factory.ts` `createCourse({ id, curriculum, rawLessons, rawSlides?, rawChallenges? })` builds a course-agnostic `Course` object (`getLesson`, `getAllLessons`, `getAdjacent`, `allSlugs`, `totalLessons`, `getNavSections`). It **defensively normalizes** every lesson — malformed/missing content degrades to a placeholder instead of throwing. All 9 courses are one component set parameterized by data. Course instances: `lib/content.ts` (python), `lib/ml/course.ts`, `lib/ai/course.ts`, `lib/web-courses.ts` (the 6 web courses).

### The registry
`lib/courses.ts` is the single source of truth: `COURSES`/`COURSE_LIST` map each id to a `CourseInfo` (`base`, `runtime`, `lang`, `track`, `glyph`, `accent`/`accent2` RGB triples, and the `Course`). `TRACKS`, `coursesInTrack`, `courseFor`, `courseForPath` derive from it. **Per-course theming**: `accent`/`accent2` are applied as inline `--accent`/`--accent-2` CSS vars in `CourseShell` (whole course) and `TrackView` (per card); all accent-colored UI tracks these automatically.

### Rendering & runtimes
`components/LessonRenderer.tsx` renders a lesson from its blocks and dispatches interactivity by **runtime**:
- `runtime === "python"` (python/ml/ai) → `components/PyRunner.tsx`, live Pyodide loaded lazily from CDN (`lib/pyodide.ts`), friendly errors via `lib/pyerrors.ts`.
- `runtime === "web"` (and `courseId !== "node"`) → `components/WebSandbox.tsx` (`lib/websandbox.ts`): a sandboxed `<iframe sandbox="allow-scripts">` (no `allow-same-origin`; parent↔iframe via postMessage). html→srcdoc preview, css→demo-DOM generated from the CSS's own selectors, js→console capture, ts/react→lazy Babel-standalone transpile from CDN (mirrors the Pyodide loader) + React UMD auto-mount. **Node is intentionally display-only** (no browser runtime for require/fs/http).

The `webRun`/`runnable` flags are computed in `LessonRenderer` and threaded into `CodeBlock` (the "Edit & run/preview" toggle) and `Exercise` (the live "Try it"). Syntax highlighting is a custom tokenizer set: `lib/highlight.ts` (Python) + `lib/highlighters.ts` (`tokenizeCode(code, lang)` dispatches JS/TS/JSX/CSS/HTML), rendered via `components/PyCode.tsx` and shared `tok-*` CSS classes — no highlighting library.

### Gamification & state
`components/ProgressContext.tsx` is a single client provider (localStorage `quest:game:v1`, with migration fallbacks from the old `pyquest:*` keys) exposing `useProgress`/`useGame`: completion, XP, levels, streaks, badges (`lib/gamification.ts`), plus toasts and confetti (`components/confetti.ts` → `ConfettiHost`). Note: progress is currently keyed by **bare slug** and pooled across all courses; several Python-only surfaces (`/learn/certificate`, `/learn/projects`, `/learn/playground`, `/learn/review`, `/learn/profile`, badge/`TOTAL_LESSONS` math) are not yet course-aware.

### App shell
`app/layout.tsx` → `app/providers.tsx` wraps everything in `ThemeProvider` (class-based dark mode, default dark) + `ProgressProvider` and mounts global `Toaster`, `ConfettiHost`, `CommandPalette` (Cmd+K, `components/CommandPalette.tsx`), `KeyboardNav`. `app/page.tsx` is a two-choice splash → `/tracks/[track]` (`TrackView`) → a course. `components/CourseShell.tsx` (sidebar + topbar + reading progress) wraps each course's dashboard and lessons.

## Conventions

- Import alias: `@/*` → repo root (e.g. `@/lib/courses`, `@/components/...`).
- Content types live in `lib/types.ts` (`Lesson`, `Block`, `Challenge`, `Slide`, `Exercise`). `Block` and `Challenge` are discriminated unions; the renderer switches on `type`.
- **Never use `Date.now()` / `Math.random()` in render paths for SSR'd content** — it causes hydration mismatches. Use a seeded PRNG (see `mulberry32` in `components/Challenges.tsx`) and/or mount-gating.
- Web courses are pre-rendered static (`generateStaticParams` in `app/[course]/[slug]/page.tsx`, gated on `WEB_COURSE_IDS`).
- Ignore stray root data files (`app_config.json`, `contact.json`, `results.json`, `*.txt`) — they are unrelated to the app.

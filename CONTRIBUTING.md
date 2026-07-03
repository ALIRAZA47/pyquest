# Contributing to Quest

Thanks for your interest in improving Quest! Whether it's a new lesson, a challenge, a bug fix, or a whole new course, contributions are welcome.

## Getting set up

```bash
npm install
npm run dev      # http://localhost:3000
```

Before opening a PR, make sure both of these pass:

```bash
npx tsc --noEmit   # type-check
npm run build      # production build
```

There is no unit-test suite — the type-checker and a successful build are the gate, plus a manual check in the browser.

## Two rules that will save you time

1. **Never run `npm run build` while `npm run dev` is running.** It corrupts the `.next` cache and produces `Cannot find module './xxx.js'`. Stop the dev server first; if it's already broken, `rm -rf .next` and restart.
2. **After editing any content JSON, run `npm run gen`.** The app imports generated TypeScript maps, not the JSON files directly. `npm run dev` and `npm run build` regenerate automatically, but a bare `tsc` will use stale maps.

## How content works

Every lesson is a JSON file. A build step (`scripts/build-lessons.mjs`) compiles all of them into static import maps that one shared component set renders. See [CLAUDE.md](CLAUDE.md) for the full architecture.

```
lib/<course>/lessons/<slug>.json      the lesson  (required)
lib/<course>/slides/<slug>.json       interactive walkthrough  (optional)
lib/<course>/challenges/<slug>.json   auto-graded challenges   (optional)
```

Python's content lives at the top level (`lib/lessons`, `lib/slides`, `lib/challenges`); every other course lives under `lib/<course>/`. The content shapes are defined in [`lib/types.ts`](lib/types.ts).

### Add or edit a lesson

1. Create/edit `lib/<course>/lessons/<slug>.json` with `title`, `summary`, `difficulty`, `readingTime`, a `blocks` array (`text`, `heading`, `code`, `callout`, `quiz`), `keyTakeaways`, and an optional `exercise`.
2. Make sure the `<slug>` is listed in that course's curriculum so it appears in the sidebar:
   - Python: [`lib/curriculum.ts`](lib/curriculum.ts)
   - ML / AI: `lib/ml/curriculum.ts`, `lib/ai/curriculum.ts`
   - Web courses: [`lib/web-curricula.ts`](lib/web-curricula.ts)
3. Run `npm run gen`, then check it in the browser.

### Add challenges

Create `lib/<course>/challenges/<slug>.json`:

```json
{
  "slug": "<slug>",
  "challenges": [
    { "type": "predict-output", "prompt": "...", "code": "...", "options": ["...","..."], "answerIndex": 0, "explanation": "..." },
    { "type": "fix-bug",       "prompt": "...", "code": "...", "options": ["...","..."], "answerIndex": 1, "explanation": "..." },
    { "type": "fill-blank",    "prompt": "...", "codeTemplate": "code with {{blank}} marker", "blanks": [{ "answer": "x", "accept": ["X"] }], "explanation": "..." },
    { "type": "reorder",       "prompt": "...", "lines": ["line 1", "line 2", "line 3"], "explanation": "..." }
  ]
}
```

Guidelines: 3–4 varied challenges per lesson, grounded in that lesson's content; exactly one correct MC option; one `{{blank}}` marker per blank; `reorder` lines given in the **correct** final order (the UI scrambles them).

### Runnable code notes

- `runtime: "python"` courses (Python/ML/AI) execute real Python via Pyodide.
- `runtime: "web"` courses run in a sandboxed iframe: HTML/CSS preview, JS/TS console, React live preview. **Node stays display-only** (no browser runtime for `require`/`fs`/`http`).

## Code style

- TypeScript strict; import via the `@/*` alias (repo root).
- Match the surrounding code's Tailwind + design-token conventions (use `--accent`, `--fg`, `--surface`, etc., not hard-coded colors).
- **Never** use `Date.now()` or `Math.random()` in a render path for server-rendered content — it causes hydration mismatches. Use a seeded PRNG (see `mulberry32` in `components/Challenges.tsx`) and/or mount-gating.

## Pull requests

- Branch off `main`, keep PRs focused, and describe what and why.
- Confirm `npx tsc --noEmit` and `npm run build` both pass.
- Include a screenshot/GIF for any visual change.

By contributing, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

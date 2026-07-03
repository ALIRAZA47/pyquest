# Design Prompt — Quest (interactive coding-learning app)

> Paste this whole document into Claude (or any design tool) and ask it to produce a **complete visual redesign / design system** for the app: color, typography, spacing, components, and full-screen mockups for every screen listed. Then hand the result back to the engineer to implement.

---

## 1. What Quest is

Quest is a **gamified, self-paced learning platform for programming**. A learner picks a track, works through beautiful interactive lessons where they can **run code in the browser**, take **auto-graded challenges**, watch **animated visualizers** of how things work under the hood, and earn **XP, streaks, and badges**. It's fully static (no backend/accounts) and works in light and dark mode.

**Ten courses in two tracks:**
- **AI & Python (core track):** Python · Machine Learning · Large Language Models · Artificial Intelligence · Model Context Protocol (MCP)
- **Web Development track:** HTML · CSS · JavaScript · TypeScript · React · Node.js

**Scale:** ~180+ lessons, ~600+ challenges, dozens of animated visualizers.

## 2. Who it's for & the feeling to evoke

- **Audience:** absolute beginners → intermediate self-learners; also devs learning a new topic (AI/MCP). Age 16–40, global.
- **Emotional target:** *"delightful, modern, and a little playful — like a premium product, not a dusty textbook."* Think Linear/Vercel polish meets Duolingo motivation meets an interactive science museum. Confident, calm, encouraging. Celebratory on wins (confetti), never stressful.
- **Must feel:** trustworthy and legible for long reading sessions, yet energetic and game-like around progress.

## 3. Brand & current design language (evolve, don't discard)

- **Name/wordmark:** "Quest". Current logo mark is a rounded-square with a `</>` chevron in an indigo→violet gradient.
- **Dark-first**, with a fully supported light mode. Default theme is dark.
- **Design tokens** are CSS variables (RGB triples) so both themes and per-course accents work:
  - `--bg`, `--surface`, `--surface-2`, `--border`, `--fg`, `--muted`, `--faint`, `--accent`, `--accent-2`, `--accent-soft`, `--code-bg`.
  - Dark: near-black navy bg (`8 10 20`), surfaces `16 19 33` / `23 27 46`, fg `231 234 246`. Light: `248 249 252` bg, white surfaces, fg `22 25 43`.
  - Brand accent (default): indigo `#635bf1` → violet `#a855f7` gradient.
- **Per-course accent theming (important):** each course recolors `--accent`/`--accent-2` for its whole shell and its card. Keep this system and design a palette that keeps all 11 accents (10 courses + brand) **distinct and WCAG-AA legible in both themes**:
  - python indigo · ml teal · llm amber/gold · ai violet · mcp fuchsia · html orange · css blue · js amber · ts cyan · react rose · node green.
  - ⚠️ Known issue to fix in the redesign: several accents (amber, teal, orange, cyan, green) currently fail AA contrast for `text-accent` labels and white-on-accent buttons in **light mode**. Provide a paired "accent-text" shade tuned to ≥4.5:1 on surfaces.
- **Type:** currently system UI sans; headings are black/extra-bold with tight tracking; code is monospace. Feel free to specify a refined type scale (display, h1–h4, body, small, mono) and, if proposing web fonts, keep them performant.
- **Shape & depth:** generous radii (rounded-2xl cards, pill buttons), soft shadows, subtle glassmorphism on the sidebar, gradient glows behind heroes, faint dot-grid backgrounds.
- **Motion:** Framer Motion. Staggered fade-up on content, spring transitions, animated theme toggle, confetti on achievements. Must respect `prefers-reduced-motion`.
- **Iconography:** a custom line-icon set (single consistent stroke weight) — not emoji. Design any new icons to match.

## 4. Information architecture (routes)

1. **Splash `/`** — the landing page. Two big animated choice cards: **AI & Python** and **Web Development**, illustration-rich, floating shapes, gradient glow. Picks a track.
2. **Track page `/tracks/[track]`** — hero for the track + a grid of **course cards** (each in its own accent, with glyph, tagline, description, highlight chips, and progress `done/total`).
3. **Course dashboard** (`/learn` Python, `/ml`, `/ai`, `/llm`, `/mcp`, and `/[course]` for web) — the course home: hero with progress ring + "continue", then chapters/modules each listing lessons with completion state.
4. **Lesson page** (`/<course>/<slug>`) — the core reading+doing surface (detailed below).
5. **Playground `/learn/playground`** — a free live code editor (Python today).
6. **Review `/learn/review`** — spaced-practice quizzes.
7. **Projects `/learn/projects` + `/learn/projects/[id]`** — capstone builds.
8. **Profile / Achievements `/learn/profile`** — XP, level/rank, streak, badges, stats.
9. **Certificate `/learn/certificate`** — a shareable completion certificate.
10. **404 `/not-found`**.

> Note for the redesign: the profile/certificate/review/projects are currently Python-only and should be reimagined as **course-aware / unified** (per-course progress + a global dashboard). Design for that.

## 5. Global chrome (persistent components)

- **Sidebar** (desktop, glassy, fixed left ~300px; drawer on mobile): course brand at top, search box, quick links (Playground/Review/Projects/Achievements), then the collapsible chapter → lesson tree with completion checkmarks and the current lesson highlighted. Shows XP/level/streak somewhere.
- **Topbar:** menu (mobile), breadcrumb (course › chapter › lesson), a **⌘K search** button, "Courses" link, and the **theme toggle**.
- **Reading-progress bar** across the top of lessons.
- **Command palette (⌘K):** centered modal, fuzzy search across all lessons + quick actions (jump to any course, playground, toggle theme). Needs a keyboard-first, accessible dialog design (this is a focal component).
- **Toaster** (XP/badge/level-up toasts, top-right) and **confetti** overlay on wins.

## 6. The Lesson page (design this in depth — it's where users spend 90% of their time)

A centered reading column (max ~48rem) containing, top to bottom:
- **Header:** category chip, difficulty chip (Beginner/Intermediate/Advanced, color-coded), reading-time, lesson index (e.g. 03/12), a large glyph tile, the H1 title + one-line summary, and a **"Mark as complete"** toggle.
- **Interactive slide deck** ("See it in action") — a small carousel of walkthrough cards (title, body, optional code, tip) shown near the top.
- **Content blocks**, rendered in order:
  - **Text** (markdown prose — must be beautifully legible; design the prose style: headings, lists, inline code, links, bold).
  - **Headings** (section anchors).
  - **Code blocks** — a "editor" card with a mac-style titlebar (three dots + filename), line numbers, syntax highlighting (design the token colors for both themes), a **Copy** button, and for runnable languages an **"Edit & run"** / **"Edit & preview"** button. Running Python shows an output terminal; running web code shows a **live preview pane** or a **console output** panel; friendly error cards for mistakes.
  - **Callouts** — five variants: tip, note, warning, gotcha, analogy — each with its own icon/color.
  - **Inline quizzes** — a question with multiple-choice options that reveal correct/incorrect + an explanation, award XP.
- **Key takeaways** — an accented summary card with checkmark bullets.
- **Animated visualizer** ("Try it yourself") — an embedded interactive widget unique to the lesson (see §7). Design the frame/chrome these sit in (title, subtitle, play/step controls, reset).
- **Practice challenges** — a section of auto-graded cards, four types: *predict the output*, *fix the bug*, *fill in the blank* (inline inputs in code), *reorder the lines* (drag/step to reorder). Each shows solved state + XP.
- **Exercise** — a "Your turn" card with a prompt, an editable code area (runnable where supported), a hint reveal, and a solution reveal.
- **Footer nav** — previous / next lesson cards, and a "mark complete & continue" nudge.

Design all **states**: loading (Pyodide/compiler downloading), running, success, error, empty, solved, completed, and the runnable-vs-display-only variants.

## 7. Animated visualizers (a signature feature — design their look & controls)

Embedded interactive widgets that explain concepts visually. They share a frame (accent-tinted card, title + subtitle, and a control bar: ◀ prev / ▶ play-pause / ▶ next / reset + a step label). Examples across the app:
- ML/AI: gradient descent, k-means, decision trees, k-NN, neural-net forward pass, A* & BFS/DFS pathfinding on a grid, minimax game tree, the perceptron.
- LLM: tokenizer (text→tokens), embeddings scatter plot, transformer stack, attention weights, next-token probability bars, temperature/sampling dial, sliding context window.
- MCP: the N×M integration problem collapsing into a hub, the 4-layer Host→Client→Server→Data message flow, JSON-RPC handshake, the full tool-call round-trip, the three primitives.
- JS/Node: **the event loop** (call stack + microtask/macrotask queues, playable) — the marquee one — plus scope/closures, the prototype chain, array-method pipelines, React re-render/virtual-DOM.

Design a consistent visual language for these: how nodes/queues/bars/plots/arrows look, how the "active" element is highlighted, how playback controls read, and how they adapt to the course accent + light/dark.

## 8. Gamification surfaces

- **XP toasts**, **level-up** celebration, **badge unlock** cards (design a badge visual language — tiers/ranks like "Hatchling"→higher), **streak** flame with day count, **progress rings**, and the **certificate** (a premium, printable/shareable artifact).

## 9. Responsive & accessibility (hard requirements)

- Fully responsive from 360px phones to wide desktops. Sidebar becomes a drawer; visualizers, tables, and code blocks must scroll inside their own containers (page body never scrolls horizontally). Editors must use ≥16px font on mobile (avoid iOS zoom).
- WCAG AA contrast in both themes for text and interactive states (see the accent caveat in §3). Visible focus states, keyboard operability, `prefers-reduced-motion` variants, and meaningful states for screen readers.

## 10. Deliverables requested from the designer

1. A **design system**: color tokens (light + dark + all 11 accents with paired accent-text), type scale, spacing/radius/shadow scale, and motion guidelines.
2. A **component library** sheet: buttons, chips, cards, inputs, code block, callouts (5), quiz, challenge cards (4 types), sidebar, topbar, command palette, toasts, badges, progress ring, visualizer frame + controls.
3. **Full mockups** (desktop + mobile, light + dark) for: Splash, Track page, Course dashboard, **Lesson page** (the priority — show a rich one with code, callout, quiz, visualizer, challenges), Playground, Profile/Achievements, Certificate, and the Command palette + a couple of toasts.
4. Keep it **implementable in Tailwind + CSS variables + Framer Motion** (a Next.js app). Prefer system or performant web fonts. Note any assets (icons, illustrations) that need producing.

Deliver as annotated mockups + a written spec of the tokens and component rules. Preserve what already works (dark-first, per-course accents, the interactive/gamified soul); elevate the polish, hierarchy, consistency, and accessibility.

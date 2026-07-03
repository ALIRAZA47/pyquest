import type { Course } from "./course-factory";
import { pythonCourse } from "./content";
import { mlCourse } from "./ml/course";
import { aiCourse } from "./ai/course";
import { llmCourse } from "./llm/course";
import { mcpCourse } from "./mcp/course";
import {
  htmlCourse,
  cssCourse,
  jsCourse,
  tsCourse,
  reactCourse,
  nodeCourse,
} from "./web-courses";

export interface CourseInfo {
  id: string;
  base: string; // route base, e.g. "/learn"
  name: string; // short name for chips/labels
  title: string; // display title
  tagline: string;
  description: string;
  glyph: string; // brand glyph name
  runtime: "python" | "web"; // "python" = live Pyodide runner; "web" = display-only code
  lang: string; // default code language for highlighting
  track: "core" | "web";
  accent: string; // per-course accent as an "R G B" triple (drives --accent)
  accent2: string; // secondary accent for gradients (drives --accent-2)
  course: Course;
}

export const COURSES: Record<string, CourseInfo> = {
  python: {
    id: "python", base: "/learn", name: "Python", title: "Python 101",
    tagline: "Learn Python, beautifully.",
    description: "Go from zero to confident Python — variables, loops, functions, OOP and beyond, with runnable code and hands-on projects.",
    glyph: "snake", runtime: "python", lang: "py", track: "core",
    accent: "99 102 241", accent2: "139 92 246", course: pythonCourse,
  },
  ml: {
    id: "ml", base: "/ml", name: "Machine Learning", title: "Machine Learning",
    tagline: "Watch the algorithms learn.",
    description: "Understand how models actually learn — regression, k-means, k-NN, decision trees and neural nets — with animated visualizers that show the math in motion.",
    glyph: "chart", runtime: "python", lang: "py", track: "core",
    accent: "13 148 136", accent2: "20 184 166", course: mlCourse,
  },
  ai: {
    id: "ai", base: "/ai", name: "Artificial Intelligence", title: "Artificial Intelligence",
    tagline: "See how machines think.",
    description: "Explore how AI searches, plans, plays games and learns — from A* pathfinding and minimax to perceptrons and language models — brought to life with interactive animations.",
    glyph: "robot", runtime: "python", lang: "py", track: "core",
    accent: "147 51 234", accent2: "168 85 247", course: aiCourse,
  },
  llm: {
    id: "llm", base: "/llm", name: "LLMs", title: "Large Language Models",
    tagline: "See how AI actually thinks.",
    description: "Open the black box: how LLMs turn text into tokens and vectors, how attention and the transformer work, how they predict one token at a time, and how they're trained — every mechanism brought to life with animations.",
    glyph: "brain", runtime: "web", lang: "py", track: "core",
    accent: "217 119 6", accent2: "245 158 11", course: llmCourse,
  },
  mcp: {
    id: "mcp", base: "/mcp", name: "MCP", title: "Model Context Protocol",
    tagline: "Give your agents superpowers.",
    description: "Learn the open standard that lets AI agents plug into your databases, files, and APIs — how it works under the hood, and how to build a real connector in Node.js and Python.",
    glyph: "plug", runtime: "web", lang: "py", track: "core",
    accent: "217 70 239", accent2: "240 171 252", course: mcpCourse,
  },
  html: {
    id: "html", base: "/html", name: "HTML", title: "HTML",
    tagline: "The structure of the web.",
    description: "Build the skeleton of every web page — text, links, images, forms, and semantic, accessible markup.",
    glyph: "browser", runtime: "web", lang: "html", track: "web",
    accent: "234 88 12", accent2: "249 115 22", course: htmlCourse,
  },
  css: {
    id: "css", base: "/css", name: "CSS", title: "CSS",
    tagline: "Make it beautiful.",
    description: "Style the web with selectors, the box model, Flexbox, Grid, responsive design, and smooth animations.",
    glyph: "brush", runtime: "web", lang: "css", track: "web",
    accent: "37 99 235", accent2: "96 165 250", course: cssCourse,
  },
  js: {
    id: "js", base: "/js", name: "JavaScript", title: "JavaScript",
    tagline: "Bring pages to life.",
    description: "The language of the web — variables, functions, the DOM, events, and asynchronous programming with the event loop.",
    glyph: "bolt", runtime: "web", lang: "js", track: "web",
    accent: "217 119 6", accent2: "245 158 11", course: jsCourse,
  },
  ts: {
    id: "ts", base: "/ts", name: "TypeScript", title: "TypeScript",
    tagline: "JavaScript with superpowers.",
    description: "Add static types to JavaScript to catch bugs early and supercharge your editor — types, interfaces, generics, and more.",
    glyph: "tag", runtime: "web", lang: "ts", track: "web",
    accent: "8 145 178", accent2: "34 211 238", course: tsCourse,
  },
  react: {
    id: "react", base: "/react", name: "React", title: "React",
    tagline: "Build modern UIs.",
    description: "Create interactive interfaces from reusable components with JSX, props, state, and hooks.",
    glyph: "atom", runtime: "web", lang: "jsx", track: "web",
    accent: "225 29 72", accent2: "251 113 133", course: reactCourse,
  },
  node: {
    id: "node", base: "/node", name: "Node.js", title: "Node.js",
    tagline: "JavaScript on the server.",
    description: "Run JavaScript on the backend — modules, npm, the file system, HTTP servers, Express, and REST APIs.",
    glyph: "hexagon", runtime: "web", lang: "js", track: "web",
    accent: "22 163 74", accent2: "74 222 128", course: nodeCourse,
  },
};

export const COURSE_LIST: CourseInfo[] = [
  COURSES.python, COURSES.ml, COURSES.ai, COURSES.llm, COURSES.mcp,
  COURSES.html, COURSES.css, COURSES.js, COURSES.ts, COURSES.react, COURSES.node,
];

export const WEB_COURSE_IDS = ["html", "css", "js", "ts", "react", "node"];

export interface TrackInfo {
  id: "core" | "web";
  label: string;
  tagline: string;
  description: string;
  glyph: string;
}

export const TRACKS: TrackInfo[] = [
  {
    id: "core",
    label: "AI & Python",
    tagline: "Learn to code, then teach machines to think.",
    description: "Master Python from scratch, then explore Machine Learning, Large Language Models, Artificial Intelligence, and the Model Context Protocol — with animated visualizers and hands-on connectors that show how it all really works.",
    glyph: "robot",
  },
  {
    id: "web",
    label: "Web Development",
    tagline: "Build for the web, from your first tag to full-stack.",
    description: "Go from HTML and CSS to JavaScript, TypeScript, React, and Node.js — everything you need to build modern websites and apps.",
    glyph: "browser",
  },
];

export function coursesInTrack(track: string): CourseInfo[] {
  return COURSE_LIST.filter((c) => c.track === track);
}

export function trackInfo(id: string): TrackInfo | undefined {
  return TRACKS.find((t) => t.id === id);
}

export function courseFor(id: string): CourseInfo {
  return COURSES[id] ?? COURSES.python;
}

export function courseForPath(pathname: string | null | undefined): CourseInfo {
  if (!pathname) return COURSES.python;
  const seg = pathname.split("/").filter(Boolean)[0];
  if (seg && seg !== "learn" && COURSES[seg]) return COURSES[seg];
  return COURSES.python;
}

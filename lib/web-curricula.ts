import type { CategoryMeta } from "./types";

// Curricula for the six web-development courses. Each is a concise learning
// path organized into modules (chapters).

export const HTML_CURRICULUM: CategoryMeta[] = [
  {
    name: "Getting Started with HTML",
    emoji: "📄",
    blurb: "What HTML is, how the web works, and the structure of a page.",
    slugs: ["what-is-html", "how-the-web-works", "html-document-structure"],
  },
  {
    name: "Content & Media",
    emoji: "🖼️",
    blurb: "Text, links, and images — the building blocks of every page.",
    slugs: ["headings-and-text", "links-and-navigation", "images-and-media"],
  },
  {
    name: "Forms & Semantics",
    emoji: "📝",
    blurb: "Collect input and structure pages meaningfully and accessibly.",
    slugs: ["forms-and-inputs", "semantic-html"],
  },
];

export const CSS_CURRICULUM: CategoryMeta[] = [
  {
    name: "CSS Fundamentals",
    emoji: "🎨",
    blurb: "Selectors, colors, units, and how the cascade decides what wins.",
    slugs: ["what-is-css", "css-selectors", "colors-and-units", "cascade-and-specificity"],
  },
  {
    name: "Layout",
    emoji: "📐",
    blurb: "The box model, Flexbox, and Grid — arranging things on the page.",
    slugs: ["the-box-model", "flexbox", "css-grid"],
  },
  {
    name: "Responsive & Motion",
    emoji: "✨",
    blurb: "Make it work on any screen, and bring it to life with motion.",
    slugs: ["responsive-design", "transitions-and-animations"],
  },
];

export const JS_CURRICULUM: CategoryMeta[] = [
  {
    name: "JavaScript Foundations",
    emoji: "⚡",
    blurb: "Variables, types, and expressions — the basics of the language.",
    slugs: ["what-is-javascript", "variables-and-data-types", "operators-and-expressions"],
  },
  {
    name: "Data & Logic",
    emoji: "🧮",
    blurb: "Arrays, objects, control flow, and functions.",
    slugs: ["arrays", "objects", "conditionals", "loops", "javascript-functions"],
  },
  {
    name: "The DOM & Events",
    emoji: "🖱️",
    blurb: "Read and change the page, and respond to the user.",
    slugs: ["the-dom", "events-and-listeners"],
  },
  {
    name: "Asynchronous JavaScript",
    emoji: "⏳",
    blurb: "Promises, async/await, and the event loop under the hood.",
    slugs: ["promises-and-async", "the-event-loop"],
  },
];

export const TS_CURRICULUM: CategoryMeta[] = [
  {
    name: "TypeScript Basics",
    emoji: "🏷️",
    blurb: "Add types to JavaScript — variables and functions.",
    slugs: ["what-is-typescript", "basic-types", "typing-functions"],
  },
  {
    name: "Structuring Types",
    emoji: "🧩",
    blurb: "Describe object shapes and combine types safely.",
    slugs: ["interfaces-and-types", "unions-and-narrowing"],
  },
  {
    name: "Advanced TypeScript",
    emoji: "🧠",
    blurb: "Reusable generic code and typing React.",
    slugs: ["generics", "typescript-with-react"],
  },
];

export const REACT_CURRICULUM: CategoryMeta[] = [
  {
    name: "React Basics",
    emoji: "⚛️",
    blurb: "Components, JSX, and props — the core building blocks.",
    slugs: ["what-is-react", "jsx", "components-and-props"],
  },
  {
    name: "State & Interaction",
    emoji: "🔁",
    blurb: "Manage changing data and respond to the user.",
    slugs: ["state-with-usestate", "handling-events", "conditional-rendering", "lists-and-keys"],
  },
  {
    name: "Hooks",
    emoji: "🪝",
    blurb: "Side effects and reusable logic with hooks.",
    slugs: ["the-useeffect-hook", "custom-hooks"],
  },
];

export const NODE_CURRICULUM: CategoryMeta[] = [
  {
    name: "Node.js Basics",
    emoji: "🟩",
    blurb: "JavaScript on the server — modules, npm, and the runtime.",
    slugs: ["what-is-nodejs", "modules-and-npm", "the-node-runtime"],
  },
  {
    name: "Building a Server",
    emoji: "🖥️",
    blurb: "Files, HTTP servers, Express, and routing.",
    slugs: ["the-file-system", "http-server", "express-and-routing"],
  },
  {
    name: "APIs & Async",
    emoji: "🔌",
    blurb: "Build a REST API and handle asynchronous work.",
    slugs: ["building-a-rest-api", "async-in-node"],
  },
];

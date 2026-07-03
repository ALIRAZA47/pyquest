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
    blurb: "Arrays, objects, control flow, and unpacking data.",
    slugs: ["arrays", "objects", "conditionals", "loops", "destructuring-and-spread"],
  },
  {
    name: "Functions & Scope",
    emoji: "🔧",
    blurb: "Functions as values — arrows, closures, and higher-order patterns.",
    slugs: ["javascript-functions", "arrow-functions", "higher-order-functions"],
  },
  {
    name: "Object-Oriented JS",
    emoji: "🏗️",
    blurb: "Model things with classes — inheritance, polymorphism, and encapsulation.",
    slugs: ["classes", "inheritance-and-polymorphism", "encapsulation"],
  },
  {
    name: "The DOM & Events",
    emoji: "🖱️",
    blurb: "Read and change the page, and respond to the user.",
    slugs: ["the-dom", "events-and-listeners"],
  },
  {
    name: "Async & Modern JS",
    emoji: "⏳",
    blurb: "Promises, the event loop, error handling, and modules.",
    slugs: ["promises-and-async", "the-event-loop", "error-handling", "es-modules"],
  },
  {
    name: "Advanced: TypeScript",
    emoji: "🔷",
    blurb: "Add a type checker to JavaScript — annotations, interfaces, and generics.",
    slugs: ["typescript-basics", "typescript-interfaces", "typescript-generics"],
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
    blurb: "Manage changing data, forms, and shared state.",
    slugs: ["state-with-usestate", "handling-events", "conditional-rendering", "lists-and-keys", "forms-and-controlled-inputs", "lifting-state-up"],
  },
  {
    name: "Hooks",
    emoji: "🪝",
    blurb: "Side effects, shared data, and reusable logic with hooks.",
    slugs: ["the-useeffect-hook", "usecontext", "custom-hooks"],
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
    name: "The Event Loop",
    emoji: "♻️",
    blurb: "The heart of Node's concurrency — build a program and watch every phase fire.",
    slugs: ["the-node-event-loop"],
  },
  {
    name: "Core Modules",
    emoji: "🧰",
    blurb: "The event-driven and streaming primitives Node is built on.",
    slugs: ["events-and-eventemitter", "streams-and-buffers"],
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

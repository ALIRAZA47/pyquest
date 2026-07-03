import type { CategoryMeta } from "../types";

// The Model Context Protocol course. Learn what MCP is, how the pieces fit,
// the wire protocol, the full request/response loop, and how to build a real
// connector in Node.js and Python. Adapted from the "MCP Playground" project.

export const MCP_CURRICULUM: CategoryMeta[] = [
  {
    name: "MCP Foundations",
    emoji: "🔌",
    blurb: "What MCP is, the problem it solves, and the ideas that make it click.",
    slugs: ["what-is-mcp", "the-four-big-ideas"],
  },
  {
    name: "How MCP Works",
    emoji: "🧩",
    blurb: "The four-layer architecture, the three server primitives, and the JSON-RPC wire protocol.",
    slugs: ["the-mcp-architecture", "tools-resources-prompts", "the-wire-protocol"],
  },
  {
    name: "The Request Loop",
    emoji: "🔁",
    blurb: "Follow one question end to end — from plain English to SQL rows and back.",
    slugs: ["anatomy-of-a-tool-call"],
  },
  {
    name: "Build a Server",
    emoji: "🛠️",
    blurb: "Write a real MCP connector with the official SDKs and plug it into a host.",
    slugs: ["build-a-node-server", "build-a-python-server", "connect-to-a-host"],
  },
  {
    name: "MCP in Practice",
    emoji: "🚀",
    blurb: "What MCP unlocks in the real world — and the safety boundary that makes it work.",
    slugs: ["use-cases-and-safety"],
  },
];

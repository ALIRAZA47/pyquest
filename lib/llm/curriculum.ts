import type { CategoryMeta } from "../types";

// The Large Language Models course. From "what is an LLM" through tokens,
// embeddings, attention, the transformer, sampling, training, and prompting —
// with animated visualizers for every core mechanism. Sits right before the
// Model Context Protocol course, which shows how to give these models tools.

export const LLM_CURRICULUM: CategoryMeta[] = [
  {
    name: "LLM Foundations",
    emoji: "🧠",
    blurb: "What a language model really is, and how it turns text into numbers it can work with.",
    slugs: ["what-is-an-llm", "tokens-and-tokenization", "embeddings"],
  },
  {
    name: "Inside the Model",
    emoji: "⚙️",
    blurb: "The transformer, attention, and how one token at a time becomes fluent text.",
    slugs: ["the-transformer", "attention", "next-token-prediction", "sampling-and-temperature"],
  },
  {
    name: "Training an LLM",
    emoji: "🎓",
    blurb: "How raw text becomes a model — pretraining, fine-tuning, and RLHF.",
    slugs: ["how-llms-are-trained", "fine-tuning-and-rlhf"],
  },
  {
    name: "Using LLMs",
    emoji: "🛠️",
    blurb: "Context windows, prompting, and the limits that make tools like MCP necessary.",
    slugs: ["context-windows", "prompting-and-in-context-learning", "limitations-and-hallucinations"],
  },
];

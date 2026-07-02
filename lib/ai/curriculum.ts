import type { CategoryMeta } from "../types";

// The Artificial Intelligence course curriculum. Focuses on how classic and
// modern AI techniques actually work, with animated visualizers for search,
// game trees, and neural networks.

export const AI_CURRICULUM: CategoryMeta[] = [
  {
    name: "AI Foundations",
    emoji: "🤖",
    blurb: "What AI is (and isn't), how agents perceive and act, and how we got here.",
    slugs: ["what-is-ai", "intelligent-agents", "history-of-ai"],
  },
  {
    name: "Search & Problem Solving",
    emoji: "🧭",
    blurb: "Turn problems into searches — and watch algorithms explore to find solutions.",
    slugs: ["problem-solving-as-search", "bfs-and-dfs", "a-star-search"],
  },
  {
    name: "Games & Adversarial Search",
    emoji: "♟️",
    blurb: "How AI plans against an opponent — the logic behind game-playing machines.",
    slugs: ["minimax", "alpha-beta-pruning"],
  },
  {
    name: "Learning Machines",
    emoji: "🧠",
    blurb: "From a single neuron to deep networks — how machines learn from data.",
    slugs: [
      "neural-networks-and-deep-learning",
      "the-perceptron",
      "how-networks-learn",
    ],
  },
  {
    name: "Modern AI",
    emoji: "✨",
    blurb: "Language models, vision, and the big questions about AI's future.",
    slugs: ["nlp-and-llms", "computer-vision", "ai-ethics-and-future"],
  },
];

import type { CategoryMeta } from "../types";

// The Machine Learning course curriculum. Lessons emphasize how each
// algorithm works under the hood, paired with animated visualizers.

export const ML_CURRICULUM: CategoryMeta[] = [
  {
    name: "ML Foundations",
    emoji: "📊",
    blurb: "What machine learning really is, its flavors, and how data drives it.",
    slugs: ["what-is-ml", "types-of-ml", "data-and-features"],
  },
  {
    name: "Supervised Learning",
    emoji: "🎯",
    blurb: "Learn from labeled examples — regression, classification, and the algorithms behind them.",
    slugs: [
      "linear-regression",
      "gradient-descent",
      "logistic-regression",
      "k-nearest-neighbors",
      "decision-trees",
    ],
  },
  {
    name: "Unsupervised Learning",
    emoji: "🧩",
    blurb: "Find structure in data with no labels at all.",
    slugs: ["k-means-clustering"],
  },
  {
    name: "Model Quality",
    emoji: "⚖️",
    blurb: "Why models fail, and how to tell if yours is actually any good.",
    slugs: ["overfitting-underfitting", "evaluating-models"],
  },
  {
    name: "Neural Networks",
    emoji: "🧠",
    blurb: "The building block of modern AI — how a network turns inputs into predictions.",
    slugs: ["neural-networks-basics"],
  },
  {
    name: "Putting It Together",
    emoji: "🚀",
    blurb: "The real-world ML workflow, tools, and where to go next.",
    slugs: ["ml-in-practice"],
  },
];

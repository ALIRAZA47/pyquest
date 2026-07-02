// Core content model for PyQuest lessons.
// Content is authored as structured "blocks" so the UI can render every
// concept consistently and beautifully.

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type CalloutVariant = "tip" | "warning" | "note" | "analogy" | "gotcha";

export type Block =
  | { type: "text"; md: string }
  | { type: "heading"; text: string }
  | { type: "code"; code: string; output?: string; caption?: string }
  | { type: "callout"; variant: CalloutVariant; title: string; md: string }
  | {
      type: "quiz";
      question: string;
      options: string[];
      answerIndex: number;
      explanation: string;
    };

export interface Exercise {
  prompt: string;
  starterCode?: string;
  hint: string;
  solution: string;
}

// A single card in a lesson's interactive walkthrough deck.
export interface Slide {
  title: string;
  body: string; // markdown
  code?: string;
  output?: string;
  tip?: string;
  emoji?: string;
}

export interface Lesson {
  slug: string;
  title: string;
  emoji: string;
  category: string;
  difficulty: Difficulty;
  summary: string;
  readingTime: string;
  blocks: Block[];
  keyTakeaways: string[];
  exercise?: Exercise;
  slides?: Slide[];
}

export interface CategoryMeta {
  name: string;
  emoji: string;
  blurb: string;
  slugs: string[];
}

export interface LessonMeta {
  slug: string;
  title: string;
  emoji: string;
  category: string;
  difficulty: Difficulty;
  summary: string;
}

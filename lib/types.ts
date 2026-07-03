// Core content model for Quest lessons.
// Content is authored as structured "blocks" so the UI can render every
// concept consistently and beautifully.

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type CalloutVariant = "tip" | "warning" | "note" | "analogy" | "gotcha";

export type Block =
  | { type: "text"; md: string }
  | { type: "heading"; text: string }
  | { type: "code"; code: string; output?: string; caption?: string; lang?: string }
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

// Interactive, auto-graded practice challenges.
export interface FillBlank {
  answer: string;
  accept?: string[];
}

export type Challenge =
  | {
      type: "predict-output";
      prompt: string;
      code: string;
      options: string[];
      answerIndex: number;
      explanation: string;
    }
  | {
      type: "fix-bug";
      prompt: string;
      code: string;
      options: string[];
      answerIndex: number;
      explanation: string;
    }
  | {
      type: "fill-blank";
      prompt: string;
      codeTemplate: string; // uses the literal marker {{blank}}
      blanks: FillBlank[];
      explanation: string;
    }
  | {
      type: "reorder";
      prompt: string;
      lines: string[]; // given in the CORRECT order
      explanation: string;
    };

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
  challenges?: Challenge[];
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

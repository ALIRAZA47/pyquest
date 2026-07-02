// The rules of the game: XP values, the leveling curve, rank names, and the
// achievement (badge) definitions. All pure functions so they can be used on
// the server or client and unit-reasoned about easily.

export const XP = {
  LESSON_COMPLETE: 40,
  QUIZ_CORRECT: 10,
  CHALLENGE_SOLVED: 15,
  EXERCISE_RUN: 12,
  REVIEW_CORRECT: 8,
} as const;

export interface Rank {
  name: string;
  emoji: string;
}

const RANKS: Rank[] = [
  { name: "Hatchling", emoji: "🐣" },
  { name: "Novice", emoji: "🌱" },
  { name: "Apprentice", emoji: "📗" },
  { name: "Coder", emoji: "💻" },
  { name: "Pythonista", emoji: "🐍" },
  { name: "Artisan", emoji: "🎨" },
  { name: "Sorcerer", emoji: "🧙" },
  { name: "Architect", emoji: "🏛️" },
  { name: "Grandmaster", emoji: "🏆" },
  { name: "Python Legend", emoji: "🌟" },
];

// Total XP required to *reach* a given level (1-indexed): 50*(L-1)^2.
export function xpForLevel(level: number): number {
  return 50 * Math.pow(Math.max(0, level - 1), 2);
}

export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1;
}

export function rankForLevel(level: number): Rank {
  return RANKS[Math.min(level - 1, RANKS.length - 1)] ?? RANKS[0];
}

// Progress info for the current level (for progress bars/rings).
export function levelProgress(xp: number): {
  level: number;
  rank: Rank;
  intoLevel: number; // XP earned since this level started
  levelSpan: number; // XP needed to go from this level to the next
  toNext: number; // XP remaining until next level
  fraction: number; // 0..1 progress through the current level
} {
  const level = levelFromXp(xp);
  const start = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const span = next - start;
  const into = xp - start;
  return {
    level,
    rank: rankForLevel(level),
    intoLevel: into,
    levelSpan: span,
    toNext: Math.max(0, next - xp),
    fraction: span > 0 ? Math.min(1, into / span) : 1,
  };
}

// ---- Achievements ------------------------------------------------------

export interface BadgeSnapshot {
  completedCount: number;
  totalLessons: number;
  xp: number;
  streak: number;
  longestStreak: number;
  quizzesCorrect: number;
  challengesSolved: number;
  chaptersCompleted: number;
  exercisesRun: number;
  hour: number; // 0..23 local hour, for time-based badges
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  test: (s: BadgeSnapshot) => boolean;
}

export const BADGES: Badge[] = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your very first lesson.",
    emoji: "🐣",
    test: (s) => s.completedCount >= 1,
  },
  {
    id: "getting-warm",
    title: "Getting Warm",
    description: "Complete 5 lessons.",
    emoji: "🔥",
    test: (s) => s.completedCount >= 5,
  },
  {
    id: "chapter-champion",
    title: "Chapter Champion",
    description: "Finish an entire chapter.",
    emoji: "🚀",
    test: (s) => s.chaptersCompleted >= 1,
  },
  {
    id: "halfway-there",
    title: "Halfway There",
    description: "Complete half of all lessons.",
    emoji: "🌗",
    test: (s) => s.totalLessons > 0 && s.completedCount >= s.totalLessons / 2,
  },
  {
    id: "completionist",
    title: "Completionist",
    description: "Complete every single lesson.",
    emoji: "👑",
    test: (s) => s.totalLessons > 0 && s.completedCount >= s.totalLessons,
  },
  {
    id: "quiz-whiz",
    title: "Quiz Whiz",
    description: "Answer 10 quizzes correctly.",
    emoji: "🎯",
    test: (s) => s.quizzesCorrect >= 10,
  },
  {
    id: "challenger",
    title: "Challenger",
    description: "Solve 10 interactive challenges.",
    emoji: "⚔️",
    test: (s) => s.challengesSolved >= 10,
  },
  {
    id: "tinkerer",
    title: "Tinkerer",
    description: "Run your own code 5 times.",
    emoji: "🔧",
    test: (s) => s.exercisesRun >= 5,
  },
  {
    id: "streak-3",
    title: "On a Roll",
    description: "Keep a 3-day learning streak.",
    emoji: "🔥",
    test: (s) => s.longestStreak >= 3 || s.streak >= 3,
  },
  {
    id: "streak-7",
    title: "Unstoppable",
    description: "Keep a 7-day learning streak.",
    emoji: "⚡",
    test: (s) => s.longestStreak >= 7 || s.streak >= 7,
  },
  {
    id: "xp-500",
    title: "Rising Star",
    description: "Earn 500 XP.",
    emoji: "⭐",
    test: (s) => s.xp >= 500,
  },
  {
    id: "xp-1500",
    title: "XP Machine",
    description: "Earn 1,500 XP.",
    emoji: "💎",
    test: (s) => s.xp >= 1500,
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Study after midnight.",
    emoji: "🦉",
    test: (s) => s.hour >= 0 && s.hour < 5,
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Study before 7am.",
    emoji: "🌅",
    test: (s) => s.hour >= 5 && s.hour < 7,
  },
];

export function badgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}

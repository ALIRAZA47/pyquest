import { createCourse, type Course } from "../course-factory";
import { AI_CURRICULUM } from "./curriculum";
import { RAW_AI_LESSONS } from "./generated-lessons";
import { RAW_AI_CHALLENGES } from "./generated-challenges";

export const aiCourse: Course = createCourse({
  id: "ai",
  fallbackEmoji: "🤖",
  curriculum: AI_CURRICULUM,
  rawLessons: RAW_AI_LESSONS,
  rawChallenges: RAW_AI_CHALLENGES,
});

import { createCourse, type Course } from "../course-factory";
import { LLM_CURRICULUM } from "./curriculum";
import { RAW_LLM_LESSONS } from "./generated-lessons";
import { RAW_LLM_CHALLENGES } from "./generated-challenges";

export const llmCourse: Course = createCourse({
  id: "llm",
  fallbackEmoji: "🧠",
  curriculum: LLM_CURRICULUM,
  rawLessons: RAW_LLM_LESSONS,
  rawChallenges: RAW_LLM_CHALLENGES,
});

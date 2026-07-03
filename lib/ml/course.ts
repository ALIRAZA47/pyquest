import { createCourse, type Course } from "../course-factory";
import { ML_CURRICULUM } from "./curriculum";
import { RAW_ML_LESSONS } from "./generated-lessons";
import { RAW_ML_CHALLENGES } from "./generated-challenges";

export const mlCourse: Course = createCourse({
  id: "ml",
  fallbackEmoji: "📊",
  curriculum: ML_CURRICULUM,
  rawLessons: RAW_ML_LESSONS,
  rawChallenges: RAW_ML_CHALLENGES,
});

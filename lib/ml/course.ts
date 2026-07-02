import { createCourse, type Course } from "../course-factory";
import { ML_CURRICULUM } from "./curriculum";
import { RAW_ML_LESSONS } from "./generated-lessons";

export const mlCourse: Course = createCourse({
  id: "ml",
  fallbackEmoji: "📊",
  curriculum: ML_CURRICULUM,
  rawLessons: RAW_ML_LESSONS,
});

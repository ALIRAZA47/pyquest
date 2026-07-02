import { CURRICULUM } from "./curriculum";
import { RAW_LESSONS } from "./generated-lessons";
import { RAW_SLIDES } from "./generated-slides";
import { RAW_CHALLENGES } from "./generated-challenges";
import { createCourse, toMeta, type Course, type NavSection } from "./course-factory";

// The Python course — the original PyQuest course. Its public API is kept
// stable so all existing Python pages keep working unchanged.

export const pythonCourse: Course = createCourse({
  id: "python",
  fallbackEmoji: "🐍",
  curriculum: CURRICULUM,
  rawLessons: RAW_LESSONS,
  rawSlides: RAW_SLIDES,
  rawChallenges: RAW_CHALLENGES,
});

export type { NavSection };
export { toMeta };

export const getLesson = pythonCourse.getLesson;
export const getAllLessons = pythonCourse.getAllLessons;
export const getAllMeta = pythonCourse.getAllMeta;
export const getNavSections = pythonCourse.getNavSections;
export const getAdjacent = pythonCourse.getAdjacent;

import type { Course } from "./course-factory";
import { pythonCourse } from "./content";
import { mlCourse } from "./ml/course";
import { aiCourse } from "./ai/course";

export interface CourseInfo {
  id: string;
  base: string; // route base, e.g. "/learn"
  name: string; // short name for chips/labels
  title: string; // display title
  tagline: string;
  description: string;
  glyph: string; // brand glyph name
  course: Course;
}

export const COURSES: Record<string, CourseInfo> = {
  python: {
    id: "python",
    base: "/learn",
    name: "Python",
    title: "Python 101",
    tagline: "Learn Python, beautifully.",
    description:
      "Go from zero to confident Python — variables, loops, functions, OOP and beyond, with runnable code and hands-on projects.",
    glyph: "snake",
    course: pythonCourse,
  },
  ml: {
    id: "ml",
    base: "/ml",
    name: "Machine Learning",
    title: "Machine Learning",
    tagline: "Watch the algorithms learn.",
    description:
      "Understand how models actually learn — regression, k-means, k-NN, decision trees and neural nets — with animated visualizers that show the math in motion.",
    glyph: "chart",
    course: mlCourse,
  },
  ai: {
    id: "ai",
    base: "/ai",
    name: "Artificial Intelligence",
    title: "Artificial Intelligence",
    tagline: "See how machines think.",
    description:
      "Explore how AI searches, plans, plays games and learns — from A* pathfinding and minimax to perceptrons and language models — brought to life with interactive animations.",
    glyph: "robot",
    course: aiCourse,
  },
};

export const COURSE_LIST: CourseInfo[] = [COURSES.python, COURSES.ml, COURSES.ai];

export function courseFor(id: string): CourseInfo {
  return COURSES[id] ?? COURSES.python;
}

export function courseForPath(pathname: string | null | undefined): CourseInfo {
  if (!pathname) return COURSES.python;
  if (pathname === "/ml" || pathname.startsWith("/ml/")) return COURSES.ml;
  if (pathname === "/ai" || pathname.startsWith("/ai/")) return COURSES.ai;
  return COURSES.python;
}

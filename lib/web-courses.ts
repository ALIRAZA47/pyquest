import { createCourse, type Course } from "./course-factory";
import {
  HTML_CURRICULUM,
  CSS_CURRICULUM,
  JS_CURRICULUM,
  TS_CURRICULUM,
  REACT_CURRICULUM,
  NODE_CURRICULUM,
} from "./web-curricula";
import { RAW_HTML_LESSONS } from "./html/generated-lessons";
import { RAW_CSS_LESSONS } from "./css/generated-lessons";
import { RAW_JS_LESSONS } from "./js/generated-lessons";
import { RAW_TS_LESSONS } from "./ts/generated-lessons";
import { RAW_REACT_LESSONS } from "./react/generated-lessons";
import { RAW_NODE_LESSONS } from "./node/generated-lessons";
import { RAW_HTML_CHALLENGES } from "./html/generated-challenges";
import { RAW_CSS_CHALLENGES } from "./css/generated-challenges";
import { RAW_JS_CHALLENGES } from "./js/generated-challenges";
import { RAW_TS_CHALLENGES } from "./ts/generated-challenges";
import { RAW_REACT_CHALLENGES } from "./react/generated-challenges";
import { RAW_NODE_CHALLENGES } from "./node/generated-challenges";

export const htmlCourse: Course = createCourse({ id: "html", curriculum: HTML_CURRICULUM, rawLessons: RAW_HTML_LESSONS, rawChallenges: RAW_HTML_CHALLENGES });
export const cssCourse: Course = createCourse({ id: "css", curriculum: CSS_CURRICULUM, rawLessons: RAW_CSS_LESSONS, rawChallenges: RAW_CSS_CHALLENGES });
export const jsCourse: Course = createCourse({ id: "js", curriculum: JS_CURRICULUM, rawLessons: RAW_JS_LESSONS, rawChallenges: RAW_JS_CHALLENGES });
export const tsCourse: Course = createCourse({ id: "ts", curriculum: TS_CURRICULUM, rawLessons: RAW_TS_LESSONS, rawChallenges: RAW_TS_CHALLENGES });
export const reactCourse: Course = createCourse({ id: "react", curriculum: REACT_CURRICULUM, rawLessons: RAW_REACT_LESSONS, rawChallenges: RAW_REACT_CHALLENGES });
export const nodeCourse: Course = createCourse({ id: "node", curriculum: NODE_CURRICULUM, rawLessons: RAW_NODE_LESSONS, rawChallenges: RAW_NODE_CHALLENGES });

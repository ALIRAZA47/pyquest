import { createCourse, type Course } from "../course-factory";
import { MCP_CURRICULUM } from "./curriculum";
import { RAW_MCP_LESSONS } from "./generated-lessons";
import { RAW_MCP_CHALLENGES } from "./generated-challenges";

export const mcpCourse: Course = createCourse({
  id: "mcp",
  fallbackEmoji: "🔌",
  curriculum: MCP_CURRICULUM,
  rawLessons: RAW_MCP_LESSONS,
  rawChallenges: RAW_MCP_CHALLENGES,
});

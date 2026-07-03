import { CourseShell } from "@/components/CourseShell";

export default function McpLayout({ children }: { children: React.ReactNode }) {
  return <CourseShell courseId="mcp">{children}</CourseShell>;
}

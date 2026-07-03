import { CourseShell } from "@/components/CourseShell";

export default function LlmLayout({ children }: { children: React.ReactNode }) {
  return <CourseShell courseId="llm">{children}</CourseShell>;
}

import { CourseShell } from "@/components/CourseShell";

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return <CourseShell courseId="ai">{children}</CourseShell>;
}

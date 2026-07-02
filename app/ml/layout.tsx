import { CourseShell } from "@/components/CourseShell";

export default function MlLayout({ children }: { children: React.ReactNode }) {
  return <CourseShell courseId="ml">{children}</CourseShell>;
}

import { CourseShell } from "@/components/CourseShell";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CourseShell courseId="python">{children}</CourseShell>;
}

import { CourseShell } from "@/components/CourseShell";

export default function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { course: string };
}) {
  return <CourseShell courseId={params.course}>{children}</CourseShell>;
}

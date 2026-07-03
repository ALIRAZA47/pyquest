import { notFound } from "next/navigation";
import { CourseDashboard } from "@/components/CourseDashboard";
import { WEB_COURSE_IDS } from "@/lib/courses";

export function generateStaticParams() {
  return WEB_COURSE_IDS.map((course) => ({ course }));
}

export default function CoursePage({ params }: { params: { course: string } }) {
  if (!WEB_COURSE_IDS.includes(params.course)) notFound();
  return <CourseDashboard courseId={params.course} />;
}

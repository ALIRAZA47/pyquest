import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WEB_COURSE_IDS, courseFor } from "@/lib/courses";
import { LessonRenderer } from "@/components/LessonRenderer";

export function generateStaticParams() {
  const params: { course: string; slug: string }[] = [];
  for (const course of WEB_COURSE_IDS) {
    for (const slug of courseFor(course).course.allSlugs) {
      params.push({ course, slug });
    }
  }
  return params;
}

export function generateMetadata({
  params,
}: {
  params: { course: string; slug: string };
}): Metadata {
  const info = courseFor(params.course);
  const lesson = info.course.getLesson(params.slug);
  if (!lesson) return { title: "Lesson not found — Quest" };
  return { title: `${lesson.title} — ${info.title}`, description: lesson.summary };
}

export default function WebLessonPage({
  params,
}: {
  params: { course: string; slug: string };
}) {
  if (!WEB_COURSE_IDS.includes(params.course)) notFound();
  const info = courseFor(params.course);
  const lesson = info.course.getLesson(params.slug);
  if (!lesson) notFound();
  const { prev, next } = info.course.getAdjacent(params.slug);
  const index = info.course.allSlugs.indexOf(params.slug);
  return (
    <LessonRenderer
      lesson={lesson}
      prev={prev}
      next={next}
      index={index}
      total={info.course.totalLessons}
      base={info.base}
      runtime={info.runtime}
      codeLang={info.lang}
      courseId={info.id}
    />
  );
}

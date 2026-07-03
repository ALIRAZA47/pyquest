import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { aiCourse } from "@/lib/ai/course";
import { LessonRenderer } from "@/components/LessonRenderer";

export function generateStaticParams() {
  return aiCourse.allSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const lesson = aiCourse.getLesson(params.slug);
  if (!lesson) return { title: "Lesson not found — Quest" };
  return {
    title: `${lesson.title} — Artificial Intelligence`,
    description: lesson.summary,
  };
}

export default function AiLessonPage({ params }: { params: { slug: string } }) {
  const lesson = aiCourse.getLesson(params.slug);
  if (!lesson) notFound();
  const { prev, next } = aiCourse.getAdjacent(params.slug);
  const index = aiCourse.allSlugs.indexOf(params.slug);
  return (
    <LessonRenderer
      lesson={lesson}
      prev={prev}
      next={next}
      index={index}
      total={aiCourse.totalLessons}
      base="/ai"
    />
  );
}

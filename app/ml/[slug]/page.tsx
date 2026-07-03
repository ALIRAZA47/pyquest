import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mlCourse } from "@/lib/ml/course";
import { LessonRenderer } from "@/components/LessonRenderer";

export function generateStaticParams() {
  return mlCourse.allSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const lesson = mlCourse.getLesson(params.slug);
  if (!lesson) return { title: "Lesson not found — Quest" };
  return { title: `${lesson.title} — Machine Learning`, description: lesson.summary };
}

export default function MlLessonPage({ params }: { params: { slug: string } }) {
  const lesson = mlCourse.getLesson(params.slug);
  if (!lesson) notFound();
  const { prev, next } = mlCourse.getAdjacent(params.slug);
  const index = mlCourse.allSlugs.indexOf(params.slug);
  return (
    <LessonRenderer
      lesson={lesson}
      prev={prev}
      next={next}
      index={index}
      total={mlCourse.totalLessons}
      base="/ml"
    />
  );
}

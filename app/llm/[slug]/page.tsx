import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { llmCourse } from "@/lib/llm/course";
import { LessonRenderer } from "@/components/LessonRenderer";

export function generateStaticParams() {
  return llmCourse.allSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const lesson = llmCourse.getLesson(params.slug);
  if (!lesson) return { title: "Lesson not found — Quest" };
  return { title: `${lesson.title} — Large Language Models`, description: lesson.summary };
}

export default function LlmLessonPage({ params }: { params: { slug: string } }) {
  const lesson = llmCourse.getLesson(params.slug);
  if (!lesson) notFound();
  const { prev, next } = llmCourse.getAdjacent(params.slug);
  const index = llmCourse.allSlugs.indexOf(params.slug);
  return (
    <LessonRenderer
      lesson={lesson}
      prev={prev}
      next={next}
      index={index}
      total={llmCourse.totalLessons}
      base="/llm"
      runtime="web"
      codeLang="py"
      courseId="llm"
    />
  );
}

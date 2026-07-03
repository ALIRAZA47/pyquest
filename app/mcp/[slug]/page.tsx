import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mcpCourse } from "@/lib/mcp/course";
import { LessonRenderer } from "@/components/LessonRenderer";

export function generateStaticParams() {
  return mcpCourse.allSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const lesson = mcpCourse.getLesson(params.slug);
  if (!lesson) return { title: "Lesson not found — Quest" };
  return { title: `${lesson.title} — Model Context Protocol`, description: lesson.summary };
}

export default function McpLessonPage({ params }: { params: { slug: string } }) {
  const lesson = mcpCourse.getLesson(params.slug);
  if (!lesson) notFound();
  const { prev, next } = mcpCourse.getAdjacent(params.slug);
  const index = mcpCourse.allSlugs.indexOf(params.slug);
  return (
    <LessonRenderer
      lesson={lesson}
      prev={prev}
      next={next}
      index={index}
      total={mcpCourse.totalLessons}
      base="/mcp"
      runtime="web"
      codeLang="py"
      courseId="mcp"
    />
  );
}

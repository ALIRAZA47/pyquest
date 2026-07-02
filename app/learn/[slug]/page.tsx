import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLesson, getAdjacent } from "@/lib/content";
import { ALL_SLUGS } from "@/lib/curriculum";
import { LessonRenderer } from "@/components/LessonRenderer";

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const lesson = getLesson(params.slug);
  if (!lesson) return { title: "Lesson not found — PyQuest" };
  return {
    title: `${lesson.title} — PyQuest`,
    description: lesson.summary,
  };
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = getLesson(params.slug);
  if (!lesson) notFound();

  const { prev, next } = getAdjacent(params.slug);
  const index = ALL_SLUGS.indexOf(params.slug);

  return (
    <LessonRenderer
      lesson={lesson}
      prev={prev}
      next={next}
      index={index}
      total={ALL_SLUGS.length}
    />
  );
}

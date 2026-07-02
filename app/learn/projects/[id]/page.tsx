import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CAPSTONES, getCapstone } from "@/lib/capstones";
import { CapstoneView } from "@/components/CapstoneView";

export function generateStaticParams() {
  return CAPSTONES.map((c) => ({ id: c.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const c = getCapstone(params.id);
  if (!c) return { title: "Project not found — PyQuest" };
  return { title: `${c.title} — PyQuest Projects`, description: c.blurb };
}

export default function CapstonePage({ params }: { params: { id: string } }) {
  const capstone = getCapstone(params.id);
  if (!capstone) notFound();
  return <CapstoneView capstone={capstone} />;
}

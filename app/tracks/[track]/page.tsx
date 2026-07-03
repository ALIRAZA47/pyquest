import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TRACKS, trackInfo } from "@/lib/courses";
import { TrackView } from "@/components/TrackView";

export function generateStaticParams() {
  return TRACKS.map((t) => ({ track: t.id }));
}

export function generateMetadata({
  params,
}: {
  params: { track: string };
}): Metadata {
  const info = trackInfo(params.track);
  if (!info) return { title: "Quest" };
  return { title: `${info.label} — Quest`, description: info.description };
}

export default function TrackPage({ params }: { params: { track: string } }) {
  const info = trackInfo(params.track);
  if (!info) notFound();
  return <TrackView trackId={params.track} />;
}

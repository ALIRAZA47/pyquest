"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ReadingProgress } from "./ReadingProgress";
import { courseFor } from "@/lib/courses";

export function CourseShell({
  courseId,
  children,
}: {
  courseId: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const info = courseFor(courseId);

  return (
    <div
      className="min-h-screen"
      style={
        {
          "--accent": info.accent,
          "--accent-2": info.accent2,
        } as React.CSSProperties
      }
    >
      <ReadingProgress />
      <Sidebar
        courseId={courseId}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex min-h-screen min-w-0 flex-col lg:pl-[300px] print:pl-0">
        <Topbar courseId={courseId} onMenu={() => setMobileOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

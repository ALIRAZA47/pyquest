"use client";

import { usePathname } from "next/navigation";
import { CourseShell } from "./CourseShell";

// Utility pages in the design are full-bleed (no course sidebar); lessons and
// the dashboard live inside the course shell.
const STANDALONE = ["/learn/playground", "/learn/certificate", "/learn/profile"];

export function LearnShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const standalone = STANDALONE.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (standalone) return <>{children}</>;
  return <CourseShell courseId="python">{children}</CourseShell>;
}

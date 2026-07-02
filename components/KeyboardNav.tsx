"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { courseForPath } from "@/lib/courses";

// Global lesson navigation across any course: `[` / `k` = previous lesson,
// `]` / `j` = next. Ignored while typing in inputs.
export function KeyboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      ) {
        return;
      }
      const info = courseForPath(pathname);
      const base = info.base;
      if (!pathname?.startsWith(base + "/")) return;
      const slug = pathname.slice(base.length + 1);
      const slugs = info.course.allSlugs;
      const idx = slugs.indexOf(slug);
      if (idx === -1) return;

      if (e.key === "[" || e.key.toLowerCase() === "k") {
        if (idx > 0) {
          e.preventDefault();
          router.push(`${base}/${slugs[idx - 1]}`);
        }
      } else if (e.key === "]" || e.key.toLowerCase() === "j") {
        if (idx < slugs.length - 1) {
          e.preventDefault();
          router.push(`${base}/${slugs[idx + 1]}`);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, router]);

  return null;
}

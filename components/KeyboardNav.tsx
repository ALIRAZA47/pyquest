"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ALL_SLUGS } from "@/lib/curriculum";

// Global lesson navigation: `[` / `k` = previous lesson, `]` / `j` = next.
// Ignored while typing in inputs or when a modifier key is held.
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
      if (!pathname?.startsWith("/learn/")) return;
      const slug = pathname.replace("/learn/", "");
      const idx = ALL_SLUGS.indexOf(slug);
      if (idx === -1) return;

      if (e.key === "[" || e.key.toLowerCase() === "k") {
        if (idx > 0) {
          e.preventDefault();
          router.push(`/learn/${ALL_SLUGS[idx - 1]}`);
        }
      } else if (e.key === "]" || e.key.toLowerCase() === "j") {
        if (idx < ALL_SLUGS.length - 1) {
          e.preventDefault();
          router.push(`/learn/${ALL_SLUGS[idx + 1]}`);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, router]);

  return null;
}

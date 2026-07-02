"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { courseFor } from "@/lib/courses";
import { ThemeToggle } from "./ThemeToggle";
import { openCommandPalette } from "./CommandPalette";
import { MenuIcon, ChevronRight, SearchIcon } from "./Icons";

export function Topbar({
  onMenu,
  courseId = "python",
}: {
  onMenu: () => void;
  courseId?: string;
}) {
  const pathname = usePathname();
  const info = courseFor(courseId);
  const base = info.base;
  const slug = pathname?.startsWith(base + "/")
    ? pathname.slice(base.length + 1)
    : "";
  const lesson = slug ? info.course.getLesson(slug) : undefined;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-surface/70 px-4 backdrop-blur-xl sm:px-6 print:hidden">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open menu"
        className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted transition-colors hover:text-accent lg:hidden"
      >
        <MenuIcon className="h-4 w-4" />
      </button>

      <nav className="flex min-w-0 items-center gap-1.5 text-sm text-muted">
        <Link href={base} className="shrink-0 font-medium hover:text-accent">
          {info.name}
        </Link>
        {lesson && (
          <>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-faint" />
            <span className="hidden shrink-0 text-faint sm:inline">
              {lesson.category}
            </span>
            <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-faint sm:inline" />
            <span className="truncate font-semibold text-fg">{lesson.title}</span>
          </>
        )}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={openCommandPalette}
          aria-label="Search (Cmd+K)"
          className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 py-1.5 pl-2.5 pr-2 text-sm text-faint transition-colors hover:border-accent/50 hover:text-accent"
        >
          <SearchIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium sm:inline">
            ⌘K
          </kbd>
        </button>
        <Link
          href="/"
          className="hidden rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent sm:block"
        >
          Courses
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}

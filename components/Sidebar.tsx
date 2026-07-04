"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { courseFor } from "@/lib/courses";
import { useProgress } from "./ProgressContext";
import { Glyph, categoryGlyph, rankGlyph } from "./glyphs";
import {
  SearchIcon,
  ChevronDown,
  CheckIcon,
  CloseIcon,
  FlameIcon,
} from "./Icons";

interface QuickLink {
  href: string;
  icon: string;
  label: string;
}

const QUICK_LINKS: Record<string, QuickLink[]> = {
  python: [
    { href: "/learn/playground", icon: "flask", label: "Playground" },
    { href: "/learn/review", icon: "loop", label: "Review" },
    { href: "/learn/projects", icon: "puzzle", label: "Projects" },
    { href: "/learn/profile", icon: "trophy", label: "Achievements" },
  ],
  ml: [
    { href: "/learn/playground", icon: "flask", label: "Playground" },
    { href: "/learn/profile", icon: "trophy", label: "Achievements" },
    { href: "/tracks/core", icon: "compass", label: "All courses" },
  ],
  ai: [
    { href: "/learn/playground", icon: "flask", label: "Playground" },
    { href: "/learn/profile", icon: "trophy", label: "Achievements" },
    { href: "/tracks/core", icon: "compass", label: "All courses" },
  ],
};

// Web courses (no Python runner) — link to the web track + the shared profile.
const WEB_QUICK_LINKS: QuickLink[] = [
  { href: "/learn/profile", icon: "trophy", label: "Achievements" },
  { href: "/tracks/web", icon: "compass", label: "All courses" },
];

export function Sidebar({
  mobileOpen,
  onClose,
  courseId = "python",
}: {
  mobileOpen: boolean;
  onClose: () => void;
  courseId?: string;
}) {
  const pathname = usePathname();
  const info = courseFor(courseId);
  const base = info.base;
  const { isComplete, level, rankName, levelFraction, xp, streak } = useProgress();
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const sections = useMemo(() => info.course.getNavSections(), [info]);
  const activeSlug = pathname?.startsWith(base + "/")
    ? pathname.slice(base.length + 1)
    : "";

  const courseDone = info.course.allSlugs.filter((s) => isComplete(s)).length;
  const coursePct = info.course.totalLessons
    ? Math.round((courseDone / info.course.totalLessons) * 100)
    : 0;
  const quickLinks = QUICK_LINKS[courseId] ?? WEB_QUICK_LINKS;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        lessons: s.lessons.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.summary.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q)
        ),
      }))
      .filter((s) => s.lessons.length > 0);
  }, [query, sections]);

  const content = (
    <div className="flex h-full flex-col">
      {/* Course header */}
      <div className="flex items-center gap-3 px-5 pb-4 pt-5">
        <Link
          href={base}
          onClick={onClose}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-glow"
        >
          <Glyph name={info.glyph} className="h-5 w-5" />
        </Link>
        <Link href={base} onClick={onClose} className="min-w-0 flex-1">
          <div className="truncate font-display text-lg font-bold tracking-tight text-fg">
            {info.name}
          </div>
        </Link>
        <span className="font-mono text-xs font-semibold text-accent-text">
          {coursePct}%
        </span>
        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted lg:hidden"
          aria-label="Close menu"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mx-4 mb-3">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="w-full rounded-xl border border-border bg-surface-2/60 py-2 pl-9 pr-3 text-sm text-fg placeholder:text-faint focus:border-accent/50 focus:outline-none"
        />
      </div>

      {/* Quick links (vertical) */}
      <div className="mb-2 space-y-0.5 px-3">
        {quickLinks.map((q) => {
          const active = pathname === q.href;
          return (
            <Link
              key={q.href + q.label}
              href={q.href}
              onClick={onClose}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-accent/10 text-accent-text"
                  : "text-muted hover:bg-surface-2/70 hover:text-fg"
              }`}
            >
              <Glyph name={q.icon} className="h-4 w-4" />
              {q.label}
            </Link>
          );
        })}
      </div>

      <div className="mx-5 mb-1 border-t border-border" />

      {/* Nav */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-1">
        {filtered.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-faint">
            No lessons match “{query}”.
          </p>
        )}
        {filtered.map((section) => {
          const isCollapsed = collapsed[section.name] && !query;
          const doneInSection = section.lessons.filter((l) =>
            isComplete(l.slug)
          ).length;
          return (
            <div key={section.name} className="mb-1">
              <button
                type="button"
                onClick={() =>
                  setCollapsed((c) => ({ ...c, [section.name]: !c[section.name] }))
                }
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-2/70"
              >
                <Glyph
                  name={categoryGlyph(section.name)}
                  className="h-4 w-4 text-accent/80"
                />
                <span className="flex-1 text-[11px] font-bold uppercase tracking-wider text-muted">
                  {section.name}
                </span>
                <span className="font-mono text-[10px] text-faint">
                  {doneInSection}/{section.lessons.length}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-faint transition-transform ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {section.lessons.map((lesson) => {
                      const active = lesson.slug === activeSlug;
                      const done = isComplete(lesson.slug);
                      return (
                        <li key={lesson.slug}>
                          <Link
                            href={`${base}/${lesson.slug}`}
                            onClick={onClose}
                            className={`group relative flex items-center gap-2.5 rounded-lg py-1.5 pl-3 pr-2 text-sm transition-colors ${
                              active
                                ? "bg-accent/10 font-semibold text-accent"
                                : "text-muted hover:bg-surface-2/70 hover:text-fg"
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="active-pill"
                                className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent"
                              />
                            )}
                            <span
                              className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[9px] ${
                                done
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : active
                                  ? "border-accent text-accent"
                                  : "border-border text-transparent"
                              }`}
                            >
                              {done && <CheckIcon className="h-2.5 w-2.5" />}
                            </span>
                            <span className="truncate">{lesson.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Level card (pinned bottom) */}
      <Link
        href="/learn/profile"
        onClick={onClose}
        className="m-3 flex items-center gap-2.5 rounded-2xl border border-border bg-surface-2/60 p-3 transition-colors hover:border-accent/40"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/20 text-accent-text">
          <Glyph name={rankGlyph(rankName)} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold text-fg">
              Lv {level} · {rankName}
            </span>
            {streak > 0 && (
              <span className="ml-auto flex shrink-0 items-center gap-0.5 text-xs font-bold text-orange-500">
                <FlameIcon className="h-3.5 w-3.5" />
                {streak}
              </span>
            )}
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500"
              style={{ width: `${Math.round(levelFraction * 100)}%` }}
            />
          </div>
          <div className="mt-1 font-mono text-[10px] text-faint">
            {xp.toLocaleString()} XP
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[300px] border-r border-border bg-surface/60 backdrop-blur-xl lg:block print:hidden">
        {content}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-[320px] border-r border-border bg-surface lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

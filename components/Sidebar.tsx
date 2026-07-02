"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getNavSections } from "@/lib/content";
import { TOTAL_LESSONS } from "@/lib/curriculum";
import { useProgress } from "./ProgressContext";
import { ProgressRing } from "./ProgressRing";
import {
  SearchIcon,
  ChevronDown,
  CheckIcon,
  CloseIcon,
} from "./Icons";

const SECTIONS = getNavSections();

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { isComplete, count } = useProgress();
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const activeSlug = pathname?.startsWith("/learn/")
    ? pathname.replace("/learn/", "")
    : "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.map((s) => ({
      ...s,
      lessons: s.lessons.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.summary.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q)
      ),
    })).filter((s) => s.lessons.length > 0);
  }, [query]);

  const pct = TOTAL_LESSONS ? count / TOTAL_LESSONS : 0;

  const content = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pb-4 pt-5">
        <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-lg shadow-glow">
            🐍
          </span>
          <span className="text-xl font-black tracking-tight">
            <span className="text-gradient">PyQuest</span>
          </span>
        </Link>
        <span className="ml-1 rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-semibold text-faint">
          Python 101
        </span>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto grid h-8 w-8 place-items-center rounded-lg border border-border text-muted lg:hidden"
          aria-label="Close menu"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Progress */}
      <Link
        href="/learn"
        onClick={onClose}
        className="mx-4 mb-3 flex items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-3 transition-colors hover:border-accent/40"
      >
        <ProgressRing value={pct} size={42} stroke={4}>
          <span className="text-[10px] font-bold text-fg">
            {Math.round(pct * 100)}%
          </span>
        </ProgressRing>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-fg">Your progress</div>
          <div className="text-xs text-muted">
            {count} of {TOTAL_LESSONS} lessons done
          </div>
        </div>
      </Link>

      {/* Search */}
      <div className="relative mx-4 mb-2">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons…"
          className="w-full rounded-xl border border-border bg-surface-2/60 py-2 pl-9 pr-3 text-sm text-fg placeholder:text-faint focus:border-accent/50 focus:outline-none"
        />
      </div>

      {/* Nav */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-6 pt-1">
        {filtered.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-faint">
            No lessons match “{query}”.
          </p>
        )}
        {filtered.map((section, si) => {
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
                <span className="text-sm">{section.emoji}</span>
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
                            href={`/learn/${lesson.slug}`}
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
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[300px] border-r border-border bg-surface/60 backdrop-blur-xl lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
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

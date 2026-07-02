"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { searchLessons } from "@/lib/search";
import { Glyph, categoryGlyph, lessonGlyph } from "./glyphs";
import { SearchIcon, ArrowRight } from "./Icons";

export const OPEN_COMMAND_EVENT = "pyquest:open-command";

export function openCommandPalette() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_COMMAND_EVENT));
  }
}

interface Item {
  kind: "action" | "lesson";
  label: string;
  sublabel?: string;
  icon: string;
  run: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router]
  );

  const actions: Item[] = useMemo(
    () => [
      { kind: "action", label: "Course dashboard", icon: "compass", run: () => go("/learn") },
      { kind: "action", label: "Playground", sublabel: "Run Python live", icon: "flask", run: () => go("/learn/playground") },
      { kind: "action", label: "Practice", sublabel: "Review past lessons", icon: "loop", run: () => go("/learn/review") },
      { kind: "action", label: "Projects", sublabel: "Capstone builds", icon: "puzzle", run: () => go("/learn/projects") },
      { kind: "action", label: "Achievements", sublabel: "XP, badges & stats", icon: "trophy", run: () => go("/learn/profile") },
      { kind: "action", label: "Certificate", sublabel: "Your completion certificate", icon: "gradcap", run: () => go("/learn/certificate") },
      {
        kind: "action",
        label: "Toggle theme",
        icon: "wand",
        run: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          close();
        },
      },
    ],
    [go, setTheme, resolvedTheme, close]
  );

  const items: Item[] = useMemo(() => {
    if (!query.trim()) return actions;
    const results = searchLessons(query, 8).map<Item>((r) => ({
      kind: "lesson",
      label: r.title,
      sublabel: r.snippet || r.summary,
      icon: lessonGlyph(r.slug),
      run: () => go(`/learn/${r.slug}`),
    }));
    // also allow matching an action by label
    const q = query.toLowerCase();
    const matchedActions = actions.filter((a) => a.label.toLowerCase().includes(q));
    return [...matchedActions, ...results];
  }, [query, actions, go]);

  useEffect(() => setActive(0), [query]);

  // Global open shortcut + custom event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40);
  }, [open]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(items.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      items[active]?.run();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[120] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-glow"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <SearchIcon className="h-4 w-4 shrink-0 text-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onListKey}
                placeholder="Search lessons or jump to…"
                className="w-full bg-transparent py-3.5 text-fg placeholder:text-faint focus:outline-none"
              />
              <kbd className="hidden shrink-0 rounded-md border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-faint sm:block">
                ESC
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {items.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-faint">
                  No matches for “{query}”.
                </div>
              )}
              {!query.trim() && (
                <div className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-faint">
                  Jump to
                </div>
              )}
              {items.map((it, i) => (
                <button
                  key={`${it.kind}-${it.label}-${i}`}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => it.run()}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    i === active ? "bg-accent/10" : "hover:bg-surface-2/70"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                      i === active ? "bg-accent/15 text-accent" : "bg-surface-2 text-muted"
                    }`}
                  >
                    <Glyph name={it.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-fg">
                      {it.label}
                    </span>
                    {it.sublabel && (
                      <span className="block truncate text-xs text-muted">
                        {it.sublabel}
                      </span>
                    )}
                  </span>
                  {i === active && (
                    <ArrowRight className="h-4 w-4 shrink-0 text-accent" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-faint">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-surface-2 px-1">↑</kbd>
                <kbd className="rounded border border-border bg-surface-2 px-1">↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-surface-2 px-1">↵</kbd>
                open
              </span>
              <span className="ml-auto flex items-center gap-1">
                <kbd className="rounded border border-border bg-surface-2 px-1">[</kbd>
                <kbd className="rounded border border-border bg-surface-2 px-1">]</kbd>
                prev / next lesson
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
